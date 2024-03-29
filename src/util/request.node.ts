import {
  Agent as HttpAgent,
  ClientRequest,
  IncomingMessage,
  request as httpRequest,
} from "http";
import { Agent as HttpsAgent, request as httpsRequest } from "https";
import { parse as parseUrl, Url } from "url";
import { joinPath } from "./joinPath";
import { Errback } from "./types";

export type C8jsResponse = IncomingMessage & {
  body?: any;
  host?: number;
};

export type C8jsError = Error & {
  request: ClientRequest;
};

export interface RequestOptions {
  method: string;
  url: Url;
  headers: { [key: string]: string };
  body: any;
  expectBinary: boolean;
}

export interface RequestFunction {
  (opts: RequestOptions, cb: Errback<C8jsResponse | any>): void;
  close?: () => void;
}

export const isBrowser = false;

export function createRequest(
  baseUrl: string,
  agentOptions: any,
  agent: any
): RequestFunction {
  const baseUrlParts = parseUrl(baseUrl);
  const isTls = baseUrlParts.protocol === "https:";
  if (!agent) {
    if (isTls) agent = new HttpsAgent(agentOptions);
    else agent = new HttpAgent(agentOptions);
  }
  return Object.assign(
    function request(
      { method, url, headers, body }: RequestOptions,
      callback: Errback<C8jsResponse>
    ) {
      let path = baseUrlParts.pathname
        ? url.pathname
          ? joinPath(baseUrlParts.pathname, url.pathname)
          : baseUrlParts.pathname
        : url.pathname;
      const search = url.search
        ? baseUrlParts.search
          ? `${baseUrlParts.search}&${url.search.slice(1)}`
          : url.search
        : baseUrlParts.search;
      if (search) path += search;
      if (body && !headers["content-length"]) {
        headers["content-length"] = String(Buffer.byteLength(body));
      }
      const options: any = { path, method, headers, agent };
      options.hostname = baseUrlParts.hostname;
      options.port = baseUrlParts.port;
      options.auth = baseUrlParts.auth;
      let called = false;
      try {
        const req = (isTls ? httpsRequest : httpRequest)(
          options,
          (res: IncomingMessage) => {
            const data: Buffer[] = [];
            res.on("data", (chunk) => data.push(chunk as Buffer));
            res.on("end", () => {
              const result = res as C8jsResponse;
              result.body = Buffer.concat(data);
              if (called) return;
              called = true;
              callback(null, result);
            });
          }
        );
        req.on("error", (err) => {
          const error = err as C8jsError;
          error.request = req;
          if (called) return;
          called = true;
          callback(err);
        });
        if (body) req.write(body);
        req.end();
      } catch (e) {
        if (called) return;
        called = true;
        if (e instanceof Error) {
          callback(e);
        }
      }
    },
    {
      close() {
        agent.destroy();
      },
    }
  );
}
