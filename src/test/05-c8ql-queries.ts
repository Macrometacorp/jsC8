import { expect } from "chai";
import { c8ql, Fabric } from "../jsC8";
import { ArrayCursor } from "../cursor";
import { C8Error } from "../error";
import { getDCListString } from "../util/helper";

describe("C8QL queries", function () {
  // create fabric takes 11s in a standard cluster
  this.timeout(20000);

  let name = `testdb_${Date.now()}`;
  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "http://localhost:8529";

  let dcList: string;
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
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
  describe("fabric.query", () => {
    it("returns a cursor for the query result", done => {
      fabric.query("RETURN 23")
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          done();
        })
        .catch(done);
    });
    it("throws an exception on error", done => {
      fabric.query("FOR i IN no RETURN i")
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
        await fabric.query("FOR i IN no RETURN i");
        expect.fail();
      } catch (err) {
        expect(err).is.instanceof(C8Error);
        expect(err).to.have.property("statusCode", 404);
        expect(err).to.have.property("errorNum", 1203);
      }
    });
    it("supports bindVars", done => {
      fabric.query("RETURN @x", { x: 5 })
        .then(cursor => cursor.next())
        .then(value => {
          expect(value).to.equal(5);
          done();
        })
        .catch(done);
    });
    it("supports options", done => {
      fabric.query("FOR x IN 1..10 RETURN x", undefined, {
        batchSize: 2,
        count: true
      })
        .then(cursor => {
          expect(cursor.count).to.equal(10);
          expect((cursor as any)._hasMore).to.equal(true);
          done();
        })
        .catch(done);
    });
    it("supports AQB queries", done => {
      fabric.query({ toC8QL: () => "RETURN 42" })
        .then(cursor => cursor.next())
        .then(value => {
          expect(value).to.equal(42);
          done();
        })
        .catch(done);
    });
    it("supports query objects", done => {
      fabric.query({ query: "RETURN 1337", bindVars: {} })
        .then(cursor => cursor.next())
        .then(value => {
          expect(value).to.equal(1337);
          done();
        })
        .catch(done);
    });
    it("supports compact queries", done => {
      fabric.query({ query: "RETURN @potato", bindVars: { potato: "tomato" } })
        .then(cursor => cursor.next())
        .then(value => {
          expect(value).to.equal("tomato");
          done();
        })
        .catch(done);
    });
    it("supports compact queries with options", done => {
      let query: any = {
        query: "FOR x IN RANGE(1, @max) RETURN x",
        bindVars: { max: 10 }
      };
      fabric.query(query, { batchSize: 2, count: true })
        .then(cursor => {
          expect(cursor.count).to.equal(10);
          expect((cursor as any)._hasMore).to.equal(true);
          done();
        })
        .catch(done);
    });
  });
  describe("c8ql", () => {
    it("correctly handles simple parameters", () => {
      let values: any[] = [
        0,
        42,
        -1,
        null,
        undefined,
        true,
        false,
        "",
        "string",
        [1, 2, 3],
        { a: "b" }
      ];
      let query = c8ql`
        A ${values[0]} B ${values[1]} C ${values[2]} D ${values[3]} E ${
        values[4]
        } F ${values[5]}
        G ${values[6]} H ${values[7]} I ${values[8]} J ${values[9]} K ${
        values[10]
        } EOF
      `;
      expect(query.query).to.equal(`
        A @value0 B @value1 C @value2 D @value3 E @value4 F @value5
        G @value6 H @value7 I @value8 J @value9 K @value10 EOF
      `);
      let bindVarNames = Object.keys(query.bindVars).sort(
        (a, b) => (+a.substr(5) > +b.substr(5) ? 1 : -1)
      );
      expect(bindVarNames).to.eql([
        "value0",
        "value1",
        "value2",
        "value3",
        "value4",
        "value5",
        "value6",
        "value7",
        "value8",
        "value9",
        "value10"
      ]);
      expect(bindVarNames.map(k => query.bindVars[k])).to.eql(values);
    });
    it("correctly handles jsC8 collection parameters", () => {
      let collection = fabric.collection("potato");
      let query = c8ql`${collection}`;
      expect(query.query).to.equal("@@value0");
      expect(Object.keys(query.bindVars)).to.eql(["@value0"]);
      expect(query.bindVars["@value0"]).to.equal("potato");
    });
    it("correctly handles C8 collection parameters", () => {
      class C8Collection {
        isC8Collection = true;
        name = "tomato";
      }
      let collection = new C8Collection();
      let query = c8ql`${collection as any}`;
      expect(query.query).to.equal("@@value0");
      expect(Object.keys(query.bindVars)).to.eql(["@value0"]);
      expect(query.bindVars["@value0"]).to.equal("tomato");
    });
  });
});
