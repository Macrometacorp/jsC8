import { expect } from "chai";
import { Fabric } from "../jsC8";
import { COLLECTION_NOT_FOUND, DocumentCollection } from "../collection";
import { getDCListString } from "../util/helper";

describe("Collection metadata", function () {
  // create fabric takes 11s in a standard cluster
  this.timeout(20000);

  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

  let dcList: string;
  let dbName = `testdb_${Date.now()}`;
  let collection: DocumentCollection;
  let collectionName = `collection-${Date.now()}`;
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
    });

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);

    await fabric.createFabric(dbName, [{ username: 'root' }], { dcList: dcList, realTime: false });
    fabric.useFabric(dbName);
    collection = fabric.collection(collectionName);
    await collection.create();
  });
  after(async () => {
    fabric.useFabric("_system");
    await fabric.dropFabric(dbName);
  });
  describe("collection.get", () => {
    it("should return information about a collection", async () => {
      const info = await collection.get();
      expect(info).to.have.property("name", collectionName);
      expect(info).to.have.property("isSystem", false);
      expect(info).to.have.property("status", 3); // loaded
      expect(info).to.have.property("type", 2); // document collection
    });
    it("should throw if collection does not exist", async () => {
      try {
        await fabric.collection("no").get();
      } catch (e) {
        expect(e).to.have.property("errorNum", COLLECTION_NOT_FOUND);
        return;
      }
      expect.fail("should throw");
    });
  });
  describe("collection.exists", () => {
    it("should return true if collection exists", async () => {
      const exists = await collection.exists();
      expect(exists).to.equal(true);
    });
    it("should return false if collection does not exist", async () => {
      const exists = await fabric.collection("no").exists();
      expect(exists).to.equal(false);
    });
  });
  describe("collection.properties", () => {
    it("should return properties of a collection", done => {
      collection
        .properties()
        .then(properties => {
          expect(properties).to.have.property("name", collectionName);
          expect(properties).to.have.property("waitForSync", false);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.count", () => {
    it("should return information about a collection", done => {
      collection
        .count()
        .then(info => {
          expect(info).to.have.property("name", collectionName);
          expect(info).to.have.property("count", 0);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.revision", () => {
    it("should return information about a collection", done => {
      collection
        .revision()
        .then(info => {
          expect(info).to.have.property("name", collectionName);
          expect(info).to.have.property("revision");
        })
        .then(() => done())
        .catch(done);
    });
  });
});
