import { expect } from "chai";
import { C8Client } from "../jsC8";
import { DocumentCollection, EdgeCollection } from "../collection";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const range = (n: number): number[] => Array.from(Array(n).keys());
const C8_VERSION = Number(process.env.C8_VERSION || 30400);

// Keep in mind that fabric extends C8Client
// All the methods that fabric contains C8Client has as well
describe("Accessing collections", function () {
  dotenv.config();
  // create fabric takes 11s in a standard cluster
  this.timeout(600000);
  let c8Client: C8Client;

  let name = `testdb${Date.now()}`;
  let builtinSystemCollections: string[];

  let dcList: string;
  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });

    const response = await c8Client.getAllEdgeLocations();
    dcList = getDCListString(response);
    await c8Client.createFabric(name, ["root"], { dcList: dcList });
    c8Client.useFabric(name);
    const collections = await c8Client.listCollections(false);
    builtinSystemCollections = collections.map((c: any) => c.name);
  });
  after(async () => {
    try {
      c8Client.useFabric("_system");
      await c8Client.dropFabric(name);
    } finally {
      c8Client.close();
    }
  });
  describe("fabric.collection", () => {
    it("returns a DocumentCollection instance for the collection", () => {
      let name = "potato";
      let collection = c8Client.collection(name);
      expect(collection).to.be.an.instanceof(DocumentCollection);
      expect(collection).to.have.property("name").that.equals(name);
    });
  });
  describe("fabric.edgeCollection", () => {
    it("returns an EdgeCollection instance for the collection", () => {
      let name = "tomato";
      let collection = c8Client.edgeCollection(name);
      expect(collection).to.be.an.instanceof(EdgeCollection);
      expect(collection).to.have.property("name").that.equals(name);
    });
  });
  describe("fabric.listCollections", async () => {
    let nonSystemCollectionNames = range(4).map((i) => `c${i}${Date.now()}`);
    // let systemCollectionNames = range(4).map(i => `csys${i}${Date.now()}`);
    before(async () => {
      await Promise.all([
        ...nonSystemCollectionNames.map((name) =>
          c8Client.collection(name).create()
        ),
        // ...systemCollectionNames.map(name =>
        //   fabric.collection(name).create({ isSystem: true })
        // )
      ]);
    });
    after((done) => {
      Promise.all([
        ...nonSystemCollectionNames.map((name) =>
          c8Client.collection(name).drop()
        ),
        // ...systemCollectionNames.map(name =>
        //   fabric.collection(name).drop({ isSystem: true })
        // )
      ])
        .then(() => void done())
        .catch(done);
    });
    it("fetches information about all non-system collections", (done) => {
      c8Client
        .listCollections()
        .then((collections) => {
          expect(collections.length).to.equal(nonSystemCollectionNames.length);
          expect(collections.map((c: any) => c.name).sort()).to.eql(
            nonSystemCollectionNames
          );
          done();
        })
        .catch(done);
    });
    it("includes system collections if explicitly passed false", (done) => {
      c8Client
        .listCollections(false)
        .then((collections) => {
          let allCollectionNames = nonSystemCollectionNames
            // .concat(systemCollectionNames)
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
  describe("fabric.collections", () => {
    let documentCollectionNames = range(4).map((i) => `dc${i}${Date.now()}`);
    let edgeCollectionNames = range(4).map((i) => `ec${i}${Date.now()}`);

    before((done) => {
      Promise.all([
        ...documentCollectionNames.map((name) =>
          c8Client.collection(name).create()
        ),
        ...edgeCollectionNames.map((name) =>
          c8Client.edgeCollection(name).create()
        ),
      ])
        .then(() => void done())
        .catch(done);
    });
    after((done) => {
      Promise.all([
        ...documentCollectionNames.map((name) =>
          c8Client.collection(name).drop()
        ),
        ...edgeCollectionNames.map((name) =>
          c8Client.edgeCollection(name).drop()
        ),
      ])
        .then(() => void done())
        .catch(done);
    });
    it("creates DocumentCollection and EdgeCollection instances", (done) => {
      c8Client
        .collections()
        .then((collections) => {
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
    it("includes system collections if explicitly passed false", (done) => {
      c8Client
        .collections(false)
        .then((collections) => {
          let documentCollections = collections.filter(
            (c: any) => c instanceof DocumentCollection
          );
          let edgeCollections = collections.filter(
            (c: any) => c instanceof EdgeCollection
          );
          let allDocumentCollectionNames = documentCollectionNames
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
