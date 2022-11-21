import { Config, Connection } from "./connection";

export class Redis {
  protected _connection: Connection;

  constructor(config?: Config) {
    this._connection = new Connection(config);
  }

  protected _commandParser(
    command: string,
    collection: string,
    ...args: any[]
  ) {
    // Create a body for all the commands
    const data = [command, ...args];
    const filteredData = data.filter(element => {
      return element !== undefined;
    });
    let request = this._connection.request(
      {
        method: "POST",
        path: `/_api/redis/${collection}`,
        body: filteredData,
      },
      res => res.body
    );

    return request;
  }

  set(key: string, value: string, collection: string, options: any[] = []) {
    const command: string = "SET";
    return this._commandParser(command, collection, key, value, ...options);
  }

  append(key: string, value: string, collection: string) {
    const command: string = "APPEND";
    return this._commandParser(command, collection, key, value);
  }

  decr(key: string, collection: string) {
    const command: string = "DECR";
    return this._commandParser(command, collection, key);
  }

  decrby(key: string, decrement: number, collection: string) {
    const command: string = "DECRBY";
    return this._commandParser(command, collection, key, decrement);
  }

  get(key: string, collection: string) {
    const command: string = "GET";
    return this._commandParser(command, collection, key);
  }

  getdel(key: string, collection: string) {
    const command: string = "GETDEL";
    return this._commandParser(command, collection, key);
  }

  getex(
    key: string,
    collection: string,
    expiryCommand?: string,
    time?: number
  ) {
    const command: string = "GETEX";
    return this._commandParser(command, collection, key, expiryCommand, time);
  }

  getrange(key: string, start: number, end: number, collection: string) {
    const command: string = "GETRANGE";
    return this._commandParser(command, collection, key, start, end);
  }

  getset(key: string, value: string, collection: string) {
    const command: string = "GETSET";
    return this._commandParser(command, collection, key, value);
  }

  incr(key: string, collection: string) {
    const command: string = "INCR";
    return this._commandParser(command, collection, key);
  }

  incrby(key: string, increment: number, collection: string) {
    const command: string = "INCRBY";
    return this._commandParser(command, collection, key, increment);
  }

  incrbyfloat(key: string, increment: number, collection: string) {
    const command: string = "INCRBYFLOAT";
    return this._commandParser(command, collection, key, increment);
  }

  mget(keys: string[], collection: string) {
    const command: string = "MGET";
    return this._commandParser(command, collection, ...keys);
  }

