import { expect } from "chai";
import { C8Client } from "../jsC8";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating function endpoints", function() {
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
        expect(response).to.be.a("array");
        expect(response).to.have.lengthOf(0);
      });
      it("function.getFunctionWorkerInfo", async () => {
        const response = await c8Client.function.getFunctionWorkerInfo(
          "get-customers"
        );
        expect(response[0]).to.be.a("object");
        expect(response[0])
          .to.have.property("_key")
          .with.equal("mm-_system-get-customers");
        expect(response[0]).to.have.all.keys(
          "_id",
          "_key",
          "_rev",
          "activationStatus",
          "akamaiPropertyVersion",
          "createdAt",
          "description",
          "edgeWorkerId",
          "environment",
          "fabric",
          "lastModified",
          "name",
          "queryWorkerName",
          "queue",
          "type",
          "url"
        );
      });
      it("function.getEdgeWorkerMetadata", async () => {
        const response = await c8Client.function.getEdgeWorkerMetadata();
        expect(response).to.be.a("array");
        expect(response).to.have.lengthOf(1);
        expect(response[0]).to.have.all.keys(
          "accessToken",
          "baseUri",
          "clientSecret",
          "clientToken",
          "contractId",
          "groupId",
          "hostName",
          "propertyId",
          "resourceTierId",
          "type"
        );
      });
    });
    describe("test PUT endpoints", () => {});
    describe("test DELETE endpoints", () => {});
  });
});
