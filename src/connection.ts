import { stringify as querystringify } from "querystring";
import { C8Error, HttpError } from "./error";
import {
  C8jsResponse,
  createRequest,
  isBrowser,
  RequestFunction,
} from "./util/request";

const jwtDecode = require("jwt-decode");

const LinkedList = require("linkedlist/lib/linkedlist") as typeof Array;

export const MIME_JSON = /\/(json|javascript)(\W|$)/;
const LEADER_ENDPOINT_HEADER = "x-c8-endpoint";

export type LoadBalancingStrategy = "NONE" | "ROUND_ROBIN" | "ONE_RANDOM";

interface SystemError extends Error {
  code: string;
  errno: number | string;
  syscall: string;
}

function isSystemError(err: Error): err is SystemError {
  return (
    Object.getPrototypeOf(err) === Error.prototype &&
    err.hasOwnProperty("code") &&
    err.hasOwnProperty("errno") &&
    err.hasOwnProperty("syscall")
  );
}

type UrlInfo = {
  absolutePath?: boolean;
  basePath?: string;
  path?: string;
  qs?: string | { [key: string]: any };
};

export type RequestOptions = {
  host?: number;
  method?: string;
  body?: any;
  expectBinary?: boolean;
  isBinary?: boolean;
  headers?: { [key: string]: string };
  absolutePath?: boolean;
  basePath?: string;
  path?: string;
  qs?: string | { [key: string]: any };
};

type Task = {
  host?: number;
  resolve: Function;
  reject: Function;
  retries: number;
  options: {
    method: string;
    expectBinary: boolean;
    url: { pathname: string; search?: string };
    headers: { [key: string]: string };
    body: any;
  };
};

export type Config =
  | string
  | string[]
  | Partial<{
      url: string | string[];
      fabricName: string;
      apiKey: string;
      token: string;
      isAbsolute: boolean;
      c8Version: number;
      loadBalancingStrategy: LoadBalancingStrategy;
      maxRetries: false | number;
      agent: any;
      agentOptions: { [key: string]: any };
      headers: { [key: string]: string };
    }>;

export class Connection {
  private _activeTasks: number = 0;
  private _agent?: any;
  private _agentOptions: { [key: string]: any };
  private _c8Version: number = 30000;
  private _fabricName: string | false = "_system";
  private _tenantName: string | false = "_mm";
  private _headers: { [key: string]: string };
  private _loadBalancingStrategy: LoadBalancingStrategy;
  private _useFailOver: boolean;
  private _shouldRetry: boolean;
  private _maxRetries: number;
  private _maxTasks: number;
  private _queue: Task[] = new LinkedList();
  private _hosts: RequestFunction[] = [];
  private _urls: string[] = [];
  private _activeHost: number;

  constructor(config: Config = {}) {
    if (typeof config === "string") config = { url: config };
    else if (Array.isArray(config)) config = { url: config };

    if (config.c8Version !== undefined) {
      this._c8Version = config.c8Version;
    }

    if (config.fabricName) {
      this._fabricName = config.fabricName;
    }

    if (config.isAbsolute) {
      this._fabricName = false;
      this._tenantName = false;
    }

    this._agent = config.agent;
    this._agentOptions = isBrowser
      ? { ...config.agentOptions! }
      : {
          maxSockets: 3,
          keepAlive: true,
          keepAliveMsecs: 1000,
          ...config.agentOptions,
        };
    this._maxTasks = this._agentOptions.maxSockets || 3;
    if (this._agentOptions.keepAlive) this._maxTasks *= 2;

    this._headers = { ...config.headers };

    if (config.token) {
      this._headers = {
        ...this._headers,
        authorization: `Bearer ${config.token}`,
      };
      const { tenant } = jwtDecode(config.token);
      this._tenantName = tenant;
    }

    if (config.apiKey) {
      this._headers = {
        ...this._headers,
        authorization: `apikey ${config.apiKey}`,
      };
      this._tenantName = this.extractTenantName(config.apiKey);
    }

    this._loadBalancingStrategy = config.loadBalancingStrategy || "NONE";
    this._useFailOver = this._loadBalancingStrategy !== "ROUND_ROBIN";
    if (config.maxRetries === false) {
      this._shouldRetry = false;
      this._maxRetries = 0;
    } else {
      this._shouldRetry = true;
      this._maxRetries = config.maxRetries || 0;
    }

    const urls = config.url
      ? Array.isArray(config.url)
        ? config.url
        : [config.url]
      : ["https://play.macrometa.io/"];
    const apiUrls = urls.map((url) => {
      return `https://api-${url.split("https://")[1]}`;
    });
    this.addToHostList(apiUrls);

    if (this._loadBalancingStrategy === "ONE_RANDOM") {
      this._activeHost = Math.floor(Math.random() * this._hosts.length);
    } else {
      this._activeHost = 0;
    }
  }

