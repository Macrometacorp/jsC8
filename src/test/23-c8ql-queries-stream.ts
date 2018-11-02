import { expect } from "chai";
import { c8ql, Fabric } from "../jsC8";
import { ArrayCursor } from "../cursor";
import { getDCListString } from "../util/helper";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);
const describe34 = C8_VERSION >= 30400 ? describe : describe.skip;

describe34("C8QL Stream queries", function () {
  // create fabric takes 11s in a standard cluster and sometimes even more
  this.timeout(60000);

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
      fabric.query("RETURN 23", {}, { options: { stream: true } })
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          done();
        })
        .catch(done);
    });
    it("supports bindVars", done => {
      fabric.query("RETURN @x", { x: 5 }, { options: { stream: true } })
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
        count: true,
        options: { stream: true }
      })
        .then(cursor => {
          expect(cursor.count).to.equal(10);
          expect((cursor as any)._hasMore).to.equal(true);
          done();
        })
        .catch(done);
    });
    it("supports compact queries with options", done => {
      let query: any = {
        query: "FOR x IN RANGE(1, @max) RETURN x",
        bindVars: { max: 10 }
      };
      fabric.query(query, { batchSize: 2, count: true, options: { stream: true } })
        .then(cursor => {
          expect(cursor.count).to.equal(10);
          expect((cursor as any)._hasMore).to.equal(true);
          done();
        })
        .catch(done);
    });
  });
  describe("with some data", () => {
    let cname = "MyTestCollection";
    before(done => {
      let collection = fabric.collection(cname);
      collection
        .create()
        .then(() => {
          return Promise.all(
            Array.apply(null, { length: 1000 })
              .map(Number.call, Number)
              .map((i: Number) => collection.save({ hallo: i }))
          );
        })
        .then(() => void done())
        .catch(done);
    });
    /*after(done => {
      fabric.collection(cname).drop().then(() => done()).catch(done);
    });*/
    it("can access large collection in parallel", done => {
      let collection = fabric.collection(cname);
      let query = c8ql`FOR doc in ${collection} RETURN doc`;
      const opts = { batchSize: 250, options: { stream: true } };

      let count = 0;
      Promise.all(
        Array.apply(null, { length: 25 }).map(() => fabric.query(query, opts))
      )
        .then(cursors => {
          return Promise.all(
            cursors.map(c =>
              (c as ArrayCursor).each(() => {
                count++;
              })
            )
          );
        })
        .then(() => {
          expect(count).to.equal(25 * 1000);
          done();
        })
        .catch(done);
    });
    it("can do writes and reads", done => {
      let collection = fabric.collection(cname);
      let readQ = c8ql`FOR doc in ${collection} RETURN doc`;
      let writeQ = c8ql`FOR i in 1..1000 LET y = SLEEP(1) INSERT {forbidden: i} INTO ${collection}`;
      const opts = { batchSize: 500, ttl: 5, options: { stream: true } };

      // 900s lock timeout + 5s ttl
      let readCursor = fabric.query(readQ, opts);
      let writeCursor = fabric.query(writeQ, opts);

      // the read cursor should always win
      Promise.race([readCursor, writeCursor])
        .then(c => {
          // therefore no document should have been written here
          return c.every((d: any) => !d.hasOwnProperty("forbidden"));
        })
        .then(isOk => {
          expect(isOk).to.equal(true);
          done();
        })
        .catch(done);
    });
  });
});
