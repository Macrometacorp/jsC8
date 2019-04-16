import { expect } from "chai";
import { Fabric } from "../jsC8";
import { DocumentCollection, EdgeCollection } from "../collection";
import { getDCListString } from "../util/helper";

const range = (n: number): number[] => Array.from(Array(n).keys());

describe("Accessing collections", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(600000);

  let name = `testdb${Date.now()}`;
  let fabric: Fabric;
  let builtinSystemCollections: string[];
  const testUrl: string =
    process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

  let dcList: string;
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
    });

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);
    await fabric.createFabric(name, [{ username: "root" }], { dcList: dcList });
    fabric.useFabric(name);
    const collections = await fabric.listCollections(false);
    builtinSystemCollections = collections.map((c: any) => c.name);
  });
  after(async () => {
    try {
      fabric.useFabric("_system");
      await fabric.dropFabric(name);
    } finally {
      fabric.close();
    }
  });
  describe("fabric.collection", () => {
    it("returns a DocumentCollection instance for the collection", () => {
      let name = "potato";
      let collection = fabric.collection(name);
      expect(collection).to.be.an.instanceof(DocumentCollection);
      expect(collection)
        .to.have.property("name")
        .that.equals(name);
    });
  });
  describe("fabric.edgeCollection", () => {
    it("returns an EdgeCollection instance for the collection", () => {
      let name = "tomato";
      let collection = fabric.edgeCollection(name);
      expect(collection).to.be.an.instanceof(EdgeCollection);
      expect(collection)
        .to.have.property("name")
        .that.equals(name);
    });
  });
  describe("fabric.listCollections", async () => {
    let nonSystemCollectionNames = range(4).map(i => `c${i}${Date.now()}`);
    // let systemCollectionNames = range(4).map(i => `csys${i}${Date.now()}`);
    before(async () => {
      await Promise.all([
        ...nonSystemCollectionNames.map(name =>
          fabric.collection(name).create()
        )
        // ...systemCollectionNames.map(name =>
        //   fabric.collection(name).create({ isSystem: true })
        // )
      ]);
    });
    after(done => {
      Promise.all([
        ...nonSystemCollectionNames.map(name => fabric.collection(name).drop())
        // ...systemCollectionNames.map(name =>
        //   fabric.collection(name).drop({ isSystem: true })
        // )
      ])
        .then(() => void done())
        .catch(done);
    });
    it("fetches information about all non-system collections", done => {
      fabric
        .listCollections()
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
      fabric
        .listCollections(false)
        .then(collections => {
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
    let documentCollectionNames = range(4).map(i => `dc${i}${Date.now()}`);
    let edgeCollectionNames = range(4).map(i => `ec${i}${Date.now()}`);

    before(done => {
      Promise.all([
        ...documentCollectionNames.map(name =>
          fabric.collection(name).create()
        ),
        ...edgeCollectionNames.map(name => fabric.edgeCollection(name).create())
      ])
        .then(() => void done())
        .catch(done);
    });
    after(done => {
      Promise.all([
        ...documentCollectionNames.map(name => fabric.collection(name).drop()),
        ...edgeCollectionNames.map(name => fabric.edgeCollection(name).drop())
      ])
        .then(() => void done())
        .catch(done);
    });
    it("creates DocumentCollection and EdgeCollection instances", done => {
      fabric
        .collections()
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
      fabric
        .collections(false)
        .then(collections => {
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
