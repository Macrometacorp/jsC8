import { C8jsError, C8jsResponse, RequestOptions } from "./request.node";
import { format as formatUrl, parse as parseUrl } from "url";

import { Errback } from "./types";
import { joinPath } from "./joinPath";
import xhr from "./xhr";
import { MIME_JSON } from "../connection";

export const isBrowser = true;

function omit<T>(obj: T, keys: (keyof T)[]): T {
  const result = {} as T;
  for (const key of Object.keys(obj)) {
    if (keys.includes(key as keyof T)) continue;
    result[key as keyof T] = obj[key as keyof T];
  }
  return result;
}

export function createRequest(baseUrl: string, agentOptions: any, fetch: any) {
  const baseUrlParts = parseUrl(baseUrl);
  const options = omit(agentOptions, [
    "keepAlive",
    "keepAliveMsecs",
    "maxSockets",
  ]);

  return function request(
    { method, url, headers, body, expectBinary }: RequestOptions,
    cb: Errback<C8jsResponse>
  ) {
    const urlParts = {
      ...baseUrlParts,
      pathname: url.pathname
        ? baseUrlParts.pathname
          ? joinPath(baseUrlParts.pathname, url.pathname)
          : url.pathname
        : baseUrlParts.pathname,
      search: url.search
        ? baseUrlParts.search
          ? `${baseUrlParts.search}&${url.search.slice(1)}`
          : url.search
        : baseUrlParts.search,
    };

    let callback: Errback<C8jsResponse> = (err, res) => {
      callback = () => undefined;
      cb(err, res);
    };

    if (fetch) {
      const req = fetch(formatUrl(urlParts), {
        ...options,
        body,
        method,
        headers,
      })
        .then((res: any) => {
          const contentType = res.headers.get("content-type");
          if (contentType.match(MIME_JSON)) {
            return res;
          } else {
            throw res;
          }
        })
        .then((data: any) => {
          callback(null, data as any);
        })
        .catch((err: any) => {
          const error = {} as any;
          error.request = req;
          if (err.status) {
            error.status = err.status;
          }
          if (err.statusText) {
            error.statusText = err.statusText;
          }
          callback(error);
        });
    } else {
      const req = xhr(
        {
          responseType: expectBinary ? "blob" : "text",
          ...options,
          url: formatUrl(urlParts),
          useXDR: true,
          body,
          method,
          headers,
        },
        (err: Error | null, res?: any) => {
          if (!err) {
            if (!res.body) res.body = "";
            callback(null, res as C8jsResponse);
          } else {
            const error = err as C8jsError;
            error.request = req;
            callback(error);
          }
        }
      );
    }
  };
}
