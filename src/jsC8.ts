import { c8ql } from "./c8ql-query";
import { CollectionType } from "./collection";
import { Config } from "./connection";
import { Fabric } from "./fabric";
import { C8Error } from "./error";
import { Stream } from "./stream";
import { Tenant } from "./tenant";

export default function jsC8(config: Config) {
  return new Fabric(config);
}

Object.assign(jsC8, { CollectionType, C8Error, Fabric, c8ql });
export { DocumentCollection, EdgeCollection } from "./collection";
export { Graph } from "./graph";
export { Fabric, c8ql, Tenant, Stream };
