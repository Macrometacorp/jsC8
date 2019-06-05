import { expect } from "chai";
import { Fabric } from "../jsC8";

describe("Transactions", () => {
  let fabric: Fabric;
  before(() => {
    fabric = new Fabric({
      url: process.env.TEST_C8_URL  || "https://test.macrometa.io",
      c8Version: Number(process.env.C8_VERSION || 30400)
    });
  });
  after(() => {
    fabric.close();
  });
  describe("fabric.transaction", () => {
    it("should execute a transaction and return the result", async () => {
      const result = await fabric.transaction(
        [],
        "function (params) {return params;}",
        "test"
      );
      expect(result).to.equal("test");
    });
  });
});
