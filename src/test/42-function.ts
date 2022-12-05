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
  // Akamai credentials
  const accessToken = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const baseUri = process.env.BASE_URL ? process.env.BASE_URL : "";
  const clientSecret = process.env.CLIENT_SECRET
    ? process.env.CLIENT_SECRET
    : "";
  const clientToken = process.env.CLIENT_TOKEN ? process.env.CLIENT_TOKEN : "";
  const groupId = process.env.GROUP_ID ? process.env.GROUP_ID : "";
  describe("Test Metadata Endpoints", () => {
    it("function.createEdgeWorkerMetadata", async () => {
      const response = await c8Client.function.createEdgeWorkerMetadata({
        type: "akamai",
        accessToken: accessToken,
        baseUri: baseUri,
        clientSecret: clientSecret,
        clientToken: clientToken,
        resourceTierId: "200",
        groupId: groupId,
        hostName: "macrometa-akamai-ew.macrometa.io",
      });
      expect(response.code).to.equal(201);
      expect(response.result).to.be.a("array");
      expect(response.result).to.have.lengthOf(1);
      expect(response.result[0]).to.have.all.keys("_id", "_key", "_rev");
    });
    it("function.getEdgeWorkerMetadata", async () => {
      const response = await c8Client.function.getEdgeWorkerMetadata();
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("array");
      expect(response.result).to.have.lengthOf(1);
      expect(response.result[0]).to.have.all.keys(
        "accessToken",
        "baseUri",
        "clientSecret",
        "clientToken",
        "contractId",
        "groupId",
        "groupIdWithPrefix",
        "hostName",
        "propertyId",
        "resourceTierId",
        "type"
      );
    });
    it("function.modifyEdgeWorkerMetadata", async () => {
      const response = await c8Client.function.modifyEdgeWorkerMetadata({
        type: "akamai",
        accessToken: accessToken,
        baseUri: baseUri,
        clientSecret: clientSecret,
        clientToken: clientToken,
        resourceTierId: "200",
        groupId: groupId,
        hostName: "macrometa-akamai-ew.macrometa.io",
      });
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("array");
      expect(response.result).to.have.lengthOf(1);
      expect(response.result[0]).to.have.all.keys(
        "_id",
        "_key",
        "_oldRev",
        "_rev"
      );
    });
    it("function.deleteEdgeWorkerMetadata", async () => {
      const response = await c8Client.function.deleteEdgeWorkerMetadata();
      expect(response).to.equal("");
    });
  });

  describe("Function Edge Workers Endpoints", () => {
    it("function.listFunctionWorkers", async () => {
      const response = await c8Client.function.listFunctionWorkers();
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("array");
      expect(response.result).to.have.lengthOf(0);
    });
    it("function.createEdgeWorkerMetadataForDeploy", async () => {
      const response = await c8Client.function.createEdgeWorkerMetadata({
        type: "akamai",
        accessToken: accessToken,
        baseUri: baseUri,
        clientSecret: clientSecret,
        clientToken: clientToken,
        resourceTierId: "200",
        groupId: groupId,
        hostName: "macrometa-akamai-ew.macrometa.io",
      });
      expect(response.code).to.equal(201);
      expect(response.result).to.be.a("array");
      expect(response.result).to.have.lengthOf(1);
      expect(response.result[0]).to.have.all.keys("_id", "_key", "_rev");
    });
    it("function.deployQueryWorkerToEdgeWorker", async () => {
      const response = await c8Client.function.deployQueryWorkerToEdgeWorker({
        type: "akamai",
        name: "testSdkEv",
        queryWorkerName: "testSdkKv",
        environment: "PRODUCTION",
      });
      expect(response.code).to.equal(202);
      expect(response.result).to.be.a("array");
      expect(response.result).to.have.lengthOf(1);
      expect(response.result[0]).to.have.all.keys("message");
    });
    it("function.getFunctionWorkerInfo", async () => {
      const response = await c8Client.function.getFunctionWorkerInfo(
        "testSdkEv"
      );
      expect(response.code).to.equal(200);
      expect(response.result[0]).to.be.a("object");
      expect(response.result[0])
        .to.have.property("_key")
        .with.equal("mm-_system-testSdkEv");
      expect(response.result[0]).to.have.all.keys(
        "_id",
        "_key",
        "_rev",
        "activationStatus",
        "akamaiPropertyVersion",
        "createdAt",
        "edgeWorkerId",
        "environment",
        "fabric",
        "isDeleted",
        "lastModified",
        "name",
        "queryWorkerName",
        "queue",
        "type",
        "url"
      );
    });
  });
});
