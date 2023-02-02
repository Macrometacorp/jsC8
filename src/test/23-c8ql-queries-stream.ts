import { expect } from "chai";
import { c8ql } from "../jsC8";
import { C8Client } from "../jsC8";
import { getDCListString } from "../util/helper";
import { ArrayCursor } from "../cursor";
import * as dotenv from "dotenv";

describe("C8QL Stream queries", function() {
  // create fabric takes 11s in a standard cluster and sometimes even more
  dotenv.config();
  this.timeout(1000000);
  let c8Client: C8Client;
  let name = `testdb${Date.now()}`;
  let dcList: string;
  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
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
  describe("c8Client.query", () => {
    it("returns a cursor for the query result", done => {
      c8Client
        .query("RETURN 23", {}, { options: { stream: true } })
        .then(cursor => {
          expect(cursor).to.be.an.instanceof(ArrayCursor);
          done();
        })
        .catch(done);
    });
    it("supports bindVars", done => {
      c8Client
        .query("RETURN @x", { x: 5 }, { options: { stream: true } })
        .then(cursor => cursor.next())
        .then(value => {
          expect(value).to.equal(5);
          done();
        })
        .catch(done);
    });
    it("supports options", done => {
      c8Client
        .query(
          "FOR x IN 1..10 RETURN x",
          {},
          {
            batchSize: 2,
            count: true,
          }
        )
        .then(cursor => {
          let count = cursor.count;
          expect(count).to.equal(10);
          expect((cursor as any)._hasMore).to.equal(true);
          done();
        })
        .catch(done);
    });
    it("supports compact queries with options", done => {
      let query: any = {
        query: "FOR x IN RANGE(1, @max) RETURN x",
        bindVars: { max: 10 },
      };
      c8Client
        .query(query, { batchSize: 2, count: true })
        .then(cursor => {
          expect(cursor.count).to.equal(10);
          expect((cursor as any)._hasMore).to.equal(true);
          done();
        })
        .catch(done);
    });
  });
  describe.skip("with some data", () => {
    let cname = "MyTestCollection";
    before(done => {
      let collection = c8Client.collection(cname);
      collection
        .create()
        .then(() => {
          return Promise.all(
            Array.apply(null, { length: 1000 } as Array<Number>)
              .map(Number.call, Number)
              .map((i: any) => collection.save({ hallo: i }))
          );
        })
        .then(() => void done())
        .catch(done);
    });
    after(done => {
      c8Client
        .collection(cname)
        .drop()
        .then(() => done())
        .catch(done);
    });
    it("can access large collection in parallel", done => {
      let collection = c8Client.collection(cname);
      let query = c8ql`FOR doc in ${collection} RETURN doc`;
      const opts = { batchSize: 250, options: { stream: true } };

      let count = 0;
      Promise.all(
        Array.apply(null, { length: 25 } as any).map(() =>
          c8Client.query(query, opts)
        )
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
      let collection = c8Client.collection(cname);
      let readQ = c8ql`FOR doc in ${collection} RETURN doc`;
      let writeQ = c8ql`FOR i in 1..1000 LET y = SLEEP(1) INSERT {forbidden: i} INTO ${collection}`;
      const opts = { batchSize: 500, ttl: 5, options: { stream: true } };
      // 900s lock timeout + 5s ttl
      let readCursor = c8Client.query(readQ, opts);
      let writeCursor = c8Client.query(writeQ, opts);
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
