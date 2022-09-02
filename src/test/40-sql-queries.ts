import { expect } from "chai";
import { Fabric } from "../jsC8";
import { ArrayCursor } from "../cursor";
import { C8Error } from "../error";
import { getDCListString } from "../util/helper";
import { C8Client } from "../jsC8";
const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("Test Sql query functions", function() {
  let name = `testdb${Date.now()}`;
  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "https://test.macrometa.io";
  const collectionName = "products";
  let dcList: string;

  before(async () => {
    fabric = new Fabric({ url: testUrl, c8Version: Number(process.env.C8_VERSION || 30400) });

    await fabric.login("demo@macrometa.io", "demo");
    fabric.useTenant("demo");

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);

    await fabric.createFabric(name, ["root"], { dcList: dcList });
    fabric.useFabric(name);

    try {
      console.log(`Creating the collection ${collectionName}`);
      let collection = fabric.collection(collectionName);

      let collectionDetails = await collection.create();
      console.log("Collection " + collectionDetails.name + " created successfully");

      collection.save({ category_id: "0", name: "Kindle" }, true);
    } catch (e) {
      console.log("Collection creation did not succeed due to " + e);
    }
  });

  after(async () => {
    try {
      fabric.useFabric("_system");
      await fabric.dropFabric(name);
    } finally {
      fabric.close();
    }
  });

  describe("Sql query with query() function", () => {
    it("executes sql query with empty bindVars object", done => {
      fabric
        .query("SELECT * FROM products", {}, { isSQL: true })
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          expect(cursor["_result"]).is.not.empty;
          done();
        })
        .catch(done);
    });

    it("executes sql query with named bindVars", done => {
      fabric
        .query("SELECT * FROM products where name = $prodName", { prodName: "Kindle" }, { isSQL: true })
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          expect(cursor["_result"]).is.not.empty;
          expect(cursor["_result"][0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with array", done => {
      fabric
        .query("SELECT * FROM products where name = $1", ["Kindle"], { isSQL: true })
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          expect(cursor["_result"]).is.not.empty;
          expect(cursor["_result"][0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with empty array", done => {
      fabric
        .query("SELECT * FROM products", [], { isSQL: true })
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          expect(cursor["_result"]).is.not.empty;
          done();
        })
        .catch(done);
    });

    it("executes sql query with options", done => {
      fabric
        .query("SELECT * FROM products", [], { isSQL: true, count: true })
        .then(cursor => {
          expect(cursor).to.have.property("count");
          done();
        })
        .catch(done);
    });

    it("throws an exception on error", done => {
      fabric
        .query("SELECT * FROM fakeProducts", undefined, { isSQL: true })
        .then(() => {
          expect.fail();
          done();
        })
        .catch(err => {
          expect(err).is.instanceof(C8Error);
          expect(err).to.have.property("statusCode", 404);
          expect(err).to.have.property("errorNum", 1203);
          done();
        });
    });

    it("throws an exception on error (async await)", async () => {
      try {
        await fabric.query("SELECT * FROM fakeProducts", undefined, { isSQL: true });
        expect.fail();
      } catch (err) {
        expect(err).is.instanceof(C8Error);
        expect(err).to.have.property("statusCode", 404);
        expect(err).to.have.property("errorNum", 1203);
      }
    });
  });

  describe("Sql query with executeQuery() function", () => {
    let c8Client = new C8Client({ url: testUrl, c8Version: C8_VERSION });

    before(async () => {
      await c8Client.login("demo@macrometa.io", "demo");
      c8Client.useTenant("demo");
      c8Client.useFabric(name);
    });

    it("executes sql query with empty bindVars object", done => {
      c8Client
        .executeQuery("SELECT * FROM products", {}, { isSQL: true })
        .then(result => {
          expect(result).is.not.empty;
          expect(result[0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with named bindVars", done => {
      c8Client
        .executeQuery("SELECT * FROM products where name = $prodName", { prodName: "Kindle" }, { isSQL: true })
        .then(result => {
          expect(result).is.not.empty;
          expect(result[0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with array", done => {
      c8Client
        .executeQuery("SELECT * FROM products where name = $1", ["Kindle"], { isSQL: true })
        .then(result => {
          expect(result).is.not.empty;
          expect(result[0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with empty array", done => {
      c8Client
        .executeQuery("SELECT * FROM products", [], { isSQL: true })
        .then(result => {
          expect(result).is.not.empty;
          done();
        })
        .catch(done);
    });

    it("throws an exception on error", done => {
      c8Client
        .executeQuery("SELECT * FROM fakeProducts", undefined, { isSQL: true })
        .then(() => {
          expect.fail();
          done();
        })
        .catch(err => {
          expect(err).is.instanceof(C8Error);
          expect(err).to.have.property("statusCode", 404);
          expect(err).to.have.property("errorNum", 1203);
          done();
        });
    });

    it("throws an exception on error (async await)", async () => {
      try {
        await c8Client.executeQuery("SELECT * FROM fakeProducts", undefined, { isSQL: true });
        expect.fail();
      } catch (err) {
        expect(err).is.instanceof(C8Error);
        expect(err).to.have.property("statusCode", 404);
        expect(err).to.have.property("errorNum", 1203);
      }
    });
  });
});
