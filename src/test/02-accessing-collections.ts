import { expect } from "chai";
import { Database } from "../jsC8";
import { DocumentCollection, EdgeCollection } from "../collection";

const range = (n: number): number[] => Array.from(Array(n).keys());

describe("Accessing collections", function() {
  // create database takes 11s in a standard cluster
  this.timeout(20000);

  let name = `testdb_${Date.now()}`;
  let db: Database;
  let builtinSystemCollections: string[];
  before(async () => {
    db = new Database({
      url: process.env.TEST_ARANGODB_URL || "http://localhost:8529",
      arangoVersion: Number(process.env.ARANGO_VERSION || 30400)
    });
    await db.createDatabase(name);
    db.useDatabase(name);
    const collections = await db.listCollections(false);
    builtinSystemCollections = collections.map((c: any) => c.name);
  });
  after(async () => {
    try {
      db.useDatabase("_system");
      await db.dropDatabase(name);
    } finally {
      db.close();
    }
  });
  describe("database.collection", () => {
    it("returns a DocumentCollection instance for the collection", () => {
      let name = "potato";
      let collection = db.collection(name);
      expect(collection).to.be.an.instanceof(DocumentCollection);
      expect(collection)
        .to.have.property("name")
        .that.equals(name);
    });
  });
  describe("database.edgeCollection", () => {
    it("returns an EdgeCollection instance for the collection", () => {
      let name = "tomato";
      let collection = db.edgeCollection(name);
      expect(collection).to.be.an.instanceof(EdgeCollection);
      expect(collection)
        .to.have.property("name")
        .that.equals(name);
    });
  });
  describe("database.listCollections", () => {
    let nonSystemCollectionNames = range(4).map(i => `c_${Date.now()}_${i}`);
    let systemCollectionNames = range(4).map(i => `_c_${Date.now()}_${i}`);
    before(done => {
      Promise.all([
        ...nonSystemCollectionNames.map(name => db.collection(name).create()),
        ...systemCollectionNames.map(name =>
          db.collection(name).create({ isSystem: true })
        )
      ])
        .then(() => void done())
        .catch(done);
    });
    after(done => {
      Promise.all([
        ...nonSystemCollectionNames.map(name => db.collection(name).drop()),
        ...systemCollectionNames.map(name =>
          db.collection(name).drop({ isSystem: true })
        )
      ])
        .then(() => void done())
        .catch(done);
    });
    it("fetches information about all non-system collections", done => {
      db.listCollections()
        .then(collections => {
          expect(collections.length).to.equal(nonSystemCollectionNames.length);
          expect(collections.map((c: any) => c.name).sort()).to.eql(
            nonSystemCollectionNames
          );
          done();
        })
        .catch(done);
    });
    it("includes system collections if explicitly passed false", done => {
      db.listCollections(false)
        .then(collections => {
          let allCollectionNames = nonSystemCollectionNames
            .concat(systemCollectionNames)
            .concat(builtinSystemCollections)
            .sort();
          expect(collections.length).to.be.at.least(allCollectionNames.length);
          expect(collections.map((c: any) => c.name).sort()).to.eql(
            allCollectionNames
          );
          done();
        })
        .catch(done);
    });
  });
  describe("database.collections", () => {
    let documentCollectionNames = range(4).map(i => `dc_${Date.now()}_${i}`);
    let edgeCollectionNames = range(4).map(i => `ec_${Date.now()}_${i}`);
    let systemCollectionNames = range(4).map(i => `_c_${Date.now()}_${i}`);
    before(done => {
      Promise.all([
        ...documentCollectionNames.map(name => db.collection(name).create()),
        ...edgeCollectionNames.map(name => db.edgeCollection(name).create()),
        ...systemCollectionNames.map(name =>
          db.collection(name).create({ isSystem: true })
        )
      ])
        .then(() => void done())
        .catch(done);
    });
    after(done => {
      Promise.all([
        ...documentCollectionNames.map(name => db.collection(name).drop()),
        ...edgeCollectionNames.map(name => db.edgeCollection(name).drop()),
        ...systemCollectionNames.map(name =>
          db.collection(name).drop({ isSystem: true })
        )
      ])
        .then(() => void done())
        .catch(done);
    });
    it("creates DocumentCollection and EdgeCollection instances", done => {
      db.collections()
        .then(collections => {
          let documentCollections = collections
            .filter((c: any) => c instanceof DocumentCollection)
            .sort();
          let edgeCollections = collections
            .filter((c: any) => c instanceof EdgeCollection)
            .sort();
          expect(documentCollections.length).to.equal(
            documentCollectionNames.length
          );
          expect(documentCollections.map((c: any) => c.name).sort()).to.eql(
            documentCollectionNames
          );
          expect(edgeCollections.length).to.equal(edgeCollectionNames.length);
          expect(edgeCollections.map((c: any) => c.name).sort()).to.eql(
            edgeCollectionNames
          );
          done();
        })
        .catch(done);
    });
    it("includes system collections if explicitly passed false", done => {
      db.collections(false)
        .then(collections => {
          let documentCollections = collections.filter(
            (c: any) => c instanceof DocumentCollection
          );
          let edgeCollections = collections.filter(
            (c: any) => c instanceof EdgeCollection
          );
          let allDocumentCollectionNames = documentCollectionNames
            .concat(systemCollectionNames)
            .concat(builtinSystemCollections)
            .sort();
          expect(documentCollections.length).to.be.at.least(
            allDocumentCollectionNames.length
          );
          expect(documentCollections.map((c: any) => c.name).sort()).to.eql(
            allDocumentCollectionNames
          );
          expect(edgeCollections.length).to.be.at.least(
            edgeCollectionNames.length
          );
          expect(edgeCollections.map((c: any) => c.name).sort()).to.eql(
            edgeCollectionNames
          );
          done();
        })
        .catch(done);
    });
  });
});
