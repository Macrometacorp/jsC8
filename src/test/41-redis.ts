import { expect } from "chai";
import { C8Client } from "../jsC8";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating redis apis", function() {
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;

  beforeEach(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
  });

  describe("Redis", () => {
    const collectionName = "testRedisCollection";
    beforeEach(async () => {
      await c8Client.createCollection(collectionName);
    });

    afterEach(async () => {
      await c8Client.deleteCollection(collectionName);
    });

    describe("test redis string commands", () => {
      it("redis.set", async () => {
        const response = await c8Client.redis.set("testKey", "testValue", collectionName);
        expect(response.result).to.equal("OK");
        expect(response.code).to.equal(200);
      });
    });
  });
});
