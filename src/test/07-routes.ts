import { expect } from "chai";
import { C8Client } from "../jsC8";
import { DocumentCollection } from "../collection";
import { Route } from "../route";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);
dotenv.config();

describe("Arbitrary HTTP routes", function() {
  describe("fabric.route", () => {
    let c8Client: C8Client;
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
    it("returns a Route instance", () => {
      const route = c8Client.route();
      expect(route).to.be.an.instanceof(Route);
    });
    it("creates a route for the given path", () => {
      const path = "/hi";
      const route = c8Client.route(path);
      expect((route as any)._path).to.equal(path);
    });
    it("passes the given headers to the new route", () => {
      const route = c8Client.route("/hello", { "x-magic": "awesome" });
      expect((route as any)._headers).to.have.property("x-magic", "awesome");
    });
  });
  describe("Route API", function() {
    // create fabric takes 11s in a standard cluster
    this.timeout(60000);

    const name = `testdb${Date.now()}`;
    let c8Client: C8Client;
    let dcList: string;
    let collection: DocumentCollection;
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
      collection = c8Client.collection(`c${Date.now()}`);
      await collection.create();
    });
    after(async () => {
      try {
        c8Client.useFabric("_system");
        await c8Client.dropFabric(name);
      } finally {
        c8Client.close();
      }
    });
    beforeEach(async () => {
      await collection.truncate();
    });

    describe("route.route", () => {
      it("should concat path", () => {
        const route = c8Client.route("/api").route("/version");
        expect(route).to.have.property("_path", "/api/version");
      });
    });
    describe("route.get", () => {
      // it("should be executed using the route path", done => {
      //   fabric
      //     .route("/version")
      //     .get()
      //     .then(res => {
      //       expect(res).to.have.property("body");
      //       const body = res.body;
      //       expect(body).to.have.property("version");
      //       expect(body).to.have.property("server");
      //     })
      //     .then(() => done())
      //     .catch(done);
      // });
      // it("should concat path to route path", done => {
      //   fabric
      //     .route("")
      //     .get("/version")
      //     .then(res => {
      //       expect(res).to.have.property("body");
      //       const body = res.body;
      //       expect(body).to.have.property("version");
      //       expect(body).to.have.property("server");
      //     })
      //     .then(() => done())
      //     .catch(done);
      // });
      // it("should passes query parameters", done => {
      //   fabric
      //     .route("")
      //     .get("/version", { details: true })
      //     .then(res => {
      //       expect(res).to.have.property("body");
      //       const body = res.body;
      //       expect(body).to.have.property("version");
      //       expect(body).to.have.property("server");
      //       expect(body).to.have.property("details");
      //     })
      //     .then(() => done())
      //     .catch(done);
      // });
    });
    describe("route.post", () => {
      it("should passes body", done => {
        c8Client
          .route(`/document/${collection.name}`)
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
        c8Client
          .route(`/document/${documentHandle}`)
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
        c8Client
          .route(`/document/${documentHandle}`)
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
        c8Client
          .route(`/document/${documentHandle}`)
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
        c8Client
          .route(`/document/${documentHandle}`)
          .head()
          .then(res => {
            expect(res).to.have.property("statusCode", 200);
          })
          .then(() => done())
          .catch(done);
      });
    });
    describe("route.request", () => {
      // it("should be executed using the route path", done => {
      //   fabric
      //     .route("/version")
      //     .request("get")
      //     .then(res => {
      //       expect(res).to.have.property("body");
      //       const body = res.body;
      //       expect(body).to.have.property("version");
      //       expect(body).to.have.property("server");
      //     })
      //     .then(() => done())
      //     .catch(done);
      // });
    });
  });
});
