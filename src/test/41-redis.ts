import { expect } from "chai";
import { C8Client } from "../jsC8";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating redis apis", function() {
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;

  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
  });

  describe("Redis", () => {
    const collectionName = "testRedisCollection";
    before(async () => {
      await c8Client.createCollection(collectionName);
    });

    after(async () => {
      await c8Client.deleteCollection(collectionName);
    });

    describe("test redis string commands", () => {
      it("redis.set", async () => {
        const response = await c8Client.redis.set(
          "testKey",
          "1",
          collectionName
        );
        expect(response.result).to.equal("OK");
        expect(response.code).to.equal(200);
      });
      it("redis.append", async () => {
        const response = await c8Client.redis.append(
          "testKey",
          "2",
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });
      it("redis.dec", async () => {
        const response = await c8Client.redis.decr("testKey", collectionName);
        expect(response.result).to.equal(11);
        expect(response.code).to.equal(200);
      });
      it("redis.decby", async () => {
        const response = await c8Client.redis.decrby(
          "testKey",
          10,
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.get", async () => {
        const response = await c8Client.redis.get("testKey", collectionName);
        expect(response.result).to.equal("1");
        expect(response.code).to.equal(200);
      });
      it("redis.getdel", async () => {
        const response = await c8Client.redis.getdel("testKey", collectionName);
        expect(response.result).to.equal("1");
        expect(response.code).to.equal(200);
      });
      it("redis.getex", async () => {
        await c8Client.redis.set("testKeyEx", "EX", collectionName);
        const response = await c8Client.redis.getex(
          "testKeyEx",
          collectionName,
          "EX",
          200
        );
        expect(response.result).to.equal("EX");
        expect(response.code).to.equal(200);
      });
      it("redis.getrange", async () => {
        const response = await c8Client.redis.getrange(
          "testKeyEx",
          0,
          0,
          collectionName
        );
        expect(response.result).to.equal("E");
        expect(response.code).to.equal(200);
      });
      it("redis.getset", async () => {
        const response = await c8Client.redis.getset(
          "testKeyEx",
          "testValue",
          collectionName
        );
        expect(response.result).to.equal("EX");
        expect(response.code).to.equal(200);
      });
      it("redis.incr", async () => {
        const response = await c8Client.redis.incr("testKeyEx", collectionName);
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.incrby", async () => {
        const response = await c8Client.redis.incrby(
          "testKeyEx",
          10,
          collectionName
        );
        expect(response.result).to.equal(11);
        expect(response.code).to.equal(200);
      });
      it("redis.incrbyfloat", async () => {
        const response = await c8Client.redis.incrbyfloat(
          "testKeyEx",
          0.5,
          collectionName
        );
        expect(response.result).to.equal("11.5");
        expect(response.code).to.equal(200);
      });
      it("redis.mget", async () => {
        await c8Client.redis.set("anotherTest", "22", collectionName);
        const response = await c8Client.redis.mget(
          ["testKeyEx", "anotherTest"],
          collectionName
        );
        expect(response.result).to.eql(["11.5", "22"]);
        expect(response.code).to.equal(200);
      });
      it("redis.mset", async () => {
        const response = await c8Client.redis.mset(
          { testKey3: "testValue3", testKey4: "testValue4" },
          collectionName
        );
        expect(response.result).to.equal("OK");
        expect(response.code).to.equal(200);
      });
      it("redis.msetnx", async () => {
        const response = await c8Client.redis.msetnx(
          { testKey5: "testValue5", testKey6: "testValue6" },
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.setex", async () => {
        const response = await c8Client.redis.setex(
          "ttlKeySec",
          30,
          "value",
          collectionName
        );
        expect(response.result).to.equal("OK");
        expect(response.code).to.equal(200);
      });
      it("redis.psetex", async () => {
        const response = await c8Client.redis.setex(
          "ttlKeyMs",
          30000,
          "value",
          collectionName
        );
        expect(response.result).to.equal("OK");
        expect(response.code).to.equal(200);
      });
      it("redis.setbit", async () => {
        const response = await c8Client.redis.setbit(
          "bitKey",
          7,
          0,
          collectionName
        );
        expect(response.result).to.equal(0);
        expect(response.code).to.equal(200);
      });
      it("redis.setnx", async () => {
        const response = await c8Client.redis.setnx(
          "testSetNx",
          "1",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.setrange", async () => {
        const response = await c8Client.redis.setrange(
          "testSetNx",
          0,
          "2",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.strlen", async () => {
        await c8Client.redis.setnx("testString", "string", collectionName);
        const response = await c8Client.redis.strlen(
          "testString",
          collectionName
        );
        expect(response.result).to.equal(6);
        expect(response.code).to.equal(200);
      });
      it("redis.bitcount", async () => {
        await c8Client.redis.setnx("myKeyString", "foobar", collectionName);
        const response = await c8Client.redis.bitcount(
          "myKeyString",
          collectionName
        );
        expect(response.result).to.equal(26);
        expect(response.code).to.equal(200);
      });
      it("redis.bitcount2", async () => {
        const response = await c8Client.redis.bitcount(
          "myKeyString",
          collectionName,
          0,
          0
        );
        expect(response.result).to.equal(4);
        expect(response.code).to.equal(200);
      });
      it("redis.bittop", async () => {
        await c8Client.redis.set("key1", "foobar", collectionName);
        await c8Client.redis.set("key2", "abcdef", collectionName);
        const response = await c8Client.redis.bittop(
          "AND",
          "dest",
          ["key1", "key2"],
          collectionName
        );
        expect(response.result).to.equal(6);
        expect(response.code).to.equal(200);
      });
      it("redis.getbit", async () => {
        await c8Client.redis.setbit("mykey", 7, 1, collectionName);
        const response = await c8Client.redis.getbit(
          "mykey",
          7,
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.bitpos", async () => {
        await c8Client.redis.set("mykey2", "\x00\x00\x00", collectionName);
        const response = await c8Client.redis.bitpos(
          "mykey2",
          0,
          collectionName
        );
        expect(response.result).to.equal(0);
        expect(response.code).to.equal(200);
      });
      it("redis.bitpos2", async () => {
        const response = await c8Client.redis.bitpos(
          "mykey2",
          1,
          collectionName
        );
        expect(response.result).to.equal(-1);
        expect(response.code).to.equal(200);
      });
    });
    describe("test redis list commands", () => {
      it("redis.lpush", async () => {
        const arrayData = ["iron", "gold", "copper"];
        const response = await c8Client.redis.lpush(
          "list",
          arrayData,
          collectionName
        );
        expect(response.result).to.equal(3);
        expect(response.code).to.equal(200);
      });

      it("redis.lindex", async () => {
        const response = await c8Client.redis.lindex("list", 0, collectionName);
        expect(response.result).to.equal("copper");
        expect(response.code).to.equal(200);
      });

      it("redis.linsert", async () => {
        const response = await c8Client.redis.linsert(
          "list",
          "AFTER",
          "copper",
          "silver",
          collectionName
        );
        expect(response.result).to.equal(4);
        expect(response.code).to.equal(200);
      });

      it("redis.llen", async () => {
        const response = await c8Client.redis.llen("list", collectionName);
        expect(response.result).to.equal(4);
        expect(response.code).to.equal(200);
      });

      it("redis.lrange", async () => {
        const response = await c8Client.redis.lrange(
          "list",
          0,
          1,
          collectionName
        );
        expect(response.result).to.eql(["copper", "silver"]);
        expect(response.code).to.equal(200);
      });

      it("redis.lmove", async () => {
        const arrayData1 = ["a", "b", "c"];
        await c8Client.redis.lpush("testList1", arrayData1, collectionName);

        const arrayData2 = ["x", "y", "z"];
        await c8Client.redis.lpush("testList2", arrayData2, collectionName);

        const response = await c8Client.redis.lmove(
          "testList1",
          "testList2",
          "RIGHT",
          "LEFT",
          collectionName
        );
        expect(response.result).to.equal("a");
        expect(response.code).to.equal(200);
      });

      it("redis.rpush", async () => {
        const arrayData = ["a", "b", "c", "d", "a", "a"];
        const response = await c8Client.redis.rpush(
          "testListPos",
          arrayData,
          collectionName
        );
        expect(response.result).to.equal(6);
        expect(response.code).to.equal(200);
      });

      it("redis.lpos", async () => {
        const response = await c8Client.redis.lpos(
          "testListPos",
          "a",
          collectionName
        );
        expect(response.result).to.equal(0);
        expect(response.code).to.equal(200);
      });

      it("redis.lpos2", async () => {
        const response = await c8Client.redis.lpos(
          "testListPos",
          "a",
          collectionName,
          0,
          3
        );
        expect(response.result).to.eql([0, 4, 5]);
        expect(response.code).to.equal(200);
      });

      it("redis.lpop", async () => {
        const response = await c8Client.redis.lpop(
          "testList2",
          collectionName,
          1
        );
        expect(response.result).to.eql(["a"]);
        expect(response.code).to.equal(200);
      });

      it("redis.lpushx", async () => {
        const arrayData = ["a", "b", "c", "d", "a", "a"];
        const response = await c8Client.redis.lpushx(
          "testListPos",
          arrayData,
          collectionName
        );
        expect(response.result).to.equal(12);
        expect(response.code).to.equal(200);
      });

      it("redis.lrem", async () => {
        const arrayData = ["hello", "hello", "foo", "hello"];
        await c8Client.redis.rpush("testListLrem", arrayData, collectionName);
        const response = await c8Client.redis.lrem(
          "testListLrem",
          -2,
          "hello",
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });

      it("redis.lset", async () => {
        const response = await c8Client.redis.lset(
          "testListLrem",
          0,
          "test",
          collectionName
        );
        expect(response.result).to.equal("OK");
        expect(response.code).to.equal(200);
      });

      it("redis.trim", async () => {
        const response = await c8Client.redis.ltrim(
          "testListLrem",
          0,
          0,
          collectionName
        );
        expect(response.result).to.equal("OK");
        expect(response.code).to.equal(200);
      });

      it("redis.rpop", async () => {
        const response = await c8Client.redis.rpop(
          "testListLrem",
          collectionName
        );
        expect(response.result).to.equal("test");
        expect(response.code).to.equal(200);
      });

      it("redis.rpoplpush", async () => {
        const arrayData = ["one", "two", "three"];
        await c8Client.redis.rpush("myPushList", arrayData, collectionName);
        const response = await c8Client.redis.rpoplpush(
          "myPushList",
          "myOtherPushList",
          collectionName
        );
        expect(response.result).to.equal("three");
        expect(response.code).to.equal(200);
      });
    });
    describe("test redis hash commands", () => {
      it("redis.hset", async () => {
        const response = await c8Client.redis.hset(
          "games",
          { action: "elden", driving: "GT7" },
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });
      it("redis.hget", async () => {
        const response = await c8Client.redis.hget(
          "games",
          "action",
          collectionName
        );
        expect(response.result).to.equal("elden");
        expect(response.code).to.equal(200);
      });

      it("redis.hdel", async () => {
        const response = await c8Client.redis.hdel(
          "games",
          ["action"],
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.hexists", async () => {
        const response = await c8Client.redis.hexists(
          "games",
          "driving",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.hgetall", async () => {
        const response = await c8Client.redis.hgetall("games", collectionName);
        expect(response.result).to.eql(["driving", "GT7"]);
        expect(response.code).to.equal(200);
      });

      it("redis.hincrby", async () => {
        const response = await c8Client.redis.hincrby(
          "myhash",
          "field",
          5,
          collectionName
        );
        expect(response.result).to.equal("5");
        expect(response.code).to.equal(200);
      });

      it("redis.hincrbyfloat", async () => {
        const response = await c8Client.redis.hincrbyfloat(
          "myhashfloat",
          "field",
          10.5,
          collectionName
        );
        expect(response.result).to.equal("10.500000");
        expect(response.code).to.equal(200);
      });

      it("redis.hkeys", async () => {
        const response = await c8Client.redis.hkeys("games", collectionName);
        expect(response.result).to.eql(["driving"]);
        expect(response.code).to.equal(200);
      });

      it("redis.hlen", async () => {
        const response = await c8Client.redis.hlen("games", collectionName);
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.hmget", async () => {
        await c8Client.redis.hset(
          "newgames",
          { action: "elden", driving: "GT7" },
          collectionName
        );
        const response = await c8Client.redis.hmget(
          "newgames",
          ["action", "driving"],
          collectionName
        );
        expect(response.result).to.eql(["elden", "GT7"]);
        expect(response.code).to.equal(200);
      });

      it("redis.hmset", async () => {
        const response = await c8Client.redis.hmset(
          "world",
          { land: "dog", sea: "octopus" },
          collectionName
        );
        expect(response.result).to.equal("OK");
        expect(response.code).to.equal(200);
      });

      it("redis.hscan1", async () => {
        const response = await c8Client.redis.hscan("games", 0, collectionName);
        expect(response.result).to.eql(["cursor:driving", ["driving", "GT7"]]);
        expect(response.code).to.equal(200);
      });

      it("redis.hscan2", async () => {
        const response = await c8Client.redis.hscan(
          "games",
          0,
          collectionName,
          "*",
          100
        );
        expect(response.result).to.eql(["cursor:driving", ["driving", "GT7"]]);
        expect(response.code).to.equal(200);
      });

      it("redis.hstrlen", async () => {
        const response = await c8Client.redis.hstrlen(
          "games",
          "driving",
          collectionName
        );
        expect(response.result).to.equal(3);
        expect(response.code).to.equal(200);
      });

      it("redis.hrandfield1", async () => {
        await c8Client.redis.hmset(
          "coin",
          { heads: "obverse", tails: "reverse", edge: "null" },
          collectionName
        );
        const response = await c8Client.redis.hrandfield(
          "coin",
          collectionName
        );
        expect(response.code).to.equal(200);
      });

      it("redis.hrandfield2", async () => {
        const response = await c8Client.redis.hrandfield(
          "coin",
          collectionName,
          -5,
          "WITHVALUES"
        );
        expect(response.code).to.equal(200);
      });

      it("redis.hvals", async () => {
        const response = await c8Client.redis.hvals("coin", collectionName);
        expect(response.result).to.eql(["obverse", "reverse", "null"]);
        expect(response.code).to.equal(200);
      });
    });
    describe("test redis set commands", () => {
      it("redis.sadd", async () => {
        const response = await c8Client.redis.sadd(
          "animals",
          ["dog"],
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.scard", async () => {
        const response = await c8Client.redis.scard("animals", collectionName);
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.sdiff", async () => {
        await c8Client.redis.sadd("key1sdiff", ["a", "b", "c"], collectionName);
        await c8Client.redis.sadd("key2sdiff", ["c"], collectionName);
        await c8Client.redis.sadd("key3sdiff", ["d", "e"], collectionName);
        const response = await c8Client.redis.sdiff(
          ["key1sdiff", "key2sdiff", "key3sdiff"],
          collectionName
        );
        expect(response.result).to.eql(["b", "a"]);
        expect(response.code).to.equal(200);
      });
      it("redis.sdiffstore", async () => {
        const response = await c8Client.redis.sdiffstore(
          "destinationKeysdiffstore",
          ["key1sdiff", "key2sdiff", "key3sdiff"],
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });
      it("redis.sinter", async () => {
        await c8Client.redis.sadd("key11", ["a", "b", "c"], collectionName);
        await c8Client.redis.sadd("key22", ["c", "d", "e"], collectionName);
        const response = await c8Client.redis.sinter(
          ["key11", "key22"],
          collectionName
        );
        expect(response.result).to.eql(["c"]);
        expect(response.code).to.equal(200);
      });
      it("redis.sinterstore", async () => {
        const response = await c8Client.redis.sinterstore(
          "destinationInter",
          ["key11", "key22"],
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.sismember", async () => {
        const response = await c8Client.redis.sismember(
          "key11",
          "a",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.smembers", async () => {
        const response = await c8Client.redis.smembers("key11", collectionName);
        expect(response.result).to.eql(["a", "b", "c"]);
        expect(response.code).to.equal(200);
      });
      it("redis.smismember", async () => {
        const response = await c8Client.redis.smismember(
          "key11",
          ["a", "b", "z"],
          collectionName
        );
        expect(response.result).to.eql([1, 1, 0]);
        expect(response.code).to.equal(200);
      });
      it("redis.smove", async () => {
        const response = await c8Client.redis.smove(
          "key11",
          "key22",
          "b",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.spop", async () => {
        const response = await c8Client.redis.spop(
          "animals",
          1,
          collectionName
        );
        expect(response.result).to.eql(["dog"]);
        expect(response.code).to.equal(200);
      });
      it("redis.srandmember1", async () => {
        const response = await c8Client.redis.srandmember(
          "key22",
          collectionName
        );
        expect(response.code).to.equal(200);
      });
      it("redis.srandmember2", async () => {
        const response = await c8Client.redis.srandmember(
          "key22",
          collectionName,
          -5
        );
        expect(response.code).to.equal(200);
      });
      it("redis.srem", async () => {
        const response = await c8Client.redis.srem(
          "key22",
          ["e", "b"],
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });
      it("redis.sscan1", async () => {
        await c8Client.redis.sadd("keyScan", ["a", "b", "c"], collectionName);
        const response = await c8Client.redis.sscan(
          "keyScan",
          0,
          collectionName
        );
        expect(response.result).to.eql(["cursor:c", ["a", "b", "c"]]);
        expect(response.code).to.equal(200);
      });
      it("redis.sscan2", async () => {
        const response = await c8Client.redis.sscan(
          "keyScan",
          0,
          collectionName,
          "*",
          100
        );
        expect(response.result).to.eql(["cursor:c", ["a", "b", "c"]]);
        expect(response.code).to.equal(200);
      });
      it("redis.sunion", async () => {
        await c8Client.redis.sadd("key111", ["a", "b", "c"], collectionName);
        await c8Client.redis.sadd("key222", ["c", "d", "e"], collectionName);
        const response = await c8Client.redis.sunion(
          ["key111", "key222"],
          collectionName
        );
        expect(response.result).to.eql(["a", "b", "c", "d", "e"]);
        expect(response.code).to.equal(200);
      });
      it("redis.sunionstore", async () => {
        const response = await c8Client.redis.sunionstore(
          "destinationUnionStore",
          ["key111", "key222"],
          collectionName
        );
        expect(response.result).to.equal(5);
        expect(response.code).to.equal(200);
      });
    });
    describe("test redis sorted set commands", () => {
      it("redis.zadd", async () => {
        const response = await c8Client.redis.zadd(
          "testZadd",
          [1, "test"],
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.zadd2", async () => {
        const response = await c8Client.redis.zadd(
          "testZadd2",
          [1, "test2"],
          collectionName,
          ["NX", "INCR"]
        );
        expect(response.result).to.equal("1");
        expect(response.code).to.equal(200);
      });
      it("redis.zrange", async () => {
        const response = await c8Client.redis.zrange(
          "testZadd",
          "0",
          "1",
          collectionName
        );
        expect(response.result).to.eql(["test"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zrange2", async () => {
        const response = await c8Client.redis.zrange(
          "testZadd",
          "0",
          "1",
          collectionName,
          ["WITHSCORES"]
        );
        expect(response.result).to.eql(["test", 1]);
        expect(response.code).to.equal(200);
      });
      it("redis.zcard", async () => {
        const response = await c8Client.redis.zcard("testZadd", collectionName);
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.zcount", async () => {
        const response = await c8Client.redis.zcount(
          "testZadd",
          "0",
          "2",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.zdiff", async () => {
        await c8Client.redis.zadd("testDiff1", [1, "one"], collectionName);
        await c8Client.redis.zadd("testDiff1", [2, "two"], collectionName);
        await c8Client.redis.zadd("testDiff1", [3, "three"], collectionName);
        await c8Client.redis.zadd("testDiff2", [1, "one"], collectionName);
        await c8Client.redis.zadd("testDiff2", [1, "two"], collectionName);
        const response = await c8Client.redis.zdiff(
          2,
          ["testDiff1", "testDiff2"],
          collectionName
        );
        expect(response.result).to.eql(["three"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zdiff2", async () => {
        const response = await c8Client.redis.zdiff(
          2,
          ["testDiff1", "testDiff2"],
          collectionName,
          true
        );
        expect(response.result).to.eql(["three", 3]);
        expect(response.code).to.equal(200);
      });
      it("redis.zdiffstore", async () => {
        const response = await c8Client.redis.zdiffstore(
          "destinationZdiff",
          2,
          ["testDiff1", "testDiff2"],
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.zincrby", async () => {
        const response = await c8Client.redis.zincrby(
          "testZadd",
          1.5,
          "test",
          collectionName
        );
        expect(response.result).to.equal(2.5);
        expect(response.code).to.equal(200);
      });
      it("redis.zinter", async () => {
        await c8Client.redis.zadd(
          "zset1",
          [1, "one", 2, "two"],
          collectionName
        );
        await c8Client.redis.zadd(
          "zset2",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zinter(
          2,
          ["zset1", "zset2"],
          collectionName
        );
        expect(response.result).to.eql(["one", "two"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zinter2", async () => {
        const response = await c8Client.redis.zinter(
          2,
          ["zset1", "zset2"],
          collectionName,
          [],
          true
        );
        expect(response.result).to.eql(["one", 2, "two", 4]);
        expect(response.code).to.equal(200);
      });
      it("redis.zinterstore", async () => {
        const response = await c8Client.redis.zinterstore(
          "zinterStore",
          2,
          ["zset1", "zset2"],
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });
      it("redis.zlexcount", async () => {
        await c8Client.redis.zadd(
          "zlexSet1",
          [0, "a", 0, "b", 0, "c", 0, "d", 0, "e"],
          collectionName
        );
        await c8Client.redis.zadd("zlexSet1", [0, "f", 0, "g"], collectionName);
        const response = await c8Client.redis.zlexcount(
          "zlexSet1",
          "-",
          "+",
          collectionName
        );
        expect(response.result).to.equal(7);
        expect(response.code).to.equal(200);
      });
      it("redis.zmscore", async () => {
        const response = await c8Client.redis.zmscore(
          "zlexSet1",
          ["a", "b"],
          collectionName
        );
        expect(response.result).to.eql([0, 0]);
        expect(response.code).to.equal(200);
      });
      it("redis.zpopmax", async () => {
        await c8Client.redis.zadd(
          "zpop",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zpopmax("zpop", collectionName);
        expect(response.result).to.eql(["three", "3"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zpopmin", async () => {
        await c8Client.redis.zadd(
          "zpop",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zpopmin("zpop", collectionName);
        expect(response.result).to.eql(["one", "1"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zrandmember", async () => {
        const response = await c8Client.redis.zrandmember(
          "zpop",
          collectionName
        );
        expect(response.code).to.equal(200);
      });
      it("redis.zrangebylex", async () => {
        await c8Client.redis.zadd(
          "zrangeByLexSet1",
          [0, "a", 0, "b", 0, "c", 0, "d", 0, "e", 0, "f", 0, "g"],
          collectionName
        );
        const response = await c8Client.redis.zrangebylex(
          "zrangeByLexSet1",
          "-",
          "[c",
          collectionName
        );
        expect(response.result).to.eql(["a", "b", "c"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zrangebyscore", async () => {
        await c8Client.redis.zadd(
          "zrangeByScoreSet1",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zrangebyscore(
          "zrangeByScoreSet1",
          "-inf",
          "+inf",
          collectionName
        );
        expect(response.result).to.eql(["one", "two", "three"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zrank", async () => {
        const response = await c8Client.redis.zrank(
          "zrangeByScoreSet1",
          "three",
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });
      it("redis.zrem", async () => {
        const response = await c8Client.redis.zrem(
          "zrangeByScoreSet1",
          ["two", "three"],
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });
      it("redis.zremrangebylex", async () => {
        await c8Client.redis.zadd(
          "zremrangebylex",
          [0, "aaaaa", 0, "b", 0, "c", 0, "d", 0, "e"],
          collectionName
        );
        await c8Client.redis.zadd(
          "zremrangebylex",
          [0, "foo", 0, "zap", 0, "zip", 0, "ALPHA", 0, "alpha"],
          collectionName
        );
        const response = await c8Client.redis.zremrangebylex(
          "zremrangebylex",
          "[alpha",
          "[omega",
          collectionName
        );
        expect(response.result).to.equal(6);
        expect(response.code).to.equal(200);
      });
      it("redis.zremrangebyrank", async () => {
        await c8Client.redis.zadd(
          "zremrangebyrank",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zremrangebyrank(
          "zremrangebyrank",
          "0",
          "1",
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });
      it("redis.zremrangebyscore", async () => {
        await c8Client.redis.zadd(
          "zremrangebyscore2",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zremrangebyscore(
          "zremrangebyscore2",
          "-inf",
          "(2",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.zrevrange", async () => {
        await c8Client.redis.zadd(
          "zrevrange",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zrevrange(
          "zrevrange",
          "0",
          "-1",
          collectionName
        );
        expect(response.result).to.eql(["three", "two", "one"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zrevrangebylex", async () => {
        await c8Client.redis.zadd(
          "zrevrangebylex",
          [0, "a", 0, "b", 0, "c", 0, "d", 0, "e", 0, "f", 0, "g"],
          collectionName
        );
        const response = await c8Client.redis.zrevrangebylex(
          "zrevrangebylex",
          "[c",
          "-",
          collectionName
        );
        expect(response.result).to.eql(["c", "b", "a"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zrevrangebyscore", async () => {
        await c8Client.redis.zadd(
          "zrevrangebyscore",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zrevrangebyscore(
          "zrevrangebyscore",
          "+inf",
          "-inf",
          collectionName
        );
        expect(response.result).to.eql(["three", "two", "one"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zrevrank", async () => {
        const response = await c8Client.redis.zrevrank(
          "zrevrangebyscore",
          "one",
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });
      it("redis.zscan", async () => {
        const response = await c8Client.redis.zscan(
          "zrevrangebyscore",
          0,
          collectionName
        );
        expect(response.result).to.eql([
          "cursor:3-three",
          [1, "one", 2, "two", 3, "three"],
        ]);
        expect(response.code).to.equal(200);
      });
      it("redis.zscore", async () => {
        const response = await c8Client.redis.zscore(
          "zrevrangebyscore",
          "one",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });
      it("redis.zunion", async () => {
        await c8Client.redis.zadd(
          "zunionSet1",
          [1, "one", 2, "two"],
          collectionName
        );
        await c8Client.redis.zadd(
          "zunionSet2",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zunion(
          2,
          ["zunionSet1", "zunionSet2"],
          collectionName
        );
        expect(response.result).to.eql(["one", "three", "two"]);
        expect(response.code).to.equal(200);
      });
      it("redis.zunion2", async () => {
        const response = await c8Client.redis.zunion(
          2,
          ["zunionSet1", "zunionSet2"],
          collectionName,
          [],
          true
        );
        expect(response.result).to.eql(["one", 2, "three", 3, "two", 4]);
        expect(response.code).to.equal(200);
      });
      it("redis.zunionstore", async () => {
        await c8Client.redis.zadd(
          "zunionStoreSet1",
          [1, "one", 2, "two"],
          collectionName
        );
        await c8Client.redis.zadd(
          "zunionStoreSet2",
          [1, "one", 2, "two", 3, "three"],
          collectionName
        );
        const response = await c8Client.redis.zunionstore(
          "zunionDestination",
          2,
          ["zunionStoreSet1", "zunionStoreSet2"],
          collectionName
        );
        expect(response.result).to.equal(3);
        expect(response.code).to.equal(200);
      });
    });
    describe("test redis generic commands", () => {
      it("redis.copy", async () => {
        await c8Client.redis.set("dolly", "sheep", collectionName);
        const response = await c8Client.redis.copy(
          "dolly",
          "clone",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.exists", async () => {
        const response = await c8Client.redis.exists(
          ["dolly", "clone"],
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });

      it("redis.delete", async () => {
        const response = await c8Client.redis.delete(
          ["dolly", "clone"],
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });

      it("redis.expire", async () => {
        await c8Client.redis.set("expire", "test", collectionName);
        const response = await c8Client.redis.expire(
          "expire",
          30,
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.expire2", async () => {
        await c8Client.redis.set("expire2", "test", collectionName);
        const response = await c8Client.redis.expire(
          "expire2",
          30,
          collectionName,
          "NX"
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.expireat", async () => {
        await c8Client.redis.set("expireat", "test", collectionName);
        const response = await c8Client.redis.expireat(
          "expireat",
          30,
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.expireat2", async () => {
        await c8Client.redis.set("expireat2", "test", collectionName);
        const response = await c8Client.redis.expireat(
          "expireat2",
          30,
          collectionName,
          "NX"
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.persist", async () => {
        const response = await c8Client.redis.persist(
          "expireat2",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.pexpire", async () => {
        await c8Client.redis.set("pexpire", "test", collectionName);
        const response = await c8Client.redis.pexpire(
          "pexpire",
          8000,
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.pexpire2", async () => {
        await c8Client.redis.set("pexpire2", "test", collectionName);
        const response = await c8Client.redis.pexpire(
          "pexpire2",
          8000,
          collectionName,
          "NX"
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.pexpireat", async () => {
        await c8Client.redis.set("pexpireat", "test", collectionName);
        const response = await c8Client.redis.pexpireat(
          "pexpireat",
          8000,
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.pexpireat2", async () => {
        await c8Client.redis.set("pexpireat2", "test", collectionName);
        const response = await c8Client.redis.pexpireat(
          "pexpireat2",
          8000,
          collectionName,
          "NX"
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.pttl", async () => {
        await c8Client.redis.set("pttl", "test", collectionName);
        const response = await c8Client.redis.pttl("pttl", collectionName);
        expect(response.result).to.equal(-1);
        expect(response.code).to.equal(200);
      });

      it("redis.randomkey", async () => {
        const response = await c8Client.redis.randomkey(collectionName);
        expect(response.code).to.equal(200);
      });

      it("redis.rename", async () => {
        await c8Client.redis.set("rename", "test", collectionName);
        const response = await c8Client.redis.rename(
          "rename",
          "newName",
          collectionName
        );
        expect(response.result).to.equal("OK");
        expect(response.code).to.equal(200);
      });

      it("redis.renamenx", async () => {
        await c8Client.redis.set("renamenx", "test", collectionName);
        const response = await c8Client.redis.renamenx(
          "renamenx",
          "newNamenx",
          collectionName
        );
        expect(response.result).to.equal(1);
        expect(response.code).to.equal(200);
      });

      it("redis.scan", async () => {
        const response = await c8Client.redis.scan(0, collectionName);
        expect(response.code).to.equal(200);
      });

      it("redis.scan2", async () => {
        const response = await c8Client.redis.scan(0, collectionName, "*", 100);
        expect(response.code).to.equal(200);
      });

      it("redis.ttl", async () => {
        await c8Client.redis.set("ttl", "test", collectionName);
        const response = await c8Client.redis.ttl("ttl", collectionName);
        expect(response.result).to.equal(-1);
        expect(response.code).to.equal(200);
      });

      it("redis.type", async () => {
        await c8Client.redis.set("type", "test", collectionName);
        const response = await c8Client.redis.type("type", collectionName);
        expect(response.result).to.equal("string");
        expect(response.code).to.equal(200);
      });

      it("redis.unlink", async () => {
        await c8Client.redis.set("unlink1", "test", collectionName);
        await c8Client.redis.set("unlink2", "test", collectionName);
        const response = await c8Client.redis.unlink(
          ["unlink1", "unlink2"],
          collectionName
        );
        expect(response.result).to.equal(2);
        expect(response.code).to.equal(200);
      });

      it("redis.echo", async () => {
        const response = await c8Client.redis.echo(
          "Hello World!",
          collectionName
        );
        expect(response.result).to.equal("Hello World!");
        expect(response.code).to.equal(200);
      });
    });
  });
});
