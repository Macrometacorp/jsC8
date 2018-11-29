import { expect } from "chai";
import { Fabric } from "../jsC8";
import { DocumentCollection } from "../collection";
import { getDCListString } from "../util/helper";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("Manipulating collections", function () {
  // create fabric takes 11s in a standard cluster
  this.timeout(50000);

  let name = `testfabric_${Date.now()}`;
  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

  let dcList: string;
  let collection: DocumentCollection;
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: C8_VERSION
    });

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);

    await fabric.createFabric(name, [{ username: 'root' }], { dcList: dcList, realTime: false });
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
    collection = fabric.collection(`collection-${Date.now()}`);
    collection
      .create()
      .then(() => void done())
      .catch(done);
  });
  afterEach(done => {
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
    it("creates a new document collection", done => {
      const collection = fabric.collection(`document-collection-${Date.now()}`);
      collection
        .create()
        .then(() => {
          return fabric
            .collection(collection.name)
            .get()
            .then(info => {
              expect(info).to.have.property("name", collection.name);
              expect(info).to.have.property("isSystem", false);
              expect(info).to.have.property("status", 3); // loaded
              expect(info).to.have.property("type", 2); // document collection
            });
        })
        .then(() => void done())
        .catch(done);
    });
    it("creates a new edge collection", done => {
      const collection = fabric.edgeCollection(`edge-collection-${Date.now()}`);
      collection
        .create()
        .then(() => {
          return fabric
            .collection(collection.name)
            .get()
            .then(info => {
              expect(info).to.have.property("name", collection.name);
              expect(info).to.have.property("isSystem", false);
              expect(info).to.have.property("status", 3); // loaded
              expect(info).to.have.property("type", 3); // edge collection
            });
        })
        .then(() => void done())
        .catch(done);
    });
  });
  describe("collection.load", () => {
    it("should load a collection", done => {
      collection
        .load()
        .then(info => {
          expect(info).to.have.property("name", collection.name);
          expect(info).to.have.property("status", 3); // loaded
        })
        .then(() => void done())
        .catch(done);
    });
  });
  describe("collection.unload", () => {
    it("should unload a collection", done => {
      collection
        .unload()
        .then(info => {
          expect(info).to.have.property("name", collection.name);
          expect(info).to.have.property("status");
          expect(info.status === 2 || info.status === 4).to.be.true; // unloaded
        })
        .then(() => void done())
        .catch(done);
    });
  });
  describe("collection.setProperties", () => {
    it("should change properties", done => {
      collection
        .setProperties({ waitForSync: true })
        .then(info => {
          expect(info).to.have.property("name", collection.name);
          expect(info).to.have.property("waitForSync", true);
        })
        .then(() => void done())
        .catch(done);
    });
  });
  describe("collection.rename", () => {
    it("should rename a collection", done => {
      fabric.route("/_admin/server/role")
        .get()
        .then(res => {
          if (res.body.role !== "SINGLE") return;
          const name = `rename-collection-${Date.now()}`;
          return collection.rename(name).then(info => {
            expect(info).to.have.property("name", name);
          });
        })
        .then(() => void done())
        .catch(done);
    });
  });
  describe("collection.truncate", () => {
    it("should truncate a non-empty collection", done => {
      collection.save({}).then(() => {
        return collection
          .truncate()
          .then(() => {
            collection.count().then(info => {
              expect(info).to.have.property("name", collection.name);
              expect(info).to.have.property("count", 0);
            });
          })
          .then(() => void done())
          .catch(done);
      });
    });
    it("should allow truncating a empty collection", done => {
      collection.truncate().then(() => {
        return collection
          .count()
          .then(info => {
            expect(info).to.have.property("name", collection.name);
            expect(info).to.have.property("count", 0);
          })
          .then(() => void done())
          .catch(done);
      });
    });
  });
  describe("collection.drop", () => {
    it("should drop a collection", done => {
      collection.drop().then(() => {
        return collection
          .get()
          .then(done)
          .catch(err => {
            expect(err).to.have.property("errorNum", 1203);
            void done();
          });
      });
    });
  });
  describe("collection.onChange", () => {
    it("should get the message on collection change", (done) => {
      const callbackObj = {
        onopen: () => {
          collection.save({ name: "Anthony", lastname: "Gonsalvis" });
        },
        onmessage: (msg: string) => {
          console.log("msg=>", msg);
          done();
        },
        onerror: (err: any) => {
          console.log("Connection Error->", err);
          expect.fail("Websocket connection error");
        },
        onclose: () => console.log("Websoket connection closed")
      }
      collection.onChange(callbackObj, testUrl.substring(8));
    });
  })
});
