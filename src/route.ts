import { C8jsResponse } from "./util/request";
import { Connection } from "./connection";

export class Route {
  private _connection: Connection;
  private _path: string;
  private _headers: Object;

  constructor(connection: Connection, path: string = "", headers: Object = {}) {
    if (!path) path = "";
    else if (path.charAt(0) !== "/") path = `/${path}`;
    this._connection = connection;
    this._path = path;
    this._headers = headers;
  }

  route(path: string, headers?: Object) {
    if (!path) path = "";
    else if (path.charAt(0) !== "/") path = `/${path}`;
    return new Route(this._connection, this._path + path, {
      ...this._headers,
      ...headers
    });
  }

  request({ method, path, headers = {}, ...opts }: any) {
    if (!path) opts.path = "";
    else if (this._path && path.charAt(0) !== "/") opts.path = `/${path}`;
    else opts.path = path;
    opts.basePath = this._path;
    opts.headers = { ...this._headers, ...headers };
    opts.method = method ? method.toUpperCase() : "GET";
    return this._connection.request(opts);
  }

  private _request1(method: string, ...args: any[]) {
    let path: string = "";
    let qs: Object | undefined;
    let headers: Object | undefined;
    if (args[0] === undefined || typeof args[0] === "string") {
      path = args.shift();
    }
    if (args[0] === undefined || typeof args[0] === "object") {
      qs = args.shift();
    }
    if (args[0] === undefined || typeof args[0] === "object") {
      headers = args.shift();
    }
    return this.request({ method, path, qs, headers });
  }

  private _request2(method: string, ...args: any[]) {
    let path: string = "";
    let body: any = undefined;
    let qs: Object | undefined;
    let headers: Object | undefined;
    if (args[0] === undefined || typeof args[0] === "string") {
      path = args.shift();
    }
    body = args.shift();
    if (args[0] === undefined || typeof args[0] === "object") {
      qs = args.shift();
    }
    if (args[0] === undefined || typeof args[0] === "object") {
      headers = args.shift();
    }
    return this.request({ method, path, body, qs, headers });
  }

  delete(): Promise<C8jsResponse>;
  delete(path?: string): Promise<C8jsResponse>;
  delete(path?: string, qs?: Object): Promise<C8jsResponse>;
  delete(qs?: Object): Promise<C8jsResponse>;
  delete(qs?: Object, headers?: Object): Promise<C8jsResponse>;
  delete(
    path?: string,
    qs?: Object,
    headers?: Object
  ): Promise<C8jsResponse>;
  delete(...args: any[]): Promise<C8jsResponse> {
    return this._request1("DELETE", ...args);
  }

  get(): Promise<C8jsResponse>;
  get(path?: string): Promise<C8jsResponse>;
  get(path?: string, qs?: Object): Promise<C8jsResponse>;
  get(path?: string, qs?: Object, headers?: Object): Promise<C8jsResponse>;
  get(qs?: Object): Promise<C8jsResponse>;
  get(qs?: Object, headers?: Object): Promise<C8jsResponse>;
  get(...args: any[]): Promise<C8jsResponse> {
    return this._request1("GET", ...args);
  }

  head(): Promise<C8jsResponse>;
  head(path?: string): Promise<C8jsResponse>;
  head(path?: string, qs?: Object): Promise<C8jsResponse>;
  head(path?: string, qs?: Object, headers?: Object): Promise<C8jsResponse>;
  head(qs?: Object): Promise<C8jsResponse>;
  head(qs?: Object, headers?: Object): Promise<C8jsResponse>;
  head(...args: any[]): Promise<C8jsResponse> {
    return this._request1("HEAD", ...args);
  }

  patch(): Promise<C8jsResponse>;
  patch(path?: string): Promise<C8jsResponse>;
  patch(path?: string, body?: any): Promise<C8jsResponse>;
  patch(path?: string, body?: any, qs?: Object): Promise<C8jsResponse>;
  patch(body?: any): Promise<C8jsResponse>;
  patch(body?: any, qs?: Object): Promise<C8jsResponse>;
  patch(body?: any, qs?: Object, headers?: Object): Promise<C8jsResponse>;
  patch(
    path?: string,
    body?: any,
    qs?: Object,
    headers?: Object
  ): Promise<C8jsResponse>;
  patch(...args: any[]): Promise<C8jsResponse> {
    return this._request2("PATCH", ...args);
  }

  post(): Promise<C8jsResponse>;
  post(path?: string): Promise<C8jsResponse>;
  post(path?: string, body?: any): Promise<C8jsResponse>;
  post(path?: string, body?: any, qs?: Object): Promise<C8jsResponse>;
  post(body?: any): Promise<C8jsResponse>;
  post(body?: any, qs?: Object): Promise<C8jsResponse>;
  post(body?: any, qs?: Object, headers?: Object): Promise<C8jsResponse>;
  post(
    path?: string,
    body?: any,
    qs?: Object,
    headers?: Object
  ): Promise<C8jsResponse>;
  post(...args: any[]): Promise<C8jsResponse> {
    return this._request2("POST", ...args);
  }

  put(): Promise<C8jsResponse>;
  put(path?: string): Promise<C8jsResponse>;
  put(path?: string, body?: any): Promise<C8jsResponse>;
  put(path?: string, body?: any, qs?: Object): Promise<C8jsResponse>;
  put(body?: any): Promise<C8jsResponse>;
  put(body?: any, qs?: Object): Promise<C8jsResponse>;
  put(body?: any, qs?: Object, headers?: Object): Promise<C8jsResponse>;
  put(
    path?: string,
    body?: any,
    qs?: Object,
    headers?: Object
  ): Promise<C8jsResponse>;
  put(...args: any[]): Promise<C8jsResponse> {
    return this._request2("PUT", ...args);
  }
}
