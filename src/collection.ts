import { Connection } from "./connection";
import { isC8Error } from "./error";
import { Stream } from "./stream";

export enum CollectionType {
  DOCUMENT_COLLECTION = 2,
  EDGE_COLLECTION = 3,
}

export type DocumentHandle =
  | string
  | {
      _key?: string;
      _id?: string;
    };

export type DocumentsHandle = {
  _key: string;
  _id?: string | undefined;
  [key: string]: any;
};

export type IndexHandle =
  | string
  | {
      id?: string;
    };

export interface ImportOptions {
  type?: null | "auto" | "documents" | "array";
  fromPrefix?: string;
  toPrefix?: string;
  overwrite?: boolean;
  waitForSync?: boolean;
  onDuplicate?: "error" | "update" | "replace" | "ignore";
  complete?: boolean;
  details?: boolean;
}

export interface ImportResult {
  error: false;
  created: number;
  errors: number;
  empty: number;
  updated: number;
  ignored: number;
  details?: string[];
}

export interface CollectionUpdateProperties {
  hasStream?: boolean;
  waitForSync?: boolean;
}

export interface CollectionCreateProperties {
  stream?: boolean;
  waitForSync?: boolean;
  isSystem?: boolean;
  isLocal?: boolean;
}

export function isC8Collection(collection: any): collection is C8Collection {
  return Boolean(collection && collection.isC8Collection);
}

export interface C8Collection {
  isC8Collection: true;
  name: string;
}

export const DOCUMENT_NOT_FOUND = 1202;
export const COLLECTION_NOT_FOUND = 1203;
export abstract class BaseCollection implements C8Collection {
  isC8Collection: true = true;
  name: string;
  protected stream: Stream;
  abstract type: CollectionType;
  protected _idPrefix: string;
  protected _connection: Connection;

  constructor(connection: Connection, name: string) {
    this.name = name;
    this._idPrefix = `${this.name}/`;
    this._connection = connection;
    this.stream = new Stream(connection, name, true, true);
    if (this._connection.c8Major >= 3) {
      this.createCapConstraint = undefined!;
    }
  }

  protected _documentPath(documentHandle: DocumentHandle) {
    return `/document/${this._documentHandle(documentHandle)}`;
  }

  protected _documentHandle(documentHandle: DocumentHandle) {
    if (typeof documentHandle !== "string") {
      if (documentHandle._id) {
        return documentHandle._id;
      }
      if (documentHandle._key) {
        return this._idPrefix + documentHandle._key;
      }
      throw new Error("Document handle must be a document or string");
    }
    if (documentHandle.indexOf("/") === -1) {
      return this._idPrefix + documentHandle;
    }
    return documentHandle;
  }

  protected _indexHandle(indexHandle: IndexHandle) {
    if (typeof indexHandle !== "string") {
      if (indexHandle.id) {
        return indexHandle.id;
      }
      throw new Error("Index handle must be a index or string");
    }
    if (indexHandle.indexOf("/") === -1) {
      return this._idPrefix + indexHandle;
    }
    return indexHandle;
  }

  protected _get(path: string, qs?: any) {
    return this._connection.request(
      { path: `/collection/${this.name}/${path}`, qs },
      (res) => res.body
    );
  }

  protected _put(path: string, body: any) {
    return this._connection.request(
      {
        method: "PUT",
        path: `/collection/${this.name}/${path}`,
        body,
      },
      (res) => res.body
    );
  }

  get() {
    return this._connection.request(
      { path: `/collection/${this.name}` },
      (res) => res.body
    );
  }

  exists(): Promise<boolean> {
    return this.get().then(
      () => true,
      (err) => {
        if (isC8Error(err) && err.errorNum === COLLECTION_NOT_FOUND) {
          return false;
        }
        throw err;
      }
    );
  }

  create(properties?: CollectionCreateProperties) {
    return this._connection.request(
      {
        method: "POST",
        path: "/collection",
        body: {
          ...properties,
          name: this.name,
          type: this.type,
        },
      },
      (res) => res.body
    );
  }

  async onChange(dcName: string, subscriptionName: string = "subs") {
    const otp = await this.stream.getOtp();
    return this.stream.consumer(subscriptionName, dcName, { otp });
  }

  properties() {
    return this._get("properties");
  }

