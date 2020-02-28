import { expect } from "chai";
import { Fabric } from "../jsC8";
import { ArrayCursor } from "../cursor";

const c8qlQuery = "FOR i In 0..10 RETURN i";
const c8qlResult = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function sleep(ms: number) {
  var date = Date.now();
  var curDate = null;
  do {
    curDate = Date.now();
  } while (curDate - date < ms);
}

describe("Cursor API", () => {
  let fabric: Fabric;
  let cursor: ArrayCursor;
  before(async () => {
    fabric = new Fabric({
      url: process.env.TEST_C8_URL || "https://test.macrometa.io",
      c8Version: Number(process.env.C8_VERSION || 30400)
    });
    await fabric.login("guest@macrometa.io", "guest");
    fabric.useTenant("guest");
  });
  after(() => {
    fabric.close();
  });
  beforeEach(async () => {
    cursor = await fabric.query(c8qlQuery);
  });
  describe("cursor.all", () => {
    it("returns an Array of all results", done => {
      cursor
        .all()
        .then(vals => {
          expect(vals).to.eql(c8qlResult);
          done();
        })
        .catch(done);
    });
  });
  describe("cursor.next", () => {
    it("returns the next result of the Cursor", done => {
      cursor
        .next()
        .then(val => {
          expect(val).to.equal(0);
          return cursor.next();
        })
        .then(val => {
          expect(val).to.equal(1);
          done();
        })
        .catch(done);
    });
  });
  describe("cursor.hasNext", () => {
    it("returns true if the Cursor has more results", done => {
      expect(cursor.hasNext()).to.equal(true);
      cursor
        .next()
        .then(val => {
          expect(val).to.be.a("number");
          done();
        })
        .catch(done);
    });
    it("returns false if the Cursor is empty", done => {
      cursor
        .all()
        .then(() => {
          expect(cursor.hasNext()).to.equal(false);
          done();
        })
        .catch(done);
    });
    it("returns true after first batch is consumed", done => {
      fabric
        .query(c8qlQuery, {}, { batchSize: 1 })
        .then(cursor => {
          expect((cursor as any)._result.length).to.equal(1);
          cursor.next();
          expect((cursor as any)._result.length).to.equal(0);
          expect(cursor.hasNext()).to.equal(true);
          done();
        })
        .catch(done);
    });
    it("returns false after last batch is consumed", done => {
      fabric
        .query("FOR i In 0..1 RETURN i", {}, { batchSize: 1 })
        .then(cursor => {
          expect(cursor.hasNext()).to.equal(true);
          expect((cursor as any)._result.length).to.equal(1);
          cursor
            .next()
            .then(val => {
              expect(val).to.equal(0);
              expect(cursor.hasNext()).to.equal(true);
              expect((cursor as any)._result.length).to.equal(0);
              return cursor.next();
            })
            .then(val => {
              expect(val).to.equal(1);
              expect(cursor.hasNext()).to.equal(false);
              expect((cursor as any)._result.length).to.equal(0);
              done();
            });
        })
        .catch(done);
    });
    it("returns false after last result is consumed", done => {
      fabric
        .query("FOR i In 0..1 RETURN i")
        .then(cursor => {
          expect(cursor.hasNext()).to.equal(true);
          expect((cursor as any)._result.length).to.equal(2);
          cursor
            .next()
            .then(val => {
              expect(val).to.equal(0);
              expect(cursor.hasNext()).to.equal(true);
              expect((cursor as any)._result.length).to.equal(1);
              return cursor.next();
            })
            .then(val => {
              expect(val).to.equal(1);
              expect(cursor.hasNext()).to.equal(false);
              expect((cursor as any)._result.length).to.equal(0);
              done();
            });
        })
        .catch(done);
    });
    it.skip("returns 404 after timeout", done => {
      fabric
        .query("FOR i In 0..1 RETURN i", {}, { batchSize: 1, ttl: 1 })
        .then(cursor => {
          expect(cursor.hasNext()).to.equal(true);
          expect((cursor as any)._result.length).to.equal(1);
          cursor
            .next()
            .then(val => {
              expect(val).to.equal(0);
              expect(cursor.hasNext()).to.equal(true);
              expect((cursor as any)._result.length).to.equal(0);
              sleep(3000);
              return cursor.next();
            })
            .catch(err => {
              expect(err.code).to.equal(404);
              done();
            });
        })
        .catch(done);
    });
    it.skip("returns false after last result is consumed (with large amount of results)", done => {
      const EXPECTED_LENGTH = 100000;
      const loadMore = function(cursor: any, totalLength: any) {
        cursor
          .next()
          .then(() => {
            totalLength++;
            expect(cursor.hasNext()).to.equal(totalLength !== EXPECTED_LENGTH);
            if (cursor.hasNext()) {
              loadMore(cursor, totalLength);
            } else {
              done();
            }
          })
          .catch(done);
      };
      fabric
        .query(`FOR i In 1..${EXPECTED_LENGTH} RETURN i`)
        .then(cursor => loadMore(cursor, 0))
        .catch(done);
    });
  });
  describe("cursor.each", () => {
    it("invokes the callback for each value", done => {
      let results: any[] = [];
      cursor
        .each(value => {
          results.push(value);
        })
        .then(() => {
          expect(results).to.eql(c8qlResult);
          done();
        })
        .catch(done);
    });
    it("aborts if the callback returns false", done => {
      let results: any[] = [];
      cursor
        .each((value: any) => {
          results.push(value);
          if (value === 5) return false;
          return;
        })
        .then(() => {
          expect(results).to.eql([0, 1, 2, 3, 4, 5]);
          done();
        })
        .catch(done);
    });
  });
  describe("cursor.every", () => {
    it("returns true if the callback returns a truthy value for every item", done => {
      let results: any[] = [];
      cursor
        .every(value => {
          if (results.indexOf(value) !== -1) return false;
          results.push(value);
          return true;
        })
        .then(result => {
          expect(results).to.eql(c8qlResult);
          expect(result).to.equal(true);
          done();
        })
        .catch(done);
    });
    it("returns false if the callback returns a non-truthy value for any item", done => {
      let results: any[] = [];
      cursor
        .every(value => {
          results.push(value);
          return value < 5;
        })
        .then((result: any) => {
          expect(results).to.eql([0, 1, 2, 3, 4, 5]);
          expect(result).to.equal(false);
          done();
        })
        .catch(done);
    });
  });
  describe("cursor.some", () => {
    it("returns false if the callback returns a non-truthy value for every item", done => {
      let results: any[] = [];
      cursor
        .some(value => {
          if (results.indexOf(value) !== -1) return true;
          results.push(value);
          return false;
        })
        .then(result => {
          expect(results).to.eql(c8qlResult);
          expect(result).to.equal(false);
          done();
        })
        .catch(done);
    });
    it("returns true if the callback returns a truthy value for any item", done => {
      let results: any[] = [];
      cursor
        .some(value => {
          results.push(value);
          return value >= 5;
        })
        .then((result: any) => {
          expect(results).to.eql([0, 1, 2, 3, 4, 5]);
          expect(result).to.equal(true);
          done();
        })
        .catch(done);
    });
  });
  describe("cursor.map", () => {
    it("maps all result values over the callback", done => {
      cursor
        .map(value => value * 2)
        .then(results => {
          expect(results).to.eql(c8qlResult.map(value => value * 2));
          done();
        })
        .catch(done);
    });
  });
  describe("cursor.reduce", () => {
    it("reduces the result values with the callback", done => {
      cursor
        .reduce((a, b) => a + b)
        .then(result => {
          expect(result).to.eql(c8qlResult.reduce((a, b) => a + b));
          done();
        })
        .catch(done);
    });
  });
  describe("cursor.delete", () => {
    it("should delete the cursor");
  });
});
