import { expect } from "chai";
import { ArrayCursor } from "../cursor";
import { C8Error } from "../error";
import { getDCListString } from "../util/helper";
import { C8Client } from "../jsC8";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("Test Sql query functions", function() {
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;
  let name = `testdb${Date.now()}`;

  const collectionName = "products";
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

    try {
      console.log(`Creating the collection ${collectionName}`);
      let collection = c8Client.collection(collectionName);

      let collectionDetails = await collection.create();
      console.log(
        "Collection " + collectionDetails.name + " created successfully"
      );

      collection.save({ category_id: "0", name: "Kindle" }, true);
    } catch (e) {
      console.error("Collection creation did not succeed due to " + e);
    }
  });

  after(async () => {
    try {
      c8Client.useFabric("_system");
      await c8Client.dropFabric(name);
    } finally {
      c8Client.close();
    }
  });

  describe("Sql query with query() function", () => {
    it("executes sql query with empty bindVars object", done => {
      c8Client
        .query("SELECT * FROM products", {}, { sql: true })
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          expect(cursor["_result"]).is.not.empty;
          done();
        })
        .catch(done);
    });

    it("executes sql query with named bindVars", done => {
      c8Client
        .query(
          "SELECT * FROM products where name = $1",
          { 1: "Kindle" },
          { sql: true }
        )
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          expect(cursor["_result"]).is.not.empty;
          expect(cursor["_result"][0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with array", done => {
      c8Client
        .query("SELECT * FROM products where name = $1", ["Kindle"], {
          sql: true,
        })
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          expect(cursor["_result"]).is.not.empty;
          expect(cursor["_result"][0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with empty array", done => {
      c8Client
        .query("SELECT * FROM products", [], { sql: true })
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          expect(cursor["_result"]).is.not.empty;
          done();
        })
        .catch(done);
    });

    it("executes sql query with options", done => {
      c8Client
        .query("SELECT * FROM products", [], { sql: true, count: true })
        .then(cursor => {
          expect(cursor).to.have.property("count");
          done();
        })
        .catch(done);
    });

    it("throws an exception on error", done => {
      c8Client
        .query("SELECT * FROM fakeProducts", undefined, { sql: true })
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
        await c8Client.query("SELECT * FROM fakeProducts", undefined, {
          sql: true,
        });
        expect.fail();
      } catch (err) {
        expect(err).is.instanceof(C8Error);
        expect(err).to.have.property("statusCode", 404);
        expect(err).to.have.property("errorNum", 1203);
      }
    });
  });

  describe("Sql query with executeQuery() function", () => {
    it("executes sql query with empty bindVars object", done => {
      c8Client
        .executeQuery("SELECT * FROM products", {}, { sql: true })
        .then(result => {
          expect(result).is.not.empty;
          expect(result[0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with named bindVars", done => {
      c8Client
        .executeQuery(
          "SELECT * FROM products where name = $1",
          { 1: "Kindle" },
          { sql: true }
        )
        .then(result => {
          expect(result).is.not.empty;
          expect(result[0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with array", done => {
      c8Client
        .executeQuery("SELECT * FROM products where name = $1", ["Kindle"], {
          sql: true,
        })
        .then(result => {
          expect(result).is.not.empty;
          expect(result[0]).includes({ name: "Kindle" });
          done();
        })
        .catch(done);
    });

    it("executes sql query with empty array", done => {
      c8Client
        .executeQuery("SELECT * FROM products", [], { sql: true })
        .then(result => {
          expect(result).is.not.empty;
          done();
        })
        .catch(done);
    });

    it("throws an exception on error", done => {
      c8Client
        .executeQuery("SELECT * FROM fakeProducts", undefined, { sql: true })
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
        await c8Client.executeQuery("SELECT * FROM fakeProducts", undefined, {
          sql: true,
        });
        expect.fail();
      } catch (err) {
        expect(err).is.instanceof(C8Error);
        expect(err).to.have.property("statusCode", 404);
        expect(err).to.have.property("errorNum", 1203);
      }
    });
  });
});