  count() {
    return this._get("count");
  }

  async rename(name: string) {
    const result = await this._connection.request(
      {
        method: "PUT",
        path: `/collection/${this.name}/rename`,
        body: { name },
      },
      (res) => res.body
    );
    this.name = name;
    this._idPrefix = `${name}/`;
    return result;
  }

  truncate() {
    return this._put("truncate", undefined);
  }

  drop(opts?: any) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/collection/${this.name}`,
        qs: opts,
      },
      (res) => res.body
    );
  }

  updateCollectionProperties(properties: CollectionUpdateProperties) {
    return this._connection.request(
      {
        method: "PUT",
        path: `/collection/${this.name}/properties`,
        body: { ...properties },
      },
      (res) => res.body
    );
  }

  documentExists(documentHandle: DocumentHandle): Promise<boolean> {
    return this._connection
      .request(
        {
          method: "HEAD",
          path: `/${this._documentPath(documentHandle)}`,
        },
        () => true
      )
      .catch((err) => {
        if (err.statusCode === 404) {
          return false;
        }
        throw err;
      });
  }

  document(
    documentHandle: DocumentHandle,
    graceful: boolean = false
  ): Promise<any> {
    const result = this._connection.request(
      { path: `/${this._documentPath(documentHandle)}` },
      (res) => res.body
    );
    if (!graceful) return result;
    return result.catch((err) => {
      if (isC8Error(err) && err.errorNum === DOCUMENT_NOT_FOUND) {
        return null;
      }
      throw err;
    });
  }

  replace(documentHandle: DocumentHandle, newValue: any, opts: any = {}) {
    const headers: { [key: string]: string } = {};
    if (typeof opts === "string") {
      opts = { rev: opts };
    }
    if (opts.rev && this._connection.c8Major >= 3) {
      let rev: string;
      ({ rev, ...opts } = opts);
      headers["if-match"] = rev;
    }
    return this._connection.request(
      {
        method: "PUT",
        path: `/${this._documentPath(documentHandle)}`,
        body: newValue,
        qs: opts,
        headers,
      },
      (res) => res.body
    );
  }

  replaceDocuments(documents: DocumentsHandle[], opts: any = {}) {
    const headers: { [key: string]: string } = {};
    if (typeof opts === "string") {
      opts = { rev: opts };
    }
    if (opts.rev && this._connection.c8Major >= 3) {
      let rev: string;
      ({ rev, ...opts } = opts);
      headers["if-match"] = rev;
    }
    return this._connection.request(
      {
        method: "PUT",
        path: `/${this._documentPath("")}`,
        body: documents,
        qs: opts,
        headers,
      },
      (res) => res.body
    );
  }

  update(documentHandle: DocumentHandle, newValue: any, opts: any = {}) {
    const headers: { [key: string]: string } = {};
    if (typeof opts === "string") {
      opts = { rev: opts };
    }
    if (opts.rev && this._connection.c8Major >= 3) {
      let rev: string;
      ({ rev, ...opts } = opts);
      headers["if-match"] = rev;
    }
    return this._connection.request(
      {
        method: "PATCH",
        path: `/${this._documentPath(documentHandle)}`,
        body: newValue,
        qs: opts,
        headers,
      },
      (res) => res.body
    );
  }

  updateDocuments(documents: DocumentsHandle[], opts: any = {}) {
    const headers: { [key: string]: string } = {};
    if (typeof opts === "string") {
      opts = { rev: opts };
    }
    if (opts.rev && this._connection.c8Major >= 3) {
      let rev: string;
      ({ rev, ...opts } = opts);
      headers["if-match"] = rev;
    }
    return this._connection.request(
      {
        method: "PATCH",
        path: `/${this._documentPath("")}`,
        body: documents,
        qs: opts,
        headers,
      },
      (res) => res.body
    );
  }

  remove(documentHandle: DocumentHandle, opts: any = {}) {
    const headers: { [key: string]: string } = {};
    if (typeof opts === "string") {
      opts = { rev: opts };
    }
    if (opts.rev && this._connection.c8Major >= 3) {
      let rev: string;
      ({ rev, ...opts } = opts);
      headers["if-match"] = rev;
    }
    return this._connection.request(
      {
        method: "DELETE",
        path: `/${this._documentPath(documentHandle)}`,
        qs: opts,
        headers,
      },
      (res) => res.body
    );
  }

  removeDocuments(documents: string[] | DocumentsHandle[], opts: any = {}) {
    const headers: { [key: string]: string } = {};
    if (typeof opts === "string") {
      opts = { rev: opts };
    }
    if (opts.rev && this._connection.c8Major >= 3) {
      let rev: string;
      ({ rev, ...opts } = opts);
      headers["if-match"] = rev;
    }
    return this._connection.request(
      {
        method: "DELETE",
        path: `/${this._documentPath("")}`,
        body: documents,
        qs: opts,
        headers,
      },
      (res) => res.body
    );
  }

  import(
    data: Buffer | Blob | string | any[],
    { type = "auto", ...opts }: ImportOptions = {}
  ): Promise<ImportResult> {
    if (Array.isArray(data)) {
      data = data.map((line) => JSON.stringify(line)).join("\r\n") + "\r\n";
    }
    return this._connection.request(
      {
        method: "POST",
        path: "/import",
        body: data,
        isBinary: true,
        qs: {
          type: type === null ? undefined : type,
          ...opts,
          collection: this.name,
        },
      },
      (res) => res.body
    );
  }

  indexes() {
    return this._connection.request(
      {
        path: "/index",
        qs: { collection: this.name },
      },
      (res) => res.body.indexes
    );
  }

  index(indexName: string) {
    return this._connection.request(
      { path: `/index/${this._idPrefix}${indexName}` },
      (res) => res.body
    );
  }

  createIndex(details: any) {
    return this._connection.request(
      {
        method: "POST",
        path: "/index",
        body: details,
        qs: { collection: this.name },
      },
      (res) => res.body
    );
  }

  dropIndex(indexName: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/index/${this._idPrefix}${indexName}`,
      },
      (res) => res.body
    );
  }

  createCapConstraint(opts?: any) {
    if (typeof opts === "number") {
      opts = { size: opts };
    }
    return this._connection.request(
      {
        method: "POST",
        path: "/index",
        body: { ...opts, type: "cap" },
        qs: { collection: this.name },
      },
      (res) => res.body
    );
  }

  createHashIndex(fields: string[] | string, opts?: any) {
    if (typeof fields === "string") {
      fields = [fields];
    }
    if (typeof opts === "boolean") {
      opts = { unique: opts };
    }
    return this._connection.request(
      {
        method: "POST",
        path: "/index",
        body: { unique: false, ...opts, type: "hash", fields: fields },
        qs: { collection: this.name },
      },
      (res) => res.body
    );
  }

  createSkipList(fields: string[] | string, opts?: any) {
    if (typeof fields === "string") {
      fields = [fields];
    }
    if (typeof opts === "boolean") {
      opts = { unique: opts };
    }
    return this._connection.request(
      {
        method: "POST",
        path: "/index",
        body: { unique: false, ...opts, type: "skiplist", fields: fields },
        qs: { collection: this.name },
      },
      (res) => res.body
    );
  }

  createPersistentIndex(fields: string[] | string, opts?: any) {
    if (typeof fields === "string") {
      fields = [fields];
    }
    if (typeof opts === "boolean") {
      opts = { unique: opts };
    }
    return this._connection.request(
      {
        method: "POST",
        path: "/index",
        body: { unique: false, ...opts, type: "persistent", fields: fields },
        qs: { collection: this.name },
      },
      (res) => res.body
    );
  }

  createGeoIndex(fields: string[] | string, opts?: any) {
    if (typeof fields === "string") {
      fields = [fields];
    }
    return this._connection.request(
      {
        method: "POST",
        path: "/index",
        body: { ...opts, fields, type: "geo" },
        qs: { collection: this.name },
      },
      (res) => res.body
    );
  }

  createFulltextIndex(fields: string[] | string, opts?: any) {
    if (typeof fields === "string") {
      fields = [fields];
    }
    return this._connection.request(
      {
        method: "POST",
        path: "/index",
        body: { ...opts, fields, type: "fulltext" },
        qs: { collection: this.name },
      },
      (res) => res.body
    );
  }

  createTtlIndex(
    fields: string[] | string,
    expireAfter: number,
    name?: string
  ) {
    if (typeof fields === "string") {
      fields = [fields];
    }
    return this._connection.request(
      {
        method: "POST",
        path: "/index",
        body: { fields, expireAfter, type: "ttl", name },
        qs: { collection: this.name },
      },
      (res) => res.body
    );
  }
}