  private get _fabricPath() {
    return this._fabricName === false ? "" : `/_fabric/${this._fabricName}`;
  }

  private _runQueue() {
    if (!this._queue.length || this._activeTasks >= this._maxTasks) return;
    const task = this._queue.shift()!;
    let host = this._activeHost;
    if (task.host !== undefined) {
      host = task.host;
    } else if (this._loadBalancingStrategy === "ROUND_ROBIN") {
      this._activeHost = (this._activeHost + 1) % this._hosts.length;
    }
    this._activeTasks += 1;
    // @ts-ignore TS2345: Argument of type
    this._hosts[host](task.options, (err, res) => {
      this._activeTasks -= 1;
      if (err) {
        if (
          this._hosts.length > 1 &&
          this._activeHost === host &&
          this._useFailOver
        ) {
          this._activeHost = (this._activeHost + 1) % this._hosts.length;
        }
        if (
          !task.host &&
          this._shouldRetry &&
          task.retries < (this._maxRetries || this._hosts.length - 1) &&
          isSystemError(err) &&
          err.syscall === "connect" &&
          err.code === "ECONNREFUSED"
        ) {
          task.retries += 1;
          this._queue.push(task);
        } else {
          task.reject(err);
        }
      } else {
        if (isBrowser && this._agent) {
          const response = res!;
          if (
            response.status === 503 &&
            response.headers.get(LEADER_ENDPOINT_HEADER)
          ) {
            const url = response.headers.get(LEADER_ENDPOINT_HEADER)!;
            const [index] = this.addToHostList(url);
            task.host = index;
            if (this._activeHost === host) {
              this._activeHost = index;
            }
            this._queue.push(task);
          } else {
            response.host = host;
            task.resolve(response);
          }
        } else {
          const response = res!;

          if (
            response.statusCode === 503 &&
            response.headers[LEADER_ENDPOINT_HEADER]
          ) {
            const url = response.headers[LEADER_ENDPOINT_HEADER]!;
            const [index] = this.addToHostList(url);
            task.host = index;
            if (this._activeHost === host) {
              this._activeHost = index;
            }
            this._queue.push(task);
          } else {
            response.host = host;
            task.resolve(response);
          }
        }
      }
      this._runQueue();
    });
  }

  private _buildUrl({ absolutePath = false, basePath, path, qs }: UrlInfo) {
    let pathname = "";
    let search;
    if (!absolutePath) {
      pathname = this._fabricPath;
      if (basePath) pathname += basePath;
    }
    if (path) pathname += path;
    if (qs) {
      if (typeof qs === "string") search = `?${qs}`;
      else search = `?${querystringify(qs)}`;
    }
    return search ? { pathname, search } : { pathname };
  }

  private _sanitizeEndpointUrl(url: string): string {
    if (url.startsWith("tcp:")) return url.replace(/^tcp:/, "http:");
    if (url.startsWith("ssl:")) return url.replace(/^ssl:/, "https:");
    return url;
  }

  addToHostList(urls: string | string[]): number[] {
    const cleanUrls = (Array.isArray(urls) ? urls : [urls]).map((url) =>
      this._sanitizeEndpointUrl(url)
    );
    const newUrls = cleanUrls.filter((url) => this._urls.indexOf(url) === -1);
    this._urls.push(...newUrls);
    this._hosts.push(
      ...newUrls.map((url: string) =>
        createRequest(url, this._agentOptions, this._agent)
      )
    );
    return cleanUrls.map((url) => this._urls.indexOf(url));
  }

