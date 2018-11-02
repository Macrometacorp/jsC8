import { expect } from "chai";
import { Fabric } from "../jsC8";
import { getDCListString } from "../util/helper";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);
const it34 = C8_VERSION >= 30400 ? it : it.skip;

describe("Managing functions", function () {
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
  describe("fabric.listFunctions", () => {
    it34("should be empty per default", done => {
      fabric.listFunctions()
        .then(info => {
          expect(info).to.be.instanceof(Array);
        })
        .then(() => done())
        .catch(done);
    });
    it34("should include before created function", done => {
      const name = "myfunctions::temperature::celsiustofahrenheit";
      const code = "function (celsius) { return celsius * 1.8 + 32; }";
      fabric.createFunction(name, code)
        .then(() => {
          return fabric.listFunctions().then(info => {
            expect(info).to.be.instanceof(Array);
            expect(info.length).to.equal(1);
            expect(info[0]).to.eql({
              name,
              code
            });
          });
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("fabric.createFunction", () => {
    it("should create a function", done => {
      fabric.createFunction(
        "myfunctions::temperature::celsiustofahrenheit2",
        "function (celsius) { return celsius * 1.8 + 32; }"
      )
        .then(info => {
          expect(info).to.have.property("code", 201);
          expect(info).to.have.property("error", false);
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("fabric.dropFunction", () => {
    const name = "myfunctions::temperature::celsiustofahrenheit";
    before(async () => {
      fabric.createFunction(
        name,
        "function (celsius) { return celsius * 1.8 + 32; }"
      )
    });
    it("should drop a existing function", async () => {
      const response = await fabric.dropFunction(name);
      expect(response.error).to.be.false;
    });
  });
});
