import { expect } from "chai";
import { C8Client } from "../jsC8";
import { C8Error } from "../error";
import { getDCListString } from "../util/helper";
import { Fabric } from "../jsC8";
import * as dotenv from "dotenv";

const range = (n: number): number[] => Array.from(Array(n).keys());
const C8_VERSION = Number(process.env.C8_VERSION || 30400);
const it2x = C8_VERSION < 30000 ? it : it.skip;

describe("Manipulating fabrics", function () {
  // create fabric takes 11s in a standard cluster
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

  describe("fabric.useFabric", () => {
    it("should return the version object when no details are required", async () => {
      const response = await c8Client.version();
      expect(response.server).to.equal("C8DB");
    });
    it("updates the fabric name", () => {
      const name = "example";
      expect(c8Client.name).to.equal("_system"); // default
      c8Client.useFabric(name);
      expect((c8Client as any)._connection).to.have.property(
        "_fabricName",
        name
      );
      expect(c8Client.name).to.equal(name);
    });
    it("returns itself", () => {
      const fabric2 = c8Client.useFabric("nope");
      expect(c8Client).to.equal(fabric2);
    });
  });
  describe("fabric.edgeLocations", () => {
    this.beforeEach(() => c8Client.useFabric("_system"));
    it("gets all the edge locations", async () => {
      const response = await c8Client.getAllEdgeLocations();
      expect(Array.isArray(response)).to.be.true;
      expect(response[0]).to.haveOwnProperty("_key");
      expect(response[0]).to.haveOwnProperty("host");
      expect(response[0]).to.haveOwnProperty("local");
      expect(response[0]).to.haveOwnProperty("name");
      expect(response[0]).to.haveOwnProperty("spot_region");
      expect(response[0]).to.haveOwnProperty("status");
      expect(response[0]).to.haveOwnProperty("tags");
      expect(response[0]).to.haveOwnProperty("tags");
      expect(response.length).to.be.greaterThan(0);
    });
    it("gets local edge location", async () => {
      const response = await c8Client.getLocalEdgeLocation();
      expect(Array.isArray(response)).to.be.false;
      expect(response).to.haveOwnProperty("_key");
      expect(response).to.haveOwnProperty("host");
      expect(response).to.haveOwnProperty("local");
      expect(response).to.haveOwnProperty("name");
      expect(response).to.haveOwnProperty("spot_region");
      expect(response).to.haveOwnProperty("status");
      expect(response).to.haveOwnProperty("tags");
      expect(response).to.haveOwnProperty("tags");
    });
  });
  describe("fabric.createFabric", () => {
    let name = `testfabric${Date.now()}`;
    afterEach(async () => {
      c8Client.useFabric("_system");
      await c8Client.dropFabric(name);
    });
    it("creates a fabric with the given name", async () => {
      const response = await c8Client.getAllEdgeLocations();
      let dcList: string = getDCListString(response);
      await c8Client.createFabric(name, ["root"], {
        dcList: dcList,
      });
      c8Client.useFabric(name);
      const info = await c8Client.get();
      expect(info.name).to.equal(name);
    });
  });
  describe("fabric.get", () => {
    it("fetches the fabric description if the fabric exists", async () => {
      const info = await c8Client.get();
      expect(info.name).to.equal(c8Client.name);
      expect(c8Client.name).to.equal("_system");
    });
    it("fails if the fabric does not exist", async () => {
      c8Client.useFabric("__does_not_exist__");
      try {
        await c8Client.get();
      } catch (e) {
        expect(e).to.be.an.instanceof(C8Error);
        return;
      }
      expect.fail("should not succeed");
    });
  });
  describe("fabric.listFabrics", () => {
    it("returns a list of all fabrics", async () => {
      const fabrics = await c8Client.listFabrics();
      expect(fabrics).to.be.an.instanceof(Array);
      expect(fabrics.indexOf("_system")).to.be.greaterThan(-1);
    });
  });
  describe("fabric.listUserFabrics", () => {
    it("returns a list of fabrics accessible to the active user", async () => {
      const fabrics = await c8Client.listUserFabrics();
      expect(fabrics).to.be.an.instanceof(Array);
      expect(fabrics[0].name).to.equal("_system");
    });
  });
  describe("fabric.dropFabric", () => {
    let name = `testfabric${Date.now()}`;
    beforeEach(async () => {
      const response = await c8Client.getAllEdgeLocations();
      let dcList: string = getDCListString(response);
      await c8Client.createFabric(name, ["root"], {
        dcList: dcList,
      });
    });
    it("deletes the given fabric from the server", async () => {
      await c8Client.dropFabric(name);
      let temp = new Fabric().useFabric(name);
      try {
        await temp.get();
      } catch (e) {
        return;
      } finally {
        temp.close();
      }
      expect.fail("should not succeed");
    });
  });
  // We need to be sure that user can create system collection
  // C8Error: tenant cannot create system collection
  // We need MM api key to run this test
  describe("fabric.truncate", () => {
    let name = `testfabric${Date.now()}`;
    let nonSystemCollections = range(4).map((i) => `c${i}${Date.now()}`);
    let systemCollections = range(4).map((i) => `_c${i}${Date.now()}${i}`);
    beforeEach(async () => {
      const response = await c8Client.getAllEdgeLocations();
      let dcList: string = getDCListString(response);
      await c8Client.createFabric(name, ["root"], {
        dcList: dcList,
      });
      c8Client.useFabric(name);
      await Promise.all([
        ...nonSystemCollections.map(async (name) => {
          let collection = c8Client.collection(name);
          await collection.create();
          await collection.save({ _key: "example" });
        }),
        ...systemCollections.map(async (name) => {
          let collection = c8Client.collection(name);
          await collection.create({ isSystem: true });
          await collection.save({ _key: "example" });
        }),
      ]);
    });
    afterEach(async () => {
      c8Client.useFabric("_system");
      await c8Client.dropFabric(name);
    });
    it("removes all documents from all non-system collections in the fabric", async () => {
      await c8Client.truncate();
      await Promise.all([
        ...nonSystemCollections.map(async (name) => {
          try {
            await c8Client.collection(name).document("example");
            expect.fail("Expected document to be destroyed");
          } catch (e) {
            const message = String(e);
            if (e instanceof C8Error) {
              expect(e).to.be.an.instanceof(C8Error);
              expect(e.code).eq(404);
              return;
            }
            console.log(message);
          }
        }),
        ...systemCollections.map(async (name) => {
          try {
            await c8Client.collection(name).document("example");
            expect.fail("Expected document to be destroyed");
          } catch (e) {
            const message = String(e);
            if (e instanceof C8Error) {
              expect(e).to.be.an.instanceof(C8Error);
              expect(e.code).eq(404);
              return;
            }
            console.log(message);
          }
        }),
      ]);
    });
    it2x(
      "additionally truncates system collections if explicitly passed false",
      async () => {
        await c8Client.truncate(false);
        await Promise.all(
          nonSystemCollections.map(async (name) => {
            let doc;
            try {
              doc = await c8Client.collection(name).document("example");
            } catch (e) {
              expect(e).to.be.an.instanceof(C8Error);
              return;
            }
            expect.fail(`Expected document to be destroyed: ${doc._id}`);
          })
        );
      }
    );
  });
  describe("fabric.validateQuery", () => {
    it("should validate correct query", async () => {
      const response = await c8Client.validateQuery(
        "for doc in docs return doc"
      );
      expect(response.error).to.be.false;
    });
    it("should validate incorrect query", async () => {
      try {
        const response = await c8Client.validateQuery(
          "forrrr doc in docs return doc"
        );
        expect(response.error).to.be.true;
      } catch (e) {
        expect(e).to.be.an.instanceof(C8Error);
      }
    });
  });
  describe("fabric.explainQuery", () => {
    const collectionName = `testColl${Date.now().toString()}`;

    this.beforeAll(async () => {
      await c8Client.createCollection(collectionName);
    });
    this.afterAll(async () => {
      await c8Client.deleteCollection(collectionName);
    });
    it("should explain query", async () => {
      const queryObject = {
        query: `for doc in ${collectionName} return doc`,
        bindVars: {},
      };
      const response = await c8Client.explainQuery(queryObject);
      expect(response.error).to.be.false;
    });
  });
});

//   describe("fabric.getCurrentQueries", () => {
//     it("should get currently running queries");
//   });
//   describe("fabric.clearSlowQueries", () => {
//     it("should clear slow queries");
//   });
//   describe("fabric.terminateRunningQuery", () => {
//     it("should terminate running query");
//   });
// });
