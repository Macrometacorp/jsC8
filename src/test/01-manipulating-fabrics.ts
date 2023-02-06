import { expect } from "chai";
import { Fabric } from "../jsC8";
import { C8Error } from "../error";
import { getDCListString } from "../util/helper";
import { DocumentCollection } from "../collection";

const range = (n: number): number[] => Array.from(Array(n).keys());
const C8_VERSION = Number(process.env.C8_VERSION || 30400);
const it2x = C8_VERSION < 30000 ? it : it.skip;

describe("Manipulating fabrics", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);

  let fabric: Fabric;
  const testUrl: string =
    process.env.TEST_C8_URL || "https://test.macrometa.io";

  let dcList: string;
  beforeEach(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: C8_VERSION,
    });

    await fabric.login("guest@macrometa.io", "guest");
    fabric.useTenant("guest");

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);
  });
  afterEach(() => {
    fabric.close();
  });
  describe("fabric.version", () => {
    this.beforeAll(async () => {
      fabric = new Fabric({
        url: testUrl,
        c8Version: C8_VERSION,
      });

      await fabric.login("guest@macrometa.io", "guest");
      fabric.useTenant("guest");

      const response = await fabric.getAllEdgeLocations();
      dcList = getDCListString(response);
    });
    this.afterAll(() => {
      fabric.close();
    });
    it("should return the version object when no details are required", async () => {
      const response = await fabric.version();
      expect(response.server).to.equal("C8DB");
    });
    it("should return the version object when details are required", async () => {
      const response = await fabric.version(true);
      expect(response.server).to.equal("C8DB");
      expect(response.details).to.haveOwnProperty("architecture");
    });
  });
  describe("fabric.useFabric", () => {
    it("updates the fabric name", () => {
      const name = "example";
      expect(fabric.name).to.equal("_system"); // default
      fabric.useFabric(name);
      expect((fabric as any)._connection).to.have.property("_fabricName", name);
      expect(fabric.name).to.equal(name);
    });
    it("returns itself", () => {
      const fabric2 = fabric.useFabric("nope");
      expect(fabric).to.equal(fabric2);
    });
  });
  describe("fabric.edgeLocations", () => {
    this.beforeEach(() => fabric.useFabric("_system"));
    it("gets all the edge locations", async () => {
      const response = await fabric.getAllEdgeLocations();
      expect(Array.isArray(response)).to.be.true;
      expect(response[0]).to.haveOwnProperty("_id");
      expect(response[0]).to.haveOwnProperty("name");
      expect(response[0]).to.haveOwnProperty("tags");
      expect(response.length).to.be.greaterThan(0);
    });
    it("gets local edge location", async () => {
      const response = await fabric.getLocalEdgeLocation();
      expect(Array.isArray(response)).to.be.false;
      expect(response).to.haveOwnProperty("_id");
      expect(response).to.haveOwnProperty("name");
      expect(response).to.haveOwnProperty("tags");
    });
  });
  describe("fabric.createFabric", () => {
    let name = `testfabric${Date.now()}`;
    afterEach(async () => {
      fabric.useFabric("_system");
      await fabric.dropFabric(name);
    });
    it("creates a fabric with the given name", async () => {
      await fabric.createFabric(name, ["root"], {
        dcList: dcList,
      });
      fabric.useFabric(name);
      const info = await fabric.get();
      expect(info.name).to.equal(name);
    });
    it("adds the given users to the fabric");
  });
  describe("fabric.get", () => {
    it("fetches the fabric description if the fabric exists", async () => {
      const info = await fabric.get();
      expect(info.name).to.equal(fabric.name);
      expect(fabric.name).to.equal("_system");
    });
    it("fails if the fabric does not exist", async () => {
      fabric.useFabric("__does_not_exist__");
      try {
        await fabric.get();
      } catch (e) {
        expect(e).to.be.an.instanceof(C8Error);
        return;
      }
      expect.fail("should not succeed");
    });
  });
  describe("fabric.listFabrics", () => {
    it("returns a list of all fabrics", async () => {
      const fabrics = await fabric.listFabrics();
      expect(fabrics).to.be.an.instanceof(Array);
      expect(fabrics.indexOf("_system")).to.be.greaterThan(-1);
    });
  });
  describe("fabric.listUserFabrics", () => {
    it("returns a list of fabrics accessible to the active user", async () => {
      const fabrics = await fabric.listUserFabrics();
      expect(fabrics).to.be.an.instanceof(Array);
      expect(fabrics[0].name).to.equal("_system");
    });
  });
  describe("fabric.dropFabric", () => {
    let name = `testfabric${Date.now()}`;
    beforeEach(async () => {
      await fabric.createFabric(name, ["root"], {
        dcList: dcList,
      });
    });
    it("deletes the given fabric from the server", async () => {
      await fabric.dropFabric(name);
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
  describe("fabric.truncate", () => {
    let name = `testfabric${Date.now()}`;
    let nonSystemCollections = range(4).map(i => `c${i}${Date.now()}`);
    let systemCollections = range(4).map(i => `c${i}${Date.now()}${i}`);
    beforeEach(async () => {
      await fabric.createFabric(name, ["root"], {
        dcList: dcList,
      });
      fabric.useFabric(name);
      await Promise.all([
        ...nonSystemCollections.map(async name => {
          let collection = fabric.collection(name);
          await collection.create();
          await collection.save({ _key: "example" });
        }),
        ...systemCollections.map(async name => {
          let collection = fabric.collection(name);
          await collection.create({ isSystem: true });
          await collection.save({ _key: "example" });
        }),
      ]);
    });
    afterEach(async () => {
      fabric.useFabric("_system");
      await fabric.dropFabric(name);
    });
    it("removes all documents from all non-system collections in the fabric", async () => {
      await fabric.truncate();
      await Promise.all([
        ...nonSystemCollections.map(async name => {
          try {
            await fabric.collection(name).document("example");
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
        ...systemCollections.map(async name => {
          try {
            await fabric.collection(name).document("example");
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
        await fabric.truncate(false);
        await Promise.all(
          nonSystemCollections.map(async name => {
            let doc;
            try {
              doc = await fabric.collection(name).document("example");
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
      const response = await fabric.validateQuery("for doc in docs return doc");
      expect(response.error).to.be.false;
    });
    it("should validate incorrect query", async () => {
      try {
        const response = await fabric.validateQuery(
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
    let collection: DocumentCollection;
    this.beforeAll(async () => {
      const fabric2 = new Fabric({
        url: testUrl,
      });
      await fabric2.login("guest@macrometa.io", "guest");
      fabric2.useTenant("guest");
      collection = fabric2.collection(collectionName);
      await collection.create();
    });
    this.afterAll(async () => {
      await collection.drop();
    });
    it("should explain query", async () => {
      const queryObject = {
        query: `for doc in ${collectionName} return doc`,
        bindVars: {},
      };
      const response = await fabric.explainQuery(queryObject);
      expect(response.error).to.be.false;
    });
  });
  describe("fabric.getCurrentQueries", () => {
    it("should get currently running queries");
  });
  describe("fabric.clearSlowQueries", () => {
    it("should clear slow queries");
  });
  describe("fabric.terminateRunningQuery", () => {
    it("should terminate running query");
  });
});
