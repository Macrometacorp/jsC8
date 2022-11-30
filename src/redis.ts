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
    return this._connection.request(
      {
        method: "POST",
        path: `/_api/redis/${collection}`,
        body: filteredData,
      },
      res => res.body
    );
  }

  private _commonScan(
    pattern: string | undefined,
    count: number | undefined,
    command: string,
    collection: string,
    key: string,
    cursor: number
  ) {
    let patternArray: (string | number)[] = [];
    if (pattern !== undefined) {
      patternArray.push("MATCH");
      patternArray.push(pattern);
    }

    let countArray: (string | number)[] = [];
    if (count !== undefined) {
      countArray.push("COUNT");
      countArray.push(count);
    }

    return this._commandParser(
      command,
      collection,
      key,
      cursor,
      ...patternArray,
      ...countArray
    );
  }

  // Start of STRING commands
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
    start?: number,
    end?: number,
    dataFormat?: string
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
    start?: number,
    end?: number,
    dataFormat?: string
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
  // End of STRING commands

  // Start of LIST commands
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
    rank?: number,
    count?: number,
    maxLen?: number
  ) {
    const command: string = "LPOS";

    let rankArray: (string | number)[] = [];
    if (rank !== undefined) {
      rankArray.push("RANK");
      rankArray.push(rank);
    }

    let countArray: (string | number)[] = [];
    if (count !== undefined) {
      countArray.push("COUNT");
      countArray.push(count);
    }

    let maxLenArray: (string | number)[] = [];
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

  lpop(key: string, collection: string, count?: number) {
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

  rpop(key: string, collection: string, count?: Number) {
    const command: string = "RPOP";
    return this._commandParser(command, collection, key, count);
  }

  rpoplpush(source: string, destination: string, collection: string) {
    const command: string = "RPOPLPUSH";
    return this._commandParser(command, collection, source, destination);
  }
  // End of LIST commands

  // Start of HASH commands
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

  hincrbyfloat(
    key: string,
    field: string,
    increment: number,
    collection: string
  ) {
    const command: string = "HINCRBYFLOAT";
    return this._commandParser(command, collection, key, field, increment);
  }

  hkeys(key: string, collection: string) {
    const command: string = "HKEYS";
    return this._commandParser(command, collection, key);
  }

  hlen(key: string, collection: string) {
    const command: string = "HLEN";
    return this._commandParser(command, collection, key);
  }

  hmget(key: string, fields: string[], collection: string) {
    const command: string = "HMGET";
    return this._commandParser(command, collection, key, ...fields);
  }

  hmset(key: string, data: object, collection: string) {
    const dataArray: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      dataArray.push(key);
      dataArray.push(value);
    }
    const command: string = "HMSET";
    return this._commandParser(command, collection, key, ...dataArray);
  }

  hscan(
    key: string,
    cursor: number,
    collection: string,
    pattern?: string,
    count?: number
  ) {
    const command: string = "HSCAN";
    return this._commonScan(pattern, count, command, collection, key, cursor);
  }

  hstrlen(key: string, field: string, collection: string) {
    const command: string = "HSTRLEN";
    return this._commandParser(command, collection, key, field);
  }

  hrandfield(
    key: string,
    collection: string,
    count?: number,
    modifier?: string
  ) {
    const command: string = "HRANDFIELD";

    return this._commandParser(command, collection, key, count, modifier);
  }

  hvals(key: string, collection: string) {
    const command: string = "HVALS";
    return this._commandParser(command, collection, key);
  }
  // End of HASH commands

  // Start of SET commands
  sadd(key: string, members: string[], collection: string) {
    const command: string = "SADD";
    return this._commandParser(command, collection, key, ...members);
  }

  scard(key: string, collection: string) {
    const command: string = "SCARD";
    return this._commandParser(command, collection, key);
  }

  sdiff(keys: string[], collection: string) {
    const command: string = "SDIFF";
    return this._commandParser(command, collection, ...keys);
  }

  sdiffstore(destination: string, keys: string[], collection: string) {
    const command: string = "SDIFFSTORE";
    return this._commandParser(command, collection, destination, ...keys);
  }

  sinter(keys: string[], collection: string) {
    const command: string = "SINTER";
    return this._commandParser(command, collection, ...keys);
  }

  sinterstore(destination: string, keys: string[], collection: string) {
    const command: string = "SINTERSTORE";
    return this._commandParser(command, collection, destination, ...keys);
  }

  sismember(key: string, member: string, collection: string) {
    const command: string = "SISMEMBER";
    return this._commandParser(command, collection, key, member);
  }

  smembers(key: string, collection: string) {
    const command: string = "SMEMBERS";
    return this._commandParser(command, collection, key);
  }

  smismember(key: string, members: string[], collection: string) {
    const command: string = "SMISMEMBER";
    return this._commandParser(command, collection, key, ...members);
  }

  smove(
    source: string,
    destination: string,
    member: string,
    collection: string
  ) {
    const command: string = "SMOVE";
    return this._commandParser(
      command,
      collection,
      source,
      destination,
      member
    );
  }

  spop(key: string, count: number, collection: string) {
    const command: string = "SPOP";
    return this._commandParser(command, collection, key, count);
  }

  srandmember(key: string, collection: string, count?: number) {
    const command: string = "SRANDMEMBER";
    return this._commandParser(command, collection, key, count);
  }

  srem(key: string, members: string[], collection: string) {
    const command: string = "SREM";
    return this._commandParser(command, collection, key, ...members);
  }

  sscan(
    key: string,
    cursor: number,
    collection: string,
    pattern?: string,
    count?: number
  ) {
    const command: string = "SSCAN";
    return this._commonScan(pattern, count, command, collection, key, cursor);
  }

  sunion(keys: string[], collection: string) {
    const command: string = "SUNION";
    return this._commandParser(command, collection, ...keys);
  }

  sunionstore(destination: string, keys: string[], collection: string) {
    const command: string = "SUNIONSTORE";
    return this._commandParser(command, collection, destination, ...keys);
  }
  // End of SET commands

  // Start of SORTED SET commands
  zadd(key: string, data: any[], collection: string, options: any[] = []) {
    const command: string = "ZADD";
    return this._commandParser(command, collection, key, ...options, ...data);
  }

  zcard(key: string, collection: string) {
    const command: string = "ZCARD";
    return this._commandParser(command, collection, key);
  }

  zcount(key: string, minimum: string, maximum: string, collection: string) {
    const command: string = "ZCOUNT";
    return this._commandParser(command, collection, key, minimum, maximum);
  }

  zdiff(
    numKeys: number,
    keys: string[],
    collection: string,
    withScores: boolean = false
  ) {
    const command: string = "ZDIFF";
    let withScoresCommand: string | undefined = undefined;
    if (withScores) {
      withScoresCommand = "WITHSCORES";
    }
    return this._commandParser(
      command,
      collection,
      numKeys,
      ...keys,
      withScoresCommand
    );
  }

  zdiffstore(
    destination: string,
    numkeys: number,
    keys: string[],
    collection: string
  ) {
    const command: string = "ZDIFFSTORE";
    return this._commandParser(
      command,
      collection,
      destination,
      numkeys,
      ...keys
    );
  }

  zincrby(key: string, increment: number, member: string, collection: string) {
    const command: string = "ZINCRBY";
    return this._commandParser(command, collection, key, increment, member);
  }

  zinter(
    numKeys: number,
    keys: string[],
    collection: string,
    options?: any[],
    withScores: boolean = false
  ) {
    const command: string = "ZINTER";

    let optionsArray: (string | number)[] = [];
    if (options !== undefined) {
      optionsArray = [...options];
    }
    if (withScores) {
      optionsArray.push("WITHSCORES");
    }

    return this._commandParser(
      command,
      collection,
      numKeys,
      ...keys,
      ...optionsArray
    );
  }

  zinterstore(
    destination: string,
    numKeys: number,
    keys: string[],
    collection: string,
    options: any[] = []
  ) {
    const command: string = "ZINTERSTORE";
    return this._commandParser(
      command,
      collection,
      destination,
      numKeys,
      ...keys,
      ...options
    );
  }

  zlexcount(key: string, min: string, max: string, collection: string) {
    const command: string = "ZLEXCOUNT";
    return this._commandParser(command, collection, key, min, max);
  }

  zmscore(key: string, members: string[], collection: string) {
    const command: string = "ZMSCORE";
    return this._commandParser(command, collection, key, ...members);
  }

  zpopmax(key: string, collection: string, count?: number) {
    const command: string = "ZPOPMAX";
    return this._commandParser(command, collection, key, count);
  }

  zpopmin(key: string, collection: string, count?: number) {
    const command: string = "ZPOPMIN";
    return this._commandParser(command, collection, key, count);
  }

  zrandmember(
    key: string,
    collection: string,
    count?: number,
    withScores: boolean = false
  ) {
    const command: string = "ZRANDMEMBER";
    let withScoresCommand: string | undefined = undefined;
    if (withScores) {
      withScoresCommand = "WITHSCORES";
    }
    return this._commandParser(
      command,
      collection,
      key,
      count,
      withScoresCommand
    );
  }

  zrange(
    key: string,
    start: string,
    stop: string,
    collection: string,
    options: any[] = []
  ) {
    const command: string = "ZRANGE";
    return this._commandParser(
      command,
      collection,
      key,
      start,
      stop,
      ...options
    );
  }

  zrangebylex(
    key: string,
    min: string,
    max: string,
    collection: string,
    offset?: string,
    count?: number
  ) {
    const command: string = "ZRANGEBYLEX";
    let limitList: (string | number)[] = [];
    if (offset !== undefined && count !== undefined) {
      limitList.push("WITHSCORES");
      limitList.push(offset);
      limitList.push(count);
    }
    return this._commandParser(
      command,
      collection,
      key,
      min,
      max,
      ...limitList
    );
  }

  zrangebyscore(
    key: string,
    min: string,
    max: string,
    collection: string,
    withScores?: boolean,
    offset?: string,
    count?: number
  ) {
    const command: string = "ZRANGEBYSCORE";
    let withScoresCommand: string | undefined = undefined;
    if (withScores) {
      withScoresCommand = "WITHSCORES";
    }
    let limitList: (string | number)[] = [];
    if (offset !== undefined && count !== undefined) {
      limitList.push("WITHSCORES");
      limitList.push(offset);
      limitList.push(count);
    }
    return this._commandParser(
      command,
      collection,
      key,
      min,
      max,
      withScoresCommand,
      ...limitList
    );
  }

  zrangestore(
    dst: string,
    key: string,
    min: string,
    max: string,
    collection: string,
    options: any[] = []
  ) {
    const command: string = "ZRANGESTORE";
    return this._commandParser(
      command,
      collection,
      dst,
      key,
      min,
      max,
      ...options
    );
  }

  zrank(key: string, member: string, collection: string) {
    const command: string = "ZRANK";
    return this._commandParser(command, collection, key, member);
  }

  zrem(key: string, members: string[], collection: string) {
    const command: string = "ZREM";
    return this._commandParser(command, collection, key, ...members);
  }

  zremrangebylex(
    key: string,
    minimum: string,
    maxiumum: string,
    collection: string
  ) {
    const command: string = "ZREMRANGEBYLEX";
    return this._commandParser(command, collection, key, minimum, maxiumum);
  }

  zremrangebyrank(
    key: string,
    start: string,
    stop: string,
    collection: string
  ) {
    const command: string = "ZREMRANGEBYRANK";
    return this._commandParser(command, collection, key, start, stop);
  }

  zremrangebyscore(
    key: string,
    minimum: string,
    maxiumum: string,
    collection: string
  ) {
    const command: string = "ZREMRANGEBYSCORE";
    return this._commandParser(command, collection, key, minimum, maxiumum);
  }

  zrevrange(
    key: string,
    start: string,
    stop: string,
    collection: string,
    withScores: boolean = false
  ) {
    const command: string = "ZREVRANGE";
    let withScoresCommand: string | undefined = undefined;
    if (withScores) {
      withScoresCommand = "WITHSCORES";
    }
    return this._commandParser(
      command,
      collection,
      key,
      start,
      stop,
      withScoresCommand
    );
  }

  zrevrangebylex(
    key: string,
    min: string,
    max: string,
    collection: string,
    offset?: string,
    count?: number
  ) {
    const command: string = "ZREVRANGEBYLEX";

    let limitList: (string | number)[] = [];
    if (offset !== undefined && count !== undefined) {
      limitList.push("LIMIT");
      limitList.push(offset);
      limitList.push(count);
    }
    return this._commandParser(
      command,
      collection,
      key,
      min,
      max,
      ...limitList
    );
  }

  zrevrangebyscore(
    key: string,
    min: string,
    max: string,
    collection: string,
    withScores: boolean = false,
    offset?: string,
    count?: number
  ) {
    const command: string = "ZREVRANGEBYSCORE";
    let withScoresCommand: string | undefined = undefined;
    if (withScores) {
      withScoresCommand = "WITHSCORES";
    }
    let limitList: (string | number)[] = [];
    if (offset !== undefined && count !== undefined) {
      limitList.push("LIMIT");
      limitList.push(offset);
      limitList.push(count);
    }
    return this._commandParser(
      command,
      collection,
      key,
      min,
      max,
      withScoresCommand,
      ...limitList
    );
  }

  zrevrank(key: string, member: string, collection: string) {
    const command: string = "ZREVRANK";
    return this._commandParser(command, collection, key, member);
  }

  zscan(
    key: string,
    cursor: number,
    collection: string,
    pattern?: string,
    count?: number
  ) {
    const command: string = "ZSCAN";
    return this._commonScan(pattern, count, command, collection, key, cursor);
  }

  zscore(key: string, member: string, collection: string) {
    const command: string = "ZSCORE";
    return this._commandParser(command, collection, key, member);
  }

  zunion(
    numKeys: number,
    keys: string[],
    collection: string,
    options?: any[],
    withScores?: boolean
  ) {
    const command: string = "ZUNION";

    let optionsArray: (string | number)[] = [];
    if (options !== undefined) {
      optionsArray = [...options];
    }
    if (withScores) {
      optionsArray.push("WITHSCORES");
    }

    return this._commandParser(
      command,
      collection,
      numKeys,
      ...keys,
      ...optionsArray
    );
  }

  zunionstore(
    destination: string,
    numKeys: number,
    keys: string[],
    collection: string,
    options?: any[],
    withScores?: boolean
  ) {
    const command: string = "ZUNIONSTORE";

    let optionsArray: (string | number)[] = [];
    if (options !== undefined) {
      optionsArray = [...options];
    }
    if (withScores) {
      optionsArray.push("WITHSCORES");
    }

    return this._commandParser(
      command,
      collection,
      destination,
      numKeys,
      ...keys,
      ...optionsArray
    );
  }
  // End of SORTED SET commands

  // Start of GENERIC commands
  copy(
    source: string,
    destination: string,
    collection: string,
    destinationDatabase?: string,
    replace?: false
  ) {
    const command: string = "COPY";
    let optionsCommand: string[] = [];
    if (destinationDatabase !== undefined) {
      optionsCommand.push("DB");
      optionsCommand.push(destinationDatabase);
    }
    if (replace) {
      optionsCommand.push("WITHSCORES");
    }
    return this._commandParser(
      command,
      collection,
      source,
      destination,
      ...optionsCommand
    );
  }

  delete(keys: string[], collection: string) {
    const command: string = "DEL";
    return this._commandParser(command, collection, ...keys);
  }

  exists(keys: string[], collection: string) {
    const command: string = "EXISTS";
    return this._commandParser(command, collection, ...keys);
  }

  expire(key: string, seconds: number, collection: string, options?: string) {
    const command: string = "EXPIRE";
    return this._commandParser(command, collection, key, seconds, options);
  }

  expireat(
    key: string,
    unixTimeSeconds: number,
    collection: string,
    options?: string
  ) {
    const command: string = "EXPIREAT";
    return this._commandParser(
      command,
      collection,
      key,
      unixTimeSeconds,
      options
    );
  }

  persist(key: string, collection: string) {
    const command: string = "PERSIST";
    return this._commandParser(command, collection, key);
  }

  pexpire(
    key: string,
    milliseconds: number,
    collection: string,
    options?: string
  ) {
    const command: string = "PEXPIRE";
    return this._commandParser(command, collection, key, milliseconds, options);
  }

  pexpireat(
    key: string,
    unixTimeMilliseconds: number,
    collection: string,
    options?: string
  ) {
    const command: string = "PEXPIREAT";
    return this._commandParser(
      command,
      collection,
      key,
      unixTimeMilliseconds,
      options
    );
  }

  pttl(key: string, collection: string) {
    const command: string = "PTTL";
    return this._commandParser(command, collection, key);
  }

  randomkey(collection: string) {
    const command: string = "RANDOMKEY";
    return this._commandParser(command, collection);
  }

  rename(key: string, newKey: string, collection: string) {
    const command: string = "RENAME";
    return this._commandParser(command, collection, key, newKey);
  }

  renamenx(key: string, newKey: string, collection: string) {
    const command: string = "RENAMENX";
    return this._commandParser(command, collection, key, newKey);
  }

  scan(
    cursor: number,
    collection: string,
    pattern?: string,
    count?: number,
    dataType?: number
  ) {
    const command: string = "SCAN";

    let patternArray: (string | number)[] = [];
    if (pattern !== undefined) {
      patternArray.push("MATCH");
      patternArray.push(pattern);
    }

    let countArray: (string | number)[] = [];
    if (count !== undefined) {
      countArray.push("COUNT");
      countArray.push(count);
    }

    let typeArray: (string | number)[] = [];
    if (dataType !== undefined) {
      typeArray.push("TYPE");
      typeArray.push(dataType);
    }

    return this._commandParser(
      command,
      collection,
      cursor,
      ...patternArray,
      ...countArray,
      ...typeArray
    );
  }

  ttl(key: string, collection: string) {
    const command: string = "TTL";
    return this._commandParser(command, collection, key);
  }

  type(key: string, collection: string) {
    const command: string = "TYPE";
    return this._commandParser(command, collection, key);
  }

  unlink(keys: string[], collection: string) {
    const command: string = "UNLINK";
    return this._commandParser(command, collection, ...keys);
  }
  // End of GENERIC commands

  // Start of SERVER commands
  echo(message: string, collection: string) {
    const command: string = "ECHO";
    return this._commandParser(command, collection, message);
  }

  ping(collection: string, message?: string) {
    const command: string = "PING";
    return this._commandParser(command, collection, message);
  }

  dbsize(collection: string) {
    const command: string = "DBSIZE";
    return this._commandParser(command, collection);
  }

  flushdb(collection: string, asyncFlush?: boolean) {
    const command: string = "FLUSHDB";
    let asyncFlushCommand: string | undefined = undefined;
    if (asyncFlush === true) {
      asyncFlushCommand = "ASYNC";
    }
    return this._commandParser(command, collection, asyncFlushCommand);
  }

  time(collection: string) {
    const command: string = "TIME";
    return this._commandParser(command, collection);
  }
  // End of SERVER commands
}