export interface DocumentSaveOptions {
  waitForSync?: boolean;
  returnNew?: boolean;
  returnOld?: boolean;
  overwrite?: boolean;
  silent?: boolean;
}

export class DocumentCollection extends BaseCollection {
  type = CollectionType.DOCUMENT_COLLECTION;
  constructor(connection: Connection, name: string) {
    super(connection, name);
  }

  save(data: any, opts?: DocumentSaveOptions | boolean) {
    if (typeof opts === "boolean") {
      opts = { returnNew: opts };
    }

    if (this._connection.c8Major <= 2) {
      return this._connection.request(
        {
          method: "POST",
          path: "/document",
          body: data,
          qs: {
            ...opts,
            collection: this.name,
          },
        },
        (res) => res.body
      );
    }

    return this._connection.request(
      {
        method: "POST",
        path: `/document/${this.name}`,
        body: data,
        qs: opts,
      },
      (res) => res.body
    );
  }
}

export class EdgeCollection extends BaseCollection {
  type = CollectionType.EDGE_COLLECTION;

  constructor(connection: Connection, name: string) {
    super(connection, name);
  }

  protected _documentPath(documentHandle: DocumentHandle) {
    if (this._connection.c8Major < 3) {
      return `edge/${this._documentHandle(documentHandle)}`;
    }
    return `document/${this._documentHandle(documentHandle)}`;
  }

