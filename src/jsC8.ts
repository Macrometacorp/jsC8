import { c8ql } from "./c8ql-query";
import { CollectionType } from "./collection";
import { Config } from "./connection";
import { Fabric } from "./fabric";
import { C8Error } from "./error";
import { Stream, StreamType } from "./stream";

export default function jsC8(config: Config) {
  return new Fabric(config);
}

Object.assign(jsC8, { CollectionType, C8Error, Fabric, c8ql, StreamType });
export { DocumentCollection, EdgeCollection } from "./collection";
export { Graph } from "./graph";
export { Tenant } from "./tenant";
export { Fabric, c8ql, Stream };
