import { Fields, MultipartRequest } from "./multipart";

import { Errback } from "./types";

export function toForm(fields: Fields, callback: Errback<MultipartRequest>) {
  let form;
  try {
    form = new FormData();
    for (const key of Object.keys(fields)) {
      let value = fields[key];
      if (value === undefined) continue;
      if (
        !(value instanceof Blob) &&
        (typeof value === "object" || typeof value === "function")
      ) {
        value = JSON.stringify(value);
      }
      form.append(key, value);
    }
  } catch (e) {
    if (e instanceof Error) {
      callback(e);
    }
    return;
  }
  callback(null, { body: form });
}
