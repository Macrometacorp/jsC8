import { expect } from "chai";
import { Fabric } from "../jsC8";

describe("manipulating restql", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(50000);

  let fabric: Fabric;
  const testUrl: string =
    process.env.TEST_C8_URL || "https://test.macrometa.io";

  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400),
    });
    await fabric.login("guest@macrometa.io", "guest");
    fabric.useTenant("guest");
  });

  after(() => {
    fabric.close();
  });

  describe("fabric.saveQuery", () => {
    it("should save a query", async () => {
      const queryName = "testQuery";
      const response: any = await fabric.saveQuery(
        queryName,
        {},
        "for coll in _collections return coll"
      );
      expect(response.error).to.be.false;
      expect(response.result.name).to.equal(queryName);
    });
  });

  describe("fabric.listSavedQueries", () => {
    it("should make a successful API call", async () => {
      const response: any = await fabric.listSavedQueries();
      expect(response.error).to.be.false;
      expect(response.result.length).to.be.at.least(1);
    });
  });

  describe("fabric.executeSavedQuery", () => {
    let response: { error: any };
    const queryName = "testQuery";
    before(async () => {
      response = await fabric.executeSavedQuery(queryName, {});
    });

    it("should execute a saved query", async () => {
      expect(response.error).to.be.false;
    });
  });

  describe("fabric.deleteSavedQuery", () => {
    let response: { error: any };
    const queryName = "testQuery";

    it("should delete a saved query", async () => {
      response = await fabric.deleteSavedQuery(queryName);
      expect(response.error).to.be.false;
    });
  });
});