  get c8Major() {
    return Math.floor(this._c8Version / 10000);
  }

  getFabricName(): string | false {
    return this._fabricName;
  }

  getTenantName(): string | false {
    return this._tenantName;
  }

  getUrls(): string[] {
    return this._urls;
  }

  getActiveHost() {
    return this._activeHost;
  }

  setFabricName(fabricName: string) {
    if (this._fabricName === false) {
      throw new Error("Can not change fabric from absolute URL");
    }
    this._fabricName = fabricName;
  }

  setTenantName(tenantName: string) {
    if (this._tenantName === false) {
      throw new Error("Can not change tenant from absolute URL");
    }
    this._tenantName = tenantName;
  }

  setHeader(key: string, value: string) {
    this._headers[key] = value;
  }

  close() {
    for (const host of this._hosts) {
      if (host.close) host.close();
    }
  }

  extractTenantName(apiKey: string) {
    let apiKeyArr = apiKey.split(".");
    apiKeyArr.splice(-2, 2);
    return apiKeyArr.join(".") || "_mm";
  }

  request<T = C8jsResponse>(
    {
      host,
      method = "GET",
      body,
      expectBinary = false,
      isBinary = false,
      headers,
      ...urlInfo
    }: RequestOptions,
    getter?: (res: C8jsResponse) => T
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let contentType = "text/plain";
      let path = urlInfo.path;

      if (isBinary) {
        contentType = "application/octet-stream";
      } else if (body) {
        if (typeof body === "object") {
          body = JSON.stringify(body);
          contentType = "application/json";
        } else {
          body = String(body);
        }
      } else if ((path && path.includes("/streams")) === true) {
        contentType = "application/json";
      }

      const extraHeaders: { [key: string]: string } = {
        ...this._headers,
        "content-type": contentType,
        "x-c8-version": String(this._c8Version),
      };
      this._queue.push({
        retries: 0,
        host,
        options: {
          url: this._buildUrl(urlInfo),
          headers: { ...extraHeaders, ...headers },
          method,
          expectBinary,
          body,
        },
        reject,
        resolve: (res: any) => {
          if (isBrowser && this._agent) {
            res
              .json()
              .then((data: any) => {
                if (
                  data.hasOwnProperty("error") &&
                  data.hasOwnProperty("code") &&
                  data.hasOwnProperty("errorMessage") &&
                  data.hasOwnProperty("errorNum")
                ) {
                  reject(new C8Error({ body: data }));
                } else if (res.status && res.status >= 400) {
                  reject(new HttpError({ body: data }));
                } else {
                  resolve(
                    getter
                      ? getter({ body: data } as any)
                      : ({ body: data } as any)
                  );
                }
              })
              .catch((err: any) => {
                reject(err);
              });
          } else {
            const contentType = res.headers["content-type"];
            let parsedBody: any = undefined;

            if (
              res.body.length &&
              contentType &&
              contentType.match(MIME_JSON)
            ) {
              try {
                parsedBody = res.body;
                parsedBody = JSON.parse(parsedBody);
              } catch (e) {
                if (!expectBinary) {
                  if (typeof parsedBody !== "string") {
                    parsedBody = res.body.toString("utf-8");
                  }
                  // @ts-ignore TS18046: 'e' is of type 'unknown'.
                  e.response = res;
                  reject(e);
                  return;
                }
              }
            } else if (res.body && !expectBinary) {
              parsedBody = res.body.toString("utf-8");
            } else {
              parsedBody = res.body;
            }

            if (
              parsedBody &&
              parsedBody.hasOwnProperty("error") &&
              parsedBody.hasOwnProperty("code") &&
              parsedBody.hasOwnProperty("errorMessage") &&
              parsedBody.hasOwnProperty("errorNum")
            ) {
              res.body = parsedBody;
              reject(new C8Error(res));
            } else if (res.statusCode && res.statusCode >= 400) {
              res.body = parsedBody;
              reject(new HttpError(res));
            } else {
              if (!expectBinary) res.body = parsedBody;
              resolve(getter ? getter(res) : (res as any));
            }
          }
        },
      });
      this._runQueue();
    });
  }
}
