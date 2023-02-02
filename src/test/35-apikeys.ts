import { expect } from "chai";
import { ApiKeys } from "../apiKeys";
import { C8Client } from "../jsC8";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating new apis", function() {
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
  afterEach(() => {
    c8Client.close();
  });
  describe("ApiKeys.operations", () => {
    let apiKeys: ApiKeys;
    const keyid = "api_key_test";
    const collName = "api_key_coll";
    // const streamName = "api_key_stream";
    beforeEach(async () => {
      apiKeys = c8Client.apiKeys(keyid, "_system");
      await apiKeys.createApiKey();
      await c8Client.createCollection(collName);
    });

    afterEach(async () => {
      try {
        await apiKeys.removeApiKey();
        await c8Client.deleteCollection(collName);
      } catch (error) {}
    });

    describe("apiKey.getAvailableApiKey", () => {
      it("get avalilable api key", async () => {
        const response = await apiKeys.getAvailableApiKey();
        expect(response.error).to.be.false;
        expect(response.user).to.equal(keyid);
      });
    });

    describe("apikey database access level", () => {
      describe("apiKey.listAccessibleDatabases", () => {
        it("list accessible databases", async () => {
          const response = await apiKeys.listAccessibleDatabases();
          expect(response.error).to.be.false;
        });
      });

      describe("apiKey.getDatabaseAccessLevel", () => {
        it("get database access level", async () => {
          const response = await apiKeys.getDatabaseAccessLevel();
          expect(response.error).to.be.false;
        });
      });

      describe("apiKey.clearDatabaseAccessLevel", () => {
        it("clear database access level", async () => {
          const response = await apiKeys.clearDatabaseAccessLevel();
          expect(response.error).to.be.false;
        });
      });

      describe("apiKey.setDatabaseAccessLevel", () => {
        it("set database access level", async () => {
          await apiKeys.setDatabaseAccessLevel("rw");
          const response = await apiKeys.getDatabaseAccessLevel();
          expect(response.error).to.be.false;
          expect(response.result).to.equal("rw");
        });
      });
    });

    describe("apikey collection access level", () => {
      describe("apiKey.listAccessibleCollections", () => {
        it("list accessible collections", async () => {
          const response = await apiKeys.listAccessibleCollections();
          expect(response.error).to.be.false;
        });
      });

      describe("apiKey.getCollectionAccessLevel", () => {
        it("get collection access level", async () => {
          const response = await apiKeys.getCollectionAccessLevel(collName);
          expect(response.error).to.be.false;
        });
      });

      describe("apiKey.clearCollectionAccessLevel", () => {
        it("clear collection access level", async () => {
          const response = await apiKeys.clearCollectionAccessLevel(collName);
          expect(response.error).to.be.false;
        });
      });

      describe("apiKey.setCollectionAccessLevel", () => {
        it("set collection access level", async () => {
          await apiKeys.setCollectionAccessLevel(collName, "ro");
          const response = await apiKeys.getCollectionAccessLevel(collName);
          expect(response.error).to.be.false;
          expect(response.result).to.equal("ro");
        });
      });
    });

    // describe("apikey stream access level", () => {
    // beforeEach(async () => {
    //     await c8Client.createStream(streamName, false);
    // });

    // afterEach(async () => {
    //     try {
    //         const stream = await c8Client.stream(streamName, false);
    //         await stream.deleteStream(true);
    //     } catch (error) { }
    // });
    //     describe("apiKey.listAccessibleStreams", () => {
    //         it("list accessible streams", async () => {
    //             const response = await apiKeys.listAccessibleStreams();
    //             expect(response.error).to.be.false;
    //         });
    //     });

    //     describe("apiKey.getStreamAccessLevel", () => {
    //         it("get stream access level", async () => {
    //             const response = await apiKeys.getStreamAccessLevel(`c8globals.${streamName}`);
    //             expect(response.error).to.be.false;
    //         });
    //     });

    //     describe("apiKey.clearStreamAccessLevel", () => {
    //         it("clear stream access level", async () => {
    //             const response = await apiKeys.clearStreamAccessLevel(`c8globals.${streamName}`);
    //             expect(response.error).to.be.false;
    //         });
    //     });

    //     describe("apiKey.setStreamAccessLevel", () => {
    //         it("set stream access level", async () => {
    //             await apiKeys.setStreamAccessLevel(`c8globals.${streamName}`, "ro");
    //             const response = await apiKeys.getStreamAccessLevel(`c8globals.${streamName}`);
    //             expect(response.error).to.be.false;
    //             expect(response.result).to.equal("ro");
    //         });
    //     });
    // });

    describe("apikey billing access level", () => {
      describe("apiKey.getBillingAccessLevel", () => {
        it("get billing access level", async () => {
          const response = await apiKeys.getBillingAccessLevel();
          expect(response.error).to.be.false;
        });
      });

      describe("apiKey.clearBillingAccessLevel", () => {
        it.skip("clear billing access level", async () => {
          await apiKeys.clearBillingAccessLevel();
        });
      });

      describe("apiKey.setBillingAccessLevel", () => {
        it("set billing access level", async () => {
          await apiKeys.setBillingAccessLevel("ro");
          const response = await apiKeys.getBillingAccessLevel();
          expect(response.error).to.be.false;
          expect(response.result).to.deep.equal({ billing: "ro" });
        });
      });
    });
  });
});
