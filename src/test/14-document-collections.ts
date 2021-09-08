import { expect } from "chai";
import { Fabric } from "../jsC8";
import { DocumentCollection } from "../collection";
import { getDCListString } from "../util/helper";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);
const it3x = C8_VERSION >= 30000 ? it : it.skip;

describe("DocumentCollection API", function () {
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);

  let name = `testdb${Date.now()}`;
  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "https://test.macrometa.io";

  let dcList: string;
  let collection: DocumentCollection;
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: C8_VERSION
    });

    await fabric.login("guest@macrometa.io", "guest");
    fabric.useTenant("guest");

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);

    await fabric.createFabric(name, ["root"], { dcList: dcList });
    fabric.useFabric(name);
  });
  after(async () => {
    try {
      fabric.useFabric("_system");
      await fabric.dropFabric(name);
    } finally {
      fabric.close();
    }
  });
  beforeEach(done => {
    collection = fabric.collection(`c${Date.now()}`);
    collection
      .create()
      .then(() => void done())
      .catch(done);
  });
  afterEach(done => {
    collection
      .drop()
      .then(() => void done())
      .catch(done);
  });
  describe("documentCollection.document", () => {
    let data = { foo: "bar" };
    let meta: any;
    beforeEach(async () => {
      meta = await collection.save(data);
    });
    it("returns a document in the collection", async () => {
      const doc = await collection.document(meta._id);
      expect(doc).to.have.keys("_key", "_id", "_rev", "foo");
      expect(doc._id).to.equal(meta._id);
      expect(doc._key).to.equal(meta._key);
      expect(doc._rev).to.equal(meta._rev);
      expect(doc.foo).to.equal(data.foo);
    });
    it("does not throw on not found when graceful", async () => {
      const doc = await collection.document("doesnotexist", true);
      expect(doc).to.equal(null);
    });
  });
  describe("documentCollection.documentExists", () => {
    let data = { foo: "bar" };
    let meta: any;
    beforeEach(async () => {
      meta = await collection.save(data);
    });
    it("returns true if the document exists", async () => {
      const exists = await collection.documentExists(meta._id);
      expect(exists).to.equal(true);
    });
    it("returns false if the document does not exist", async () => {
      const exists = await collection.documentExists("does-not-exist");
      expect(exists).to.equal(false);
    });
    it("returns false if the collection does not exist", async () => {
      const exists = await fabric
        .collection("doesnotexist")
        .documentExists("lol");
      expect(exists).to.equal(false);
    });
  });
  describe("documentCollection.save", () => {
    it("creates a document in the collection", done => {
      let data = { foo: "bar" };
      collection
        .save(data)
        .then(meta => {
          expect(meta).to.be.an("object");
          expect(meta)
            .to.have.property("_id")
            .that.is.a("string");
          expect(meta)
            .to.have.property("_rev")
            .that.is.a("string");
          expect(meta)
            .to.have.property("_key")
            .that.is.a("string");
          return collection.document(meta._id).then(doc => {
            expect(doc).to.have.keys("_key", "_id", "_rev", "foo");
            expect(doc._id).to.equal(meta._id);
            expect(doc._key).to.equal(meta._key);
            expect(doc._rev).to.equal(meta._rev);
            expect(doc.foo).to.equal(data.foo);
          });
        })
        .then(() => void done())
        .catch(done);
    });
    it("uses the given _key if provided", done => {
      let data = { potato: "tomato", _key: "banana" };
      collection
        .save(data)
        .then(meta => {
          expect(meta).to.be.an("object");
          expect(meta)
            .to.have.property("_id")
            .that.is.a("string");
          expect(meta)
            .to.have.property("_rev")
            .that.is.a("string");
          expect(meta)
            .to.have.property("_key")
            .that.equals(data._key);
          return collection.document(meta._id).then(doc => {
            expect(doc).to.have.keys("_key", "_id", "_rev", "potato");
            expect(doc._id).to.equal(meta._id);
            expect(doc._rev).to.equal(meta._rev);
            expect(doc._key).to.equal(data._key);
            expect(doc.potato).to.equal(data.potato);
          });
        })
        .then(() => void done())
        .catch(done);
    });
    it3x("returns the document if opts.returnNew is set", done => {
      let data = { potato: "tomato" };
      let opts = { returnNew: true };
      collection
        .save(data, opts)
        .then(meta => {
          expect(meta).to.be.an("object");
          expect(meta)
            .to.have.property("_id")
            .that.is.a("string");
          expect(meta)
            .to.have.property("_rev")
            .that.is.a("string");
          expect(meta)
            .to.have.property("_key")
            .that.is.a("string");
          expect(meta.new).to.be.an("object");
          expect(meta.new)
            .to.have.property("_id")
            .that.is.a("string");
          expect(meta.new)
            .to.have.property("_rev")
            .that.is.a("string");
          expect(meta.new)
            .to.have.property("_key")
            .that.is.a("string");
          expect(meta.new.potato).to.equal(data.potato);
        })
        .then(() => void done())
        .catch(done);
    });
    it3x("interprets opts as returnNew if it is a boolean", done => {
      let data = { potato: "tomato" };
      let opts = true;
      collection
        .save(data, opts)
        .then(meta => {
          expect(meta).to.be.an("object");
          expect(meta)
            .to.have.property("_id")
            .that.is.a("string");
          expect(meta)
            .to.have.property("_rev")
            .that.is.a("string");
          expect(meta)
            .to.have.property("_key")
            .that.is.a("string");
          expect(meta.new).to.be.an("object");
          expect(meta.new)
            .to.have.property("_id")
            .that.is.a("string");
          expect(meta.new)
            .to.have.property("_rev")
            .that.is.a("string");
          expect(meta.new)
            .to.have.property("_key")
            .that.is.a("string");
          expect(meta.new.potato).to.equal(data.potato);
        })
        .then(() => void done())
        .catch(done);
    });
  });
  describe("documentCollection.replace", () => {
    it("replaces the given document", done => {
      let doc = { potato: "tomato" };
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.replace(doc as any, { sup: "dawg" });
        })
        .then(() => collection.document((doc as any)._key))
        .then(data => {
          expect(data).not.to.have.property("potato");
          expect(data)
            .to.have.property("sup")
            .that.equals("dawg");
          done();
        })
        .catch(done);
    });
  });
  describe("documentCollection.update", () => {
    it("updates the given document", done => {
      let doc = { potato: "tomato", empty: false };
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.update(doc as any, { sup: "dawg", empty: null });
        })
        .then(() => collection.document((doc as any)._key))
        .then(data => {
          expect(data)
            .to.have.property("potato")
            .that.equals(doc.potato);
          expect(data)
            .to.have.property("sup")
            .that.equals("dawg");
          expect(data)
            .to.have.property("empty")
            .that.equals(null);
          done();
        })
        .catch(done);
    });
    it("removes null values if keepNull is explicitly set to false", done => {
      let doc = { potato: "tomato", empty: false };
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.update(
            doc as any,
            { sup: "dawg", empty: null },
            { keepNull: false }
          );
        })
        .then(() => collection.document((doc as any)._key))
        .then(data => {
          expect(data)
            .to.have.property("potato")
            .that.equals(doc.potato);
          expect(data)
            .to.have.property("sup")
            .that.equals("dawg");
          expect(data).not.to.have.property("empty");
          done();
        })
        .catch(done);
    });
  });
  describe("documentCollection.remove", () => {
    let key = `d_${Date.now()}`;
    beforeEach(done => {
      collection
        .save({ _key: key })
        .then(() => void done())
        .catch(done);
    });
    it("deletes the given document", done => {
      collection
        .remove(key)
        .then(() => collection.document(key))
        .then(
          () => Promise.reject(new Error("Should not succeed")),
          () => void done()
        )
        .catch(done);
    });
  });
  describe("documentCollection.replaceDocuments", () => {
    it("replaces the given documents", done => {
      const _key = `d_${Date.now()}`;
      const doc = { _key, potato: "tomato" };
      const replaceDocs = [{ _key, sup: "dawg" }];
      
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.replaceDocuments(replaceDocs as any);
        })
        .then(() => collection.document((doc as any)._key))
        .then(data => {
          expect(data).not.to.have.property("potato");
          expect(data)
            .to.have.property("sup")
            .that.equals("dawg");
          done();
        })
        .catch(done);
    });
  });
  describe("documentCollection.removeDocuments", () => {
    let key = `d_${Date.now()}`;
    beforeEach(done => {
      collection
        .save({ _key: key })
        .then(() => void done())
        .catch(done);
    });
    it("deletes the given documents", done => {
      collection
        .removeDocuments([key])
        .then(() => collection.document(key))
        .then(
          () => Promise.reject(new Error("Should not succeed")),
          () => void done()
        )
        .catch(done);
    });
  });
  describe("documentCollection.updateDocuments", () => {
    it("updates the given documents", done => {
      const _key = `d_${Date.now()}`;
      const doc = { _key, potato: "tomato", empty: false };
      const updatedDocs = [{ _key, potato: "tomato", sup: "dawg", empty: null }];
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.updateDocuments(updatedDocs as any);
        })
        .then(() => collection.document((doc as any)._key))
        .then(data => {
          expect(data)
            .to.have.property("potato")
            .that.equals(updatedDocs[0].potato);
          expect(data)
            .to.have.property("sup")
            .that.equals("dawg");
          expect(data)
            .to.have.property("empty")
            .that.equals(null);
          done();
        })
        .catch(done);
    });
    it("removes null values if keepNull is explicitly set to false", done => {
      const _key = `d_${Date.now()}`;
      const doc = { _key, potato: "tomato", empty: false };
      const updatedDocs = [{ _key, potato: "tomato", sup: "dawg", empty: null }];
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.updateDocuments(
            updatedDocs as any,
            { keepNull: false }
          );
        })
        .then(() => collection.document((doc as any)._key))
        .then(data => {
          expect(data)
            .to.have.property("potato")
            .that.equals(updatedDocs[0].potato);
          expect(data)
            .to.have.property("sup")
            .that.equals("dawg");
          expect(data).not.to.have.property("empty");
          done();
        })
        .catch(done);
    });
  });
});