  mset(data: object, collection: string) {
    const dataArray: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      dataArray.push(key);
      dataArray.push(value);
    }
    const command: string = "MSET";
    return this._commandParser(command, collection, ...dataArray);
  }

  psetex(key: string, milliseconds: number, value: number, collection: string) {
    const command: string = "PSETEX";
    return this._commandParser(command, collection, key, milliseconds, value);
  }

  setbit(key: string, offset: number, value: number, collection: string) {
    const command: string = "SETBIT";
    return this._commandParser(command, collection, key, offset, value);
  }

  msetnx(data: object, collection: string) {
    const dataArray: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      dataArray.push(key);
      dataArray.push(value);
    }
    const command: string = "MSETNX";
    return this._commandParser(command, collection, ...dataArray);
  }

  setex(key: string, seconds: number, value: string, collection: string) {
    const command: string = "SETEX";
    return this._commandParser(command, collection, key, seconds, value);
  }

  setnx(key: string, value: string, collection: string) {
    const command: string = "SETNX";
    return this._commandParser(command, collection, key, value);
  }

  setrange(key: string, offset: number, value: string, collection: string) {
    const command: string = "SETRANGE";
    return this._commandParser(command, collection, key, offset, value);
  }

  strlen(key: string, collection: string) {
    const command: string = "STRLEN";
    return this._commandParser(command, collection, key);
  }

  bitcount(
    key: string,
    collection: string,
    start?: number | undefined,
    end?: number | undefined,
    dataFormat?: string | undefined
  ) {
    const command: string = "BITCOUNT";
    return this._commandParser(
      command,
      collection,
      key,
      start,
      end,
      dataFormat
    );
  }

  bittop(
    operation: string,
    deskey: string,
    keys: string[],
    collection: string
  ) {
    const command: string = "BITOP";
    return this._commandParser(command, collection, operation, deskey, ...keys);
  }

  bitpos(
    key: string,
    bit: number,
    collection: string,
    start?: number | undefined,
    end?: number | undefined,
    dataFormat?: string | undefined
  ) {
    const command: string = "BITPOS";
    return this._commandParser(
      command,
      collection,
      key,
      bit,
      start,
      end,
      dataFormat
    );
  }

  getbit(key: string, offset: number, collection: string) {
    const command: string = "GETBIT";
    return this._commandParser(command, collection, key, offset);
  }

  lpush(key: string, elements: string[], collection: string) {
    const command: string = "LPUSH";
    return this._commandParser(command, collection, key, ...elements);
  }

  lindex(key: string, index: number, collection: string) {
    const command: string = "LINDEX";
    return this._commandParser(command, collection, key, index);
  }

  linsert(
    key: string,
    modifier: string,
    pivot: string,
    element: string,
    collection: string
  ) {
    const command: string = "LINSERT";
    return this._commandParser(
      command,
      collection,
      key,
      modifier,
      pivot,
      element
    );
  }

  llen(key: string, collection: string) {
    const command: string = "LLEN";
    return this._commandParser(command, collection, key);
  }

  lrange(key: string, start: number, stop: number, collection: string) {
    const command: string = "LRANGE";
    return this._commandParser(command, collection, key, start, stop);
  }

  lmove(
    source: string,
    destination: string,
    whereFrom: string,
    whereTo: string,
    collection: string
  ) {
    const command: string = "LMOVE";
    return this._commandParser(
      command,
      collection,
      source,
      destination,
      whereFrom,
      whereTo
    );
  }

  lpos(
    key: string,
    element: string,
    collection: string,
    rank?: number | undefined,
    count?: number | undefined,
    maxLen?: number | undefined
  ) {
    const command: string = "LPOS";

    let rankArray: any[] = [];
    if (rank !== undefined) {
      rankArray.push("RANK");
      rankArray.push(rank);
    }

    let countArray: any[] = [];
    if (count !== undefined) {
      countArray.push("COUNT");
      countArray.push(count);
    }

    let maxLenArray: any[] = [];
    if (maxLen !== undefined) {
      maxLenArray.push("MAXLEN");
      maxLenArray.push(maxLen);
    }

    return this._commandParser(
      command,
      collection,
      key,
      element,
      ...rankArray,
      ...countArray,
      ...maxLenArray
    );
  }

  rpush(key: string, elements: string[], collection: string) {
    const command: string = "RPUSH";
    return this._commandParser(command, collection, key, ...elements);
  }

  lpop(key: string, collection: string, count?: number | undefined) {
    const command: string = "LPOP";
    return this._commandParser(command, collection, key, count);
  }

  lpushx(key: string, elements: string[], collection: string) {
    const command: string = "LPUSHX";
    return this._commandParser(command, collection, key, ...elements);
  }

  rpushx(key: string, elements: string[], collection: string) {
    const command: string = "RPUSHX";
    return this._commandParser(command, collection, key, ...elements);
  }

  lrem(key: string, count: number, element: string, collection: string) {
    const command: string = "LREM";
    return this._commandParser(command, collection, key, count, element);
  }

  lset(key: string, index: number, element: string, collection: string) {
    const command: string = "LSET";
    return this._commandParser(command, collection, key, index, element);
  }

  ltrim(key: string, start: number, stop: number, collection: string) {
    const command: string = "LTRIM";
    return this._commandParser(command, collection, key, start, stop);
  }

  rpop(key: string, collection: string, count?: Number | undefined) {
    const command: string = "RPOP";
    return this._commandParser(command, collection, key, count);
  }

  rpoplpush(source: string, destination: string, collection: string) {
    const command: string = "RPOPLPUSH";
    return this._commandParser(command, collection, source, destination);
  }

  hset(key: string, data: object, collection: string) {
    const dataArray: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      dataArray.push(key);
      dataArray.push(value);
    }
    const command: string = "HSET";
    return this._commandParser(command, collection, key, ...dataArray);
  }

  hget(key: string, field: string, collection: string) {
    const command: string = "HGET";
    return this._commandParser(command, collection, key, field);
  }

  hdel(key: string, fields: string[], collection: string) {
    const command: string = "HDEL";
    return this._commandParser(command, collection, key, ...fields);
  }

  hexists(key: string, field: string, collection: string) {
    const command: string = "HEXISTS";
    return this._commandParser(command, collection, key, field);
  }

  hgetall(key: string, collection: string) {
    const command: string = "HGETALL";
    return this._commandParser(command, collection, key);
  }

  hincrby(key: string, field: string, increment: number, collection: string) {
    const command: string = "HINCRBY";
    return this._commandParser(command, collection, key, field, increment);
  }
}