  edge(
    documentHandle: DocumentHandle,
    graceful: boolean = false
  ): Promise<any> {
    return this.document(documentHandle, graceful);
  }

  save(data: any, opts?: DocumentSaveOptions | boolean): Promise<any>;
  save(
    data: any,
    fromId: DocumentHandle,
    toId: DocumentHandle,
    opts?: DocumentSaveOptions | boolean
  ): Promise<any>;
  save(
    data: any,
    fromIdOrOpts?: DocumentHandle | DocumentSaveOptions | boolean,
    toId?: DocumentHandle,
    opts?: DocumentSaveOptions | boolean
  ) {
    if (toId !== undefined) {
      data._from = this._documentHandle(fromIdOrOpts as DocumentHandle);
      data._to = this._documentHandle(toId!);
    } else if (fromIdOrOpts !== undefined) {
      opts = fromIdOrOpts as DocumentSaveOptions | boolean;
    }
    if (typeof opts === "boolean") {
      opts = { returnNew: opts };
    }
    if (this._connection.c8Major <= 2) {
      return this._connection.request(
        {
          method: "POST",
          path: "/edge",
          body: data,
          qs: {
            ...opts,
            collection: this.name,
            from: data._from,
            to: data._to,
          },
        },
        (res) => res.body
      );
    }

    return this._connection.request(
      {
        method: "POST",
        path: "/document",
        body: data,
        qs: {
          ...opts,
          collection: this.name,
        },
      },
      (res) => res.body
    );
  }

  protected _edges(documentHandle: DocumentHandle, direction: any) {
    return this._connection.request(
      {
        path: `/edges/${this.name}`,
        qs: {
          direction,
          vertex: this._documentHandle(documentHandle),
        },
      },
      (res) => res.body.edges
    );
  }

  edges(vertex: DocumentHandle) {
    return this._edges(vertex, undefined);
  }

  inEdges(vertex: DocumentHandle) {
    return this._edges(vertex, "in");
  }

  outEdges(vertex: DocumentHandle) {
    return this._edges(vertex, "out");
  }

  // This endpoint and feature is not available at the moment
  // traversal(startVertex: DocumentHandle, opts?: any) {
  //   return this._connection.request(
  //     {
  //       method: "POST",
  //       path: "/traversal",
  //       body: {
  //         ...opts,
  //         startVertex,
  //         edgeCollection: this.name,
  //       },
  //     },
  //     (res) => res.body.result
  //   );
  // }
}

export function constructCollection(connection: Connection, data: any) {
  const Collection =
    data.type === CollectionType.EDGE_COLLECTION
      ? EdgeCollection
      : DocumentCollection;
  return new Collection(connection, data.name);
}
