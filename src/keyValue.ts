import { Connection } from "./connection";

export type KVPairHandle = {
  _key?: string;
  value: any;
  expireAt: number;
};

export type KVCreateOptsObj = {
  stream?: boolean;
  expiration?: boolean;
  waitForSync?: boolean;
};

export type KVValueOptsObj = {
  offset?: number;
  limit?: number;
};

export class KeyValue {
  private _connection: Connection;
  name: string;

  constructor(connection: Connection, name: string) {
    this._connection = connection;
    this.name = name;
  }

  getCollections() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/kv",
      },
      (res) => res.body
    );
  }

  getKVCount() {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/kv/${this.name}/count`,
      },
      (res) => res.body
    );
  }

  getKVKeys(opts: any = {}) {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/kv/${this.name}/keys`,
        qs: { ...opts },
      },
      (res) => res.body
    );
  }

  getValueForKey(key: string) {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/kv/${this.name}/value/${key}`,
      },
      (res) => res.body
    );
  }

  createCollection(opts?: KVCreateOptsObj) {
    let [expiration, stream, waitForSync] = [false, false, false];

    if (opts && opts.expiration) {
      expiration = opts.expiration;
    }

    if (opts && opts.stream) {
      stream = opts.stream;
    }

    if (opts && opts.waitForSync) {
      waitForSync = opts.waitForSync;
    }

    return this._connection.request(
      {
        method: "POST",
        path: `/_api/kv/${this.name}`,
        qs: {
          expiration,
        },
        body: { stream, waitForSync },
      },
      (res) => res.body
    );
  }

  deleteCollection() {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/_api/kv/${this.name}`,
      },
      (res) => res.body
    );
  }

  deleteEntryForKey(key: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/_api/kv/${this.name}/value/${key}`,
      },
      (res) => res.body
    );
  }

  deleteEntryForKeys(keys: string[]) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/_api/kv/${this.name}/values`,
        body: keys,
      },
      (res) => res.body
    );
  }

  insertKVPairs(keyValuePairs: KVPairHandle[]) {
    return this._connection.request(
      {
        method: "PUT",
        path: `/_api/kv/${this.name}/value`,
        body: keyValuePairs,
      },
      (res) => res.body
    );
  }

  getKVCollectionValues(keys: string[], opts?: KVValueOptsObj) {
    const qs: { [key: string]: any } = {};

    if (opts && opts.limit) {
      qs.limit = opts.limit;
    }

    if (opts && opts.offset) {
      qs.offset = opts.offset;
    }

    return this._connection.request(
      {
        method: "POST",
        path: `/_api/kv/${this.name}/values`,
        body: keys,
        qs,
      },
      (res) => res.body
    );
  }

  truncateKVCollectionByName() {
    return this._connection.request(
      {
        method: "PUT",
        path: `/_api/kv/${this.name}/truncate`,
      },
      (res) => res.body
    );
  }
}
