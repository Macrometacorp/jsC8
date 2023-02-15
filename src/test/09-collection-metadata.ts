import { expect } from "chai";
import { C8Client } from "../jsC8";
import { COLLECTION_NOT_FOUND, DocumentCollection } from "../collection";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);
describe("Collection metadata", function () {
  // create fabric takes 11s in a standard cluster
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;

  let dcList: string;
  let dbName = `testdb${Date.now()}`;
  let collection: DocumentCollection;
  let collectionName = `collection${Date.now()}`;
  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });

    const response = await c8Client.getAllEdgeLocations();
    dcList = getDCListString(response);

    await c8Client.createFabric(dbName, ["root"], {
      dcList: dcList,
    });
    c8Client.useFabric(dbName);
    collection = c8Client.collection(collectionName);
    await collection.create();
  });
  after(async () => {
    c8Client.useFabric("_system");
    await c8Client.dropFabric(dbName);
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
        await c8Client.collection("no").get();
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
      const exists = await c8Client.collection("no").exists();
      expect(exists).to.equal(false);
    });
  });
  describe("collection.properties", () => {
    it("should return properties of a collection", (done) => {
      collection
        .properties()
        .then((properties) => {
          expect(properties).to.have.property("name", collectionName);
          expect(properties).to.have.property("waitForSync", false);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.count", () => {
    it("should return information about a collection", (done) => {
      collection
        .count()
        .then((info) => {
          expect(info).to.have.property("name", collectionName);
          expect(info).to.have.property("count", 0);
        })
        .then(() => done())
        .catch(done);
    });
  });
  /*describe("collection.revision", () => {
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
  });*/
});
