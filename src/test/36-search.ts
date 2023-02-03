import { expect } from "chai";
import { C8Client } from "../jsC8";
import { Search } from "../search";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating search apis", function() {
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;

  let search: Search;
  const collectionName = "searchCollection";
  const viewName = "viewTest";
  const analyzerName = "analyzerTest";

  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
    await c8Client.createCollection(collectionName);
  });
  after(async () => {
    await c8Client.deleteCollection(collectionName);
  });

  describe("Search.operations", () => {
    beforeEach(async () => {
      search = c8Client.search({ viewName, analyzerName });
    });

    describe("search setSearch", () => {
      it("set search capability for given collectionName", async () => {
        const response = await search.setSearch(collectionName, true, "name");
        expect(response.result).to.be.true;
        await c8Client.deleteView(`c8search_view_${collectionName}`);
      });
    });

    describe("create delete view operations", () => {
      it("create delete view", async () => {
        const response = await search.createView();
        expect(response.name).to.equal(viewName);
        const deleteRes = await search.deleteView();
        expect(deleteRes.result).to.be.true;
      });
    });

    describe("view other operations", () => {
      beforeEach(async () => {
        await search.createView();
      });

      afterEach(async () => {
        await search.deleteView();
      });

      it("get list view", async () => {
        const response = await search.getListOfViews();
        expect(response.result.length).to.equal(1);
      });

      it("get view info", async () => {
        const response = await search.getViewInfo();
        expect(response.result.name).to.equal(viewName);
      });

      it("get view properties", async () => {
        const response = await search.getViewProperties();
        expect(response.result.type).to.equal("search");
      });

      it("update view properties", async () => {
        const response = await search.updateViewProperties({
          [collectionName]: { analyzers: ["identity"], fields: { v: {} } },
        });
        expect(response.links).to.deep.equal({
          [collectionName]: {
            analyzers: ["identity"],
            fields: { v: {} },
            includeAllFields: false,
            storeValues: "none",
            trackListPositions: false,
          },
        });
      });

      it("rename view", async () => {
        const newName = "viewNewName";
        const response = await search.renameView(newName);
        expect(response.result.name).to.equal(newName);
        search = c8Client.search({ viewName: newName });
      });
    });

    describe("create delete view operations", () => {
      it("create delete view", async () => {
        const response = await search.createAnalyzer("identity");
        expect(response.name).to.equal(`guest._system::${analyzerName}`);
        const deleteRes = await search.deleteAnalyzer();
        expect(deleteRes.name).to.equal(`guest._system::${analyzerName}`);
      });
    });

    describe("search analyzer operations", () => {
      beforeEach(async () => {
        await search.createAnalyzer("identity");
      });

      afterEach(async () => {
        await search.deleteAnalyzer();
      });

      it("get list of analyzers definition", async () => {
        const response = await search.getListOfAnalyzers();
        expect(response.result.length >= 1).to.be.true;
      });

      it("get analyzers definition", async () => {
        const response = await search.getAnalyzerDefinition();
        expect(response.name).to.equal(`guest._system::${analyzerName}`);
      });
    });
  });
});
