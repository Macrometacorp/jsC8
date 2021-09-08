import { expect } from "chai";
import { Fabric } from "../jsC8";
import { DocumentCollection } from "../collection";
import { getDCListString } from "../util/helper";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);
const itPre34 = C8_VERSION < 30400 ? it : it.skip;
const it34 = C8_VERSION >= 30400 ? it : it.skip;

describe("Managing indexes", function () {
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);

  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "https://test.macrometa.io";

  let dcList: string;
  let dbName = `testdb${Date.now()}`;
  let collection: DocumentCollection;
  let collectionName = `collection${Date.now()}`;
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: C8_VERSION
    });

    await fabric.login("guest@macrometa.io", "guest");
    fabric.useTenant("guest");

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);

    await fabric.createFabric(dbName, ["root"], {
      dcList: dcList
    });
    fabric.useFabric(dbName);
    collection = fabric.collection(collectionName);
    await collection.create();
  });
  after(async () => {
    try {
      fabric.useFabric("_system");
      await fabric.dropFabric(dbName);
    } finally {
      fabric.close();
    }
  });
  describe("collection.createIndex", () => {
    it("should create a index of given type", done => {
      collection
        .createIndex({
          type: "hash",
          fields: ["value0"]
        })
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "hash");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value0"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.createHashIndex", () => {
    it("should create a hash index", done => {
      collection
        .createHashIndex(["value"])
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "hash");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.createSkipList", () => {
    it("should create a skiplist index", done => {
      collection
        .createSkipList(["value"])
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "skiplist");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.createPersistentIndex", () => {
    it("should create a persistent index", done => {
      collection
        .createPersistentIndex(["value"])
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "persistent");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.createGeoIndex", () => {
    itPre34("should create a geo1 index for one field", done => {
      collection
        .createGeoIndex(["value"])
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "geo");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
    itPre34("should create a geo2 index for two fields", done => {
      collection
        .createGeoIndex(["value1", "value2"])
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "geo");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value1", "value2"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
    it34("should create a geo index for one field", done => {
      collection
        .createGeoIndex(["value"])
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "geo");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
    it34("should create a geo index for two fields", done => {
      collection
        .createGeoIndex(["value1", "value2"])
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "geo");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value1", "value2"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.createFulltextIndex", () => {
    it("should create a fulltext index", done => {
      collection
        .createFulltextIndex(["value"])
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "fulltext");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.index", () => {
    it("should return information about a index", done => {
      collection
        .createHashIndex(["test"])
        .then(info => {
          return collection.index(info.name).then(index => {
            expect(index).to.have.property("id", info.id);
            expect(index).to.have.property("type", info.type);
          });
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.indexes", () => {
    it("should return a list of indexes", done => {
      collection
        .createHashIndex(["test"])
        .then(index => {
          return collection.indexes().then(indexes => {
            expect(indexes).to.be.instanceof(Array);
            expect(indexes).to.not.be.empty;
            expect(
              indexes.filter((i: any) => i.id === index.id).length
            ).to.equal(1);
          });
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.dropIndex", () => {
    it("should drop existing index", done => {
      collection
        .createHashIndex(["test"])
        .then(info => {
          return collection.dropIndex(info.name).then(index => {
            expect(index).to.have.property("id", info.id);
            return collection.indexes().then(indexes => {
              expect(indexes).to.be.instanceof(Array);
              expect(indexes).to.not.be.empty;
              expect(
                indexes.filter((i: any) => i.id === index.id).length
              ).to.equal(0);
            });
          });
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("collection.createTtlIndex", () => {
    it("should create a Ttl index", done => {
      collection
        .createTtlIndex(["value"], 0)
        .then(info => {
          expect(info).to.have.property("id");
          expect(info).to.have.property("type", "ttl");
          expect(info).to.have.property("fields");
          expect(info.fields).to.eql(["value"]);
          expect(info).to.have.property("isNewlyCreated", true);
        })
        .then(() => done())
        .catch(done);
    });
  });
});
