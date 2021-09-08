import { expect } from "chai";
import { Fabric } from "../jsC8";
import { EdgeCollection } from "../collection";
import { getDCListString } from "../util/helper";

describe("EdgeCollection API", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);

  let name = `testdb${Date.now()}`;
  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "https://test.macrometa.io";

  let dcList: string;
  let collection: EdgeCollection;
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
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
    collection = fabric.edgeCollection(`c${Date.now()}`);
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

  describe("edgeCollection.edge", () => {
    let data = { _from: "d/1", _to: "d/2" };
    let meta: any;
    beforeEach(async () => {
      meta = await collection.save(data);
    });
    it("returns an edge in the collection", async () => {
      const doc = await collection.edge(meta._id);
      expect(doc).to.have.keys("_key", "_id", "_rev", "_from", "_to");
      expect(doc._id).to.equal(meta._id);
      expect(doc._key).to.equal(meta._key);
      expect(doc._rev).to.equal(meta._rev);
      expect(doc._from).to.equal(data._from);
      expect(doc._to).to.equal(data._to);
    });
    it("does not throw on not found when graceful", async () => {
      const doc = await collection.edge("doesnotexist", true);
      expect(doc).to.equal(null);
    });
  });
  describe("edgeCollection.document", () => {
    let data = { _from: "d/1", _to: "d/2" };
    let meta: any;
    beforeEach(async () => {
      meta = await collection.save(data);
    });
    it("returns an edge in the collection", async () => {
      const doc = await collection.document(meta._id);
      expect(doc).to.have.keys("_key", "_id", "_rev", "_from", "_to");
      expect(doc._id).to.equal(meta._id);
      expect(doc._key).to.equal(meta._key);
      expect(doc._rev).to.equal(meta._rev);
      expect(doc._from).to.equal(data._from);
      expect(doc._to).to.equal(data._to);
    });
    it("does not throw on not found when graceful", async () => {
      const doc = await collection.document("doesnotexist", true);
      expect(doc).to.equal(null);
    });
  });
  describe("edgeCollection.documentExists", () => {
    let data = { _from: "d/1", _to: "d/2" };
    let meta: any;
    beforeEach(async () => {
      meta = await collection.save(data);
    });
    it("returns true if the edge exists", async () => {
      const exists = await collection.documentExists(meta._id);
      expect(exists).to.equal(true);
    });
    it("returns false if the edge does not exist", async () => {
      const exists = await collection.documentExists("doesnotexist");
      expect(exists).to.equal(false);
    });
  });
  describe("edgeCollection.save", () => {
    it("creates an edge in the collection", async () => {
      const data = { chicken: "chicken", _from: "d/1", _to: "d/2" };
      const meta = await collection.save(data);
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
      const doc = await collection.edge(meta._id);
      expect(doc).to.have.keys(
        "chicken",
        "_key",
        "_id",
        "_rev",
        "_from",
        "_to"
      );
      expect(doc._id).to.equal(meta._id);
      expect(doc._key).to.equal(meta._key);
      expect(doc._rev).to.equal(meta._rev);
      expect(doc._from).to.equal(data._from);
      expect(doc._to).to.equal(data._to);
      expect(doc.chicken).to.equal(data.chicken);
    });
    it("uses the given _key if provided", async () => {
      const data = {
        chicken: "chicken",
        _key: "banana",
        _from: "d/1",
        _to: "d/2"
      };
      const meta = await collection.save(data);
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
      const doc = await collection.edge(meta._id);
      expect(doc).to.have.keys(
        "chicken",
        "_key",
        "_id",
        "_rev",
        "_from",
        "_to"
      );
      expect(doc._id).to.equal(meta._id);
      expect(doc._rev).to.equal(meta._rev);
      expect(doc._key).to.equal(data._key);
      expect(doc._from).to.equal(data._from);
      expect(doc._to).to.equal(data._to);
      expect(doc.chicken).to.equal(data.chicken);
    });
    it("takes _from and _to as positional arguments", async () => {
      const data = { chicken: "chicken" };
      const from = "d/1";
      const to = "d/2";
      const meta = await collection.save(data, from, to);
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
      const doc = await collection.edge(meta._id);
      expect(doc).to.have.keys(
        "chicken",
        "_key",
        "_id",
        "_rev",
        "_from",
        "_to"
      );
      expect(doc.chicken).to.equal(data.chicken);
      expect(doc._id).to.equal(meta._id);
      expect(doc._key).to.equal(meta._key);
      expect(doc._rev).to.equal(meta._rev);
      expect(doc._from).to.equal(from);
      expect(doc._to).to.equal(to);
    });
    it("takes an options object", async () => {
      const data = { chicken: "chicken", _from: "d/1", _to: "d/2" };
      const meta = await collection.save(data, { returnNew: true });
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
      expect(meta)
        .to.have.property("new")
        .that.is.an("object");
      expect(meta.new).to.have.property("chicken", data.chicken);
      const doc = await collection.edge(meta._id);
      expect(doc).to.have.keys(
        "chicken",
        "_key",
        "_id",
        "_rev",
        "_from",
        "_to"
      );
      expect(doc.chicken).to.equal(data.chicken);
      expect(doc._id).to.equal(meta._id);
      expect(doc._key).to.equal(meta._key);
      expect(doc._rev).to.equal(meta._rev);
      expect(doc._from).to.equal(data._from);
      expect(doc._to).to.equal(data._to);
    });
    it("takes an options object with positional _from and _to", async () => {
      const data = { chicken: "chicken" };
      const from = "d/1";
      const to = "d/2";
      const meta = await collection.save(data, from, to, { returnNew: true });
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
      expect(meta)
        .to.have.property("new")
        .that.is.an("object");
      expect(meta.new).to.have.property("chicken", data.chicken);
      const doc = await collection.edge(meta._id);
      expect(doc).to.have.keys(
        "chicken",
        "_key",
        "_id",
        "_rev",
        "_from",
        "_to"
      );
      expect(doc.chicken).to.equal(data.chicken);
      expect(doc._id).to.equal(meta._id);
      expect(doc._key).to.equal(meta._key);
      expect(doc._rev).to.equal(meta._rev);
      expect(doc._from).to.equal(from);
      expect(doc._to).to.equal(to);
    });
  });
  describe("edgeCollection.traversal", () => {
    let knows: any;
    beforeEach(done => {
      knows = fabric.edgeCollection("knows");
      const person = fabric.collection("person");
      Promise.all([person.create(), knows.create()])
        .then(() =>
          Promise.all([
            person.import([
              { _key: "Alice" },
              { _key: "Bob" },
              { _key: "Charlie" },
              { _key: "Dave" },
              { _key: "Eve" }
            ]),
            knows.import([
              { _from: "person/Alice", _to: "person/Bob" },
              { _from: "person/Bob", _to: "person/Charlie" },
              { _from: "person/Bob", _to: "person/Dave" },
              { _from: "person/Eve", _to: "person/Alice" },
              { _from: "person/Eve", _to: "person/Bob" }
            ])
          ])
        )
        .then(() => done())
        .catch(done);
    });
    it("executes traversal", done => {
      knows
        .traversal("person/Alice", { direction: "outbound" })
        .then((result: any) => {
          expect(result).to.have.property("visited");
          const visited = result.visited;
          expect(visited).to.have.property("vertices");
          const vertices = visited.vertices;
          expect(vertices).to.be.instanceOf(Array);
          expect(vertices.length).to.equal(4);
          const names = vertices.map((d: any) => d._key);
          for (const name of ["Alice", "Bob", "Charlie", "Dave"]) {
            expect(names).to.contain(name);
          }
          expect(visited).to.have.property("paths");
          const paths = visited.paths;
          expect(paths).to.be.instanceOf(Array);
          expect(paths.length).to.equal(4);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("edgeCollection.replace", () => {
    it("replaces the given edge", done => {
      const doc = { potato: "tomato", _from: "d/1", _to: "d/2" };
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.replace(doc as any, {
            sup: "dawg",
            _from: "d/1",
            _to: "d/2"
          });
        })
        .then(() => collection.edge((doc as any)._key))
        .then(data => {
          expect(data).not.to.have.property("potato");
          expect(data).to.have.property("sup", "dawg");
          done();
        })
        .catch(done);
    });
  });
  describe("edgeCollection.update", () => {
    it("updates the given document", done => {
      let doc = { potato: "tomato", empty: false, _from: "d/1", _to: "d/2" };
      collection
        .save(doc)
        .then(meta => {
          delete meta.error;
          Object.assign(doc, meta);
          return collection.update(doc as any, { sup: "dawg", empty: null });
        })
        .then(() => collection.edge((doc as any)._key))
        .then(data => {
          expect(data).to.have.property("potato", doc.potato);
          expect(data).to.have.property("sup", "dawg");
          expect(data).to.have.property("empty", null);
          done();
        })
        .catch(done);
    });
    it("removes null values if keepNull is explicitly set to false", done => {
      let doc = { potato: "tomato", empty: false, _from: "d/1", _to: "d/2" };
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
        .then(() => collection.edge((doc as any)._key))
        .then(data => {
          expect(data).to.have.property("potato", doc.potato);
          expect(data).to.have.property("sup", "dawg");
          expect(data).not.to.have.property("empty");
          done();
        })
        .catch(done);
    });
  });
  describe("edgeCollection.remove", () => {
    let key = `d_${Date.now()}`;
    beforeEach(done => {
      collection
        .save({ _key: key, _from: "d/1", _to: "d/2" })
        .then(() => void done())
        .catch(done);
    });
    it("deletes the given edge", done => {
      collection
        .remove(key)
        .then(() => collection.edge(key))
        .then(
          () => Promise.reject(new Error("Should not succeed")),
          () => void done()
        )
        .catch(done);
    });
  });
});
