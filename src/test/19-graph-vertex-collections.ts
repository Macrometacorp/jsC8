import { expect } from "chai";
import { C8Client } from "../jsC8";
import { GraphVertexCollection } from "../graph";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("GraphVertexCollection API", function() {
  dotenv.config();
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);
  let c8Client: C8Client;

  const dbName = `testdb${Date.now()}`;

  let dcList: string;
  let collection: GraphVertexCollection;
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
    const graph = c8Client.graph(`testgraph${Date.now()}`);
    await graph.create({
      edgeDefinitions: [
        {
          collection: "knows",
          from: ["person"],
          to: ["person"],
        },
      ],
    });
    collection = graph.vertexCollection("person");
  });
  after(async () => {
    try {
      c8Client.useFabric("_system");
      await c8Client.dropFabric(dbName);
    } finally {
      c8Client.close();
    }
  });
  beforeEach(done => {
    collection
      .truncate()
      .then(() => done())
      .catch(done);
  });
  describe("graphVertexCollection.vertex", () => {
    let data = { foo: "bar" };
    let meta: any;
    beforeEach(async () => {
      meta = await collection.save(data);
    });
    it("returns a vertex in the collection", async () => {
      const doc = await collection.vertex(meta.vertex._id);
      expect(doc).to.have.keys("_key", "_id", "_rev", "foo");
      expect(doc._id).to.equal(meta.vertex._id);
      expect(doc._key).to.equal(meta.vertex._key);
      expect(doc._rev).to.equal(meta.vertex._rev);
      expect(doc.foo).to.equal(data.foo);
    });
    it("does not throw on not found when graceful", async () => {
      const doc = await collection.vertex("doesnotexist", true);
      expect(doc).to.equal(null);
    });
  });
  describe("graphVertexCollection.document", () => {
    let data = { foo: "bar" };
    let meta: any;
    beforeEach(async () => {
      meta = await collection.save(data);
    });
    it("returns a vertex in the collection", async () => {
      const doc = await collection.document(meta.vertex._id);
      expect(doc).to.have.keys("_key", "_id", "_rev", "foo");
      expect(doc._id).to.equal(meta.vertex._id);
      expect(doc._key).to.equal(meta.vertex._key);
      expect(doc._rev).to.equal(meta.vertex._rev);
      expect(doc.foo).to.equal(data.foo);
    });
    it("does not throw on not found when graceful", async () => {
      const doc = await collection.document("doesnotexist", true);
      expect(doc).to.equal(null);
    });
  });
  describe("graphVertexCollection.save", () => {
    it("creates a vertex in the collection", done => {
      let data = { foo: "bar" };
      collection
        .save(data)
        .then(meta => {
          expect(meta).to.be.an("object");
          expect(meta.vertex)
            .to.have.property("_id")
            .that.is.a("string");
          expect(meta.vertex)
            .to.have.property("_rev")
            .that.is.a("string");
          expect(meta.vertex)
            .to.have.property("_key")
            .that.is.a("string");
          return collection.vertex(meta.vertex._id).then(doc => {
            expect(doc).to.have.keys("_key", "_id", "_rev", "foo");
            expect(doc._id).to.equal(meta.vertex._id);
            expect(doc._key).to.equal(meta.vertex._key);
            expect(doc._rev).to.equal(meta.vertex._rev);
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
          expect(meta.vertex)
            .to.have.property("_id")
            .that.is.a("string");
          expect(meta.vertex)
            .to.have.property("_rev")
            .that.is.a("string");
          expect(meta.vertex)
            .to.have.property("_key")
            .that.equals(data._key);
          return collection.vertex(meta.vertex._id).then(doc => {
            expect(doc).to.have.keys("_key", "_id", "_rev", "potato");
            expect(doc._id).to.equal(meta.vertex._id);
            expect(doc._rev).to.equal(meta.vertex._rev);
            expect(doc._key).to.equal(data._key);
            expect(doc.potato).to.equal(data.potato);
          });
        })
        .then(() => void done())
        .catch(done);
    });
  });
  describe("graphVertexCollection.replace", () => {
    it("replaces the given vertex", done => {
      let doc = { potato: "tomato" };
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.replace((doc as any).vertex, { sup: "dawg" });
        })
        .then(() => collection.vertex((doc as any).vertex._key))
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
  describe("graphVertexCollection.update", () => {
    it("updates the given vertex", done => {
      let doc = { potato: "tomato", empty: false };
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.update((doc as any).vertex, {
            sup: "dawg",
            empty: null,
          });
        })
        .then(() => collection.vertex((doc as any).vertex._key))
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
            (doc as any).vertex,
            { sup: "dawg", empty: null },
            { keepNull: false }
          );
        })
        .then(() => collection.vertex((doc as any).vertex._key))
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
  describe("graphVertexCollection.remove", () => {
    let key = `d${Date.now()}`;
    beforeEach(done => {
      collection
        .save({ _key: key })
        .then(() => void done())
        .catch(done);
    });
    it("deletes the given vertex", done => {
      collection
        .remove(key)
        .then(() => collection.vertex(key))
        .then(
          () => Promise.reject(new Error("Should not succeed")),
          () => void done()
        )
        .catch(done);
    });
  });
});
