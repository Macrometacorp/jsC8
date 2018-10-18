import { expect } from "chai";
import { Database } from "../jsC8";
import { c8SearchView } from "../view";

const range = (n: number): number[] => Array.from(Array(n).keys());
const ARANGO_VERSION = Number(process.env.ARANGO_VERSION || 30400);
const describe34 = ARANGO_VERSION >= 30400 ? describe : describe.skip;

describe34("Accessing views", function() {
  // create database takes 11s in a standard cluster
  this.timeout(20000);

  let name = `testdb_${Date.now()}`;
  let db: Database;
  before(async () => {
    db = new Database({
      url: process.env.TEST_ARANGODB_URL || "http://localhost:8529",
      arangoVersion: Number(process.env.ARANGO_VERSION || 30400)
    });
    await db.createDatabase(name);
    db.useDatabase(name);
  });
  after(async () => {
    try {
      db.useDatabase("_system");
      await db.dropDatabase(name);
    } finally {
      db.close();
    }
  });
  describe("database.c8SearchView", () => {
    it("returns a c8SearchView instance for the view", () => {
      let name = "potato";
      let view = db.c8SearchView(name);
      expect(view).to.be.an.instanceof(c8SearchView);
      expect(view)
        .to.have.property("name")
        .that.equals(name);
    });
  });
  describe("database.listViews", () => {
    let viewNames = range(4).map(i => `v_${Date.now()}_${i}`);
    before(async () => {
      await Promise.all(
        viewNames.map(name => db.c8SearchView(name).create())
      );
    });
    after(async () => {
      await Promise.all(
        viewNames.map(name => db.c8SearchView(name).drop())
      );
    });
    it("fetches information about all views", async () => {
      const views = await db.listViews();
      expect(views.length).to.equal(viewNames.length);
      expect(views.map((c: any) => c.name).sort()).to.eql(viewNames);
    });
  });
  describe("database.views", () => {
    let c8SearchViewNames = range(4).map(i => `asv_${Date.now()}_${i}`);
    before(async () => {
      await Promise.all(
        c8SearchViewNames.map(name => db.c8SearchView(name).create())
      );
    });
    after(async () => {
      await Promise.all(
        c8SearchViewNames.map(name => db.c8SearchView(name).drop())
      );
    });
    it("creates c8SearchView instances", async () => {
      const views = await db.views();
      let c8SearchViews = views
        .filter((c: any) => c instanceof c8SearchView)
        .sort();
      expect(c8SearchViews.length).to.equal(c8SearchViewNames.length);
      expect(c8SearchViews.map((c: any) => c.name).sort()).to.eql(
        c8SearchViewNames
      );
    });
  });
});
