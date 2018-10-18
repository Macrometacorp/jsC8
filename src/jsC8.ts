import { c8ql } from "./c8ql-query";
import { CollectionType } from "./collection";
import { Config } from "./connection";
import { Database } from "./database";
import { C8Error } from "./error";

export default function jsC8(config: Config) {
  return new Database(config);
}

Object.assign(jsC8, { CollectionType, C8Error, Database, c8ql });
export { DocumentCollection, EdgeCollection } from "./collection";
export { Graph } from "./graph";
export { Database, c8ql };
