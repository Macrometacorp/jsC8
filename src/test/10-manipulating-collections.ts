import { expect } from "chai";
import { C8Client } from "../jsC8";
import { DocumentCollection } from "../collection";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("Manipulating collections", async function () {
  // create fabric takes 11s in a standard cluster
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;

  let name = `testfabric${Date.now()}`;

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
  });
  after(async () => {
    try {
      c8Client.useFabric("_system");
      await c8Client.dropFabric(name);
    } finally {
      c8Client.close();
    }
  });
  beforeEach((done) => {
    collection = c8Client.collection(`collection${Date.now()}`);
    collection
      .create()
      .then(() => void done())
      .catch(done);
  });
  afterEach((done) => {
    collection
      .get()
      .then(() => {
        collection
          .drop()
          .then(() => void done())
          .catch(done);
      })
      .catch(() => void done());
  });
  describe("collection.create", () => {
    it("creates a new document collection", (done) => {
      const collection = c8Client.collection(`documentcollection${Date.now()}`);
      collection
        .create()
        .then(() => {
          return c8Client
            .collection(collection.name)
            .get()
            .then((info) => {
              expect(info).to.have.property("name", collection.name);
              expect(info).to.have.property("isSystem", false);
              expect(info).to.have.property("status", 3); // loaded
              expect(info).to.have.property("type", 2); // document collection
            });
        })
        .then(() => void done())
        .catch(done);
    });
    it("creates a new local document collection", (done) => {
      const collection = c8Client.collection(`documentcollection${Date.now()}`);
      collection
        .create({ isLocal: true })
        .then(() => {
          return c8Client
            .collection(collection.name)
            .get()
            .then((info) => {
              expect(info).to.have.property("name", collection.name);
              expect(info).to.have.property("isSystem", false);
              expect(info).to.have.property("status", 3); // loaded
              expect(info).to.have.property("type", 2); // document collection
              expect(info).to.have.property("isLocal", true); // local geo-distribution
            });
        })
        .then(() => void done())
        .catch(done);
    });
    it("creates a new edge collection", (done) => {
      const collection = c8Client.edgeCollection(`edgecollection${Date.now()}`);
      collection
        .create()
        .then(() => {
          return c8Client
            .collection(collection.name)
            .get()
            .then((info) => {
              expect(info).to.have.property("name", collection.name);
              expect(info).to.have.property("isSystem", false);
              expect(info).to.have.property("status", 3); // loaded
              expect(info).to.have.property("type", 3); // edge collection
            });
        })
        .then(() => void done())
        .catch(done);
    });
    it("creates a new local edge collection", (done) => {
      const collection = c8Client.edgeCollection(`edgecollection${Date.now()}`);
      collection
        .create({ isLocal: true })
        .then(() => {
          return c8Client
            .collection(collection.name)
            .get()
            .then((info) => {
              expect(info).to.have.property("name", collection.name);
              expect(info).to.have.property("isSystem", false);
              expect(info).to.have.property("status", 3); // loaded
              expect(info).to.have.property("type", 3); // edge collection
              expect(info).to.have.property("isLocal", true); // local geo-distribution
            });
        })
        .then(() => void done())
        .catch(done);
    });
  });
  describe("collection.truncate", () => {
    it("should truncate a non-empty collection", (done) => {
      collection.save({}).then(() => {
        return collection
          .truncate()
          .then(() => {
            collection.count().then((info) => {
              expect(info).to.have.property("name", collection.name);
              expect(info).to.have.property("count", 0);
            });
          })
          .then(() => void done())
          .catch(done);
      });
    });
    it("should allow truncating a empty collection", (done) => {
      collection.truncate().then(() => {
        return collection
          .count()
          .then((info) => {
            expect(info).to.have.property("name", collection.name);
            expect(info).to.have.property("count", 0);
          })
          .then(() => void done())
          .catch(done);
      });
    });
  });
  describe("collection.drop", () => {
    it("should drop a collection", (done) => {
      collection.drop().then(() => {
        return collection
          .get()
          .then(done)
          .catch((err) => {
            expect(err).to.have.property("errorNum", 1203);
            void done();
          });
      });
    });
  });
  describe("collection.onChange", () => {
    let handler: any;
    let streamCollection: DocumentCollection;

    this.beforeAll(async () => {
      if (process.env.URL) {
        streamCollection = c8Client.collection("testRealTime");
        await streamCollection.create({ stream: true });

        handler = await streamCollection.onChange(
          process.env.URL.substring(8).slice(0, -1)
        );
      }
    });
    this.afterAll(() => {
      if (handler) handler.close();
    });

    it("should get the message on collection change", function (done) {
      if (process.env.URL) {
        handler.on("message", (msg: any) => {
          console.log("msg=> %s", JSON.stringify(msg));
          done();
        });

        streamCollection.save({ name: "John", lastname: "Doe" });

        handler.on("error", (err: any) => {
          console.log("Connection Error->", err);
        });

        handler.on("close", () => console.log("Websocket connection closed"));
      } else {
        done();
      }
    });
  });
});
