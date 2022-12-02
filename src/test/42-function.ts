import { expect } from "chai";
import { C8Client } from "../jsC8";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating redis apis", function() {
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;

  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
  });

  describe("Function", () => {
    describe("test POST endpoints", () => {});
    describe("test GET endpoints", () => {
      it("function.listFunctionWorkers", async () => {
        const response = await c8Client.function.listFunctionWorkers();
        expect(response).to.be.not.empty;
      });
      it("function.getFunctionWorkerInfo", async () => {
        const response = await c8Client.function.getFunctionWorkerInfo(
          "get-customers"
        );
        expect(response).to.be.not.empty;
      });
      it("function.getEdgeWorkerMetadata", async () => {
        const response = await c8Client.function.getEdgeWorkerMetadata();
        expect(response).to.be.not.empty;
      });
    });
    describe("test PUT endpoints", () => {});
    describe("test DELETE endpoints", () => {});
  });
});
