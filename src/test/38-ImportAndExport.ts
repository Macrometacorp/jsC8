import { expect } from "chai";
import { C8Client } from "../jsC8";
import { C8Error } from "../error";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating Import and Export apis", function () {
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;

  beforeEach(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
  });

  describe("Import and Export", () => {
    const collectionName = "persons";

    describe("if collection is exist", () => {
      beforeEach(async () => {
        await c8Client.createCollection(collectionName);
      });

      afterEach(async () => {
        await c8Client.deleteCollection(collectionName);
      });

      it("importAndExport.exportDataByQuery", async () => {
        const query = `FOR x in ${collectionName} LIMIT 0, 10 RETURN x`;
        const response = await c8Client.exportDataByQuery(query);
        expect(response.code).to.equal(200);
      });

      it("importAndExport.exportDataByCollectionName", async () => {
        const response = await c8Client.exportDataByCollectionName(
          collectionName
        );
        expect(response.code).to.equal(200);
      });

      it("importAndExport.importDocuments", async () => {
        const data: Array<Record<string, any>> = [{ value: "value" }];
        const response = await c8Client.importDocuments(
          collectionName,
          data,
          true,
          "value"
        );
        expect(response.result.created).to.equal(data.length);
      });
    });

    describe("if collection is not exist", () => {
      it("importAndExport.exportDataByQuery", async () => {
        const query = `FOR x in ${collectionName} LIMIT 0, 10 RETURN x`;
        try {
          const response = await c8Client.exportDataByQuery(query);
          expect(response.code).to.equal(200);
        } catch (err) {
          expect(err).is.instanceof(C8Error);
          expect(err).to.have.property("statusCode", 404);
          expect(err).to.have.property("errorNum", 1203);
        }
      });

      it("importAndExport.exportDataByCollectionName", async () => {
        try {
          const response = await c8Client.exportDataByCollectionName(
            collectionName
          );
          expect(response.code).to.equal(200);
        } catch (err) {
          expect(err).is.instanceof(C8Error);
          expect(err).to.have.property("statusCode", 404);
          expect(err).to.have.property("errorNum", 1203);
        }
      });

      it("importAndExport.importDocuments", async () => {
        try {
          const data: Array<Record<string, any>> = [{ value: "value" }];
          const response = await c8Client.importDocuments(
            collectionName,
            data,
            true,
            "value"
          );
          expect(response.result.created).to.equal(data.length);
        } catch (err) {
          expect(err).is.instanceof(C8Error);
          expect(err).to.have.property("statusCode", 404);
          expect(err).to.have.property("errorNum", 1203);
        }
      });
    });
  });
});
