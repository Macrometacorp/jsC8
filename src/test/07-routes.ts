import { expect } from "chai";
import { Fabric } from "../jsC8";
import { DocumentCollection } from "../collection";
import { Route } from "../route";
import { getDCListString } from "../util/helper";

describe("Arbitrary HTTP routes", () => {
  const fabric = new Fabric({
    url: process.env.TEST_C8_URL || "https://default.dev.macrometa.io",
    c8Version: Number(process.env.C8_VERSION || 30400)
  });
  describe("fabric.route", () => {
    it("returns a Route instance", () => {
      const route = fabric.route();
      expect(route).to.be.an.instanceof(Route);
    });
    it("creates a route for the given path", () => {
      const path = "/hi";
      const route = fabric.route(path);
      expect((route as any)._path).to.equal(path);
    });
    it("passes the given headers to the new route", () => {
      const route = fabric.route("/hello", { "x-magic": "awesome" });
      expect((route as any)._headers).to.have.property("x-magic", "awesome");
    });
  });
});

describe("Route API", function () {
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);

  const name = `testdb_${Date.now()}`;
  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

  let dcList: string;
  let collection: DocumentCollection;
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
    });

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);

    await fabric.createFabric(name, [{ username: 'root' }], { dcList: dcList });
    fabric.useFabric(name);
    collection = fabric.collection(`c_${Date.now()}`);
    await collection.create();
  });
  after(async () => {
    try {
      fabric.useFabric("_system");
      await fabric.dropFabric(name);
    } finally {
      fabric.close();
    }
  });
  beforeEach(async () => {
    await collection.truncate();
  });
  describe("route.route", () => {
    it("should concat path", () => {
      const route = fabric.route("/api").route("/version");
      expect(route).to.have.property("_path", "/api/version");
    });
  });
  describe("route.get", () => {
    it("should be executed using the route path", done => {
      fabric.route("/version")
        .get()
        .then(res => {
          expect(res).to.have.property("body");
          const body = res.body;
          expect(body).to.have.property("version");
          expect(body).to.have.property("server");
        })
        .then(() => done())
        .catch(done);
    });
    it("should concat path to route path", done => {
      fabric.route("")
        .get("/version")
        .then(res => {
          expect(res).to.have.property("body");
          const body = res.body;
          expect(body).to.have.property("version");
          expect(body).to.have.property("server");
        })
        .then(() => done())
        .catch(done);
    });
    it("should passes query parameters", done => {
      fabric.route("")
        .get("/version", { details: true })
        .then(res => {
          expect(res).to.have.property("body");
          const body = res.body;
          expect(body).to.have.property("version");
          expect(body).to.have.property("server");
          expect(body).to.have.property("details");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("route.post", () => {
    it("should passes body", done => {
      fabric.route(`/document/${collection.name}`)
        .post({ foo: "bar" })
        .then(res => {
          expect(res).to.have.property("body");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("_key");
          expect(res.body).to.have.property("_rev");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("route.put", () => {
    let documentHandle: String;
    beforeEach(done => {
      collection
        .save({ foo: "bar" })
        .then(doc => {
          documentHandle = doc._id;
          done();
        })
        .catch(done);
    });
    it("should passes body", done => {
      fabric.route(`/document/${documentHandle}`)
        .put({ hello: "world" })
        .then(res => {
          expect(res).to.have.property("body");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("_key");
          expect(res.body).to.have.property("_rev");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("route.patch", () => {
    let documentHandle: String;
    beforeEach(done => {
      collection
        .save({ foo: "bar" })
        .then(doc => {
          documentHandle = doc._id;
          done();
        })
        .catch(done);
    });
    it("should passes body", done => {
      fabric.route(`/document/${documentHandle}`)
        .patch({ hello: "world" })
        .then(res => {
          expect(res).to.have.property("body");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("_key");
          expect(res.body).to.have.property("_rev");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("route.delete", () => {
    let documentHandle: String;
    beforeEach(done => {
      collection
        .save({ foo: "bar" })
        .then(doc => {
          documentHandle = doc._id;
          done();
        })
        .catch(done);
    });
    it("should be executed using the route path", done => {
      fabric.route(`/document/${documentHandle}`)
        .delete()
        .then(res => {
          expect(res).to.have.property("body");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("_key");
          expect(res.body).to.have.property("_rev");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("route.head", () => {
    let documentHandle: String;
    beforeEach(done => {
      collection
        .save({ foo: "bar" })
        .then(doc => {
          documentHandle = doc._id;
          done();
        })
        .catch(done);
    });
    it("should be executed using the route path", done => {
      fabric.route(`/document/${documentHandle}`)
        .head()
        .then(res => {
          expect(res).to.have.property("statusCode", 200);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("route.request", () => {
    it("should be executed using the route path", done => {
      fabric.route("/version")
        .request("get")
        .then(res => {
          expect(res).to.have.property("body");
          const body = res.body;
          expect(body).to.have.property("version");
          expect(body).to.have.property("server");
        })
        .then(() => done())
        .catch(done);
    });
  });
});
