import { expect } from "chai";
import { C8Client } from "../jsC8";
import { Search } from "../search";
const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating search apis", function () {
    this.timeout(60000);

    let c8Client: C8Client;
    const testUrl: string =
        process.env.TEST_C8_URL || "https://test.macrometa.io";

    beforeEach(async () => {
        c8Client = new C8Client({
            url: testUrl,
            c8Version: C8_VERSION
        });

        await c8Client.login("guest@macrometa.io", "guest");
        c8Client.useTenant("guest");
    });
    afterEach(() => {
        c8Client.close();
    });
    describe("Search.operations", () => {
        let search: Search;
        const coll = "collection";
        const viewName = "viewTest";
        const analyzerName = "analyzerTest";
        beforeEach(async () => {
            search = c8Client.search({ viewName, analyzerName });
        });

        describe("search setSearch", () => {
            it("set search capability for given collection", async () => {
                await c8Client.createCollection(coll);
                const response = await search.setSearch(coll, true, "name");
                expect(response).to.be.true;
                await c8Client.deleteView(`c8search_view_${coll}`);
            });
        });

        describe("search view operations", () => {
            it("create view", async () => {
                const response = await search.createView();
                expect(response.name).to.equal(viewName);
            });

            it("get list view", async () => {
                const response = await search.getListOfViews()
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
                const response = await search.updateViewProperties({ links: { [coll]: { analyzers: ['identity'], fields: { 'v': {} } } } });
                expect(response.links).to.deep.equal({ [coll]: { analyzers: ['identity'], fields: { 'v': {} }, includeAllFields: false, storeValues: "none", trackListPositions: false } });
                await c8Client.deleteCollection(coll);
            });

            it("rename view", async () => {
                const newName = "viewNewName";
                const response = await search.renameView(newName);
                expect(response.result.name).to.equal(newName);
            });

            it("delete view", async () => {
                const viewName = "viewNewName";
                const response = await c8Client.deleteView(viewName);
                expect(response.result).to.be.true;
            });
        });

        describe("search analyzer operations", () => {

            it("create analyzer", async () => {
                search = c8Client.search({ analyzerName });
                const response = await search.createAnalyzer('identity');
                expect(response.name).to.equal(`guest._system::${analyzerName}`);
            });

            it("get list of analyzers definition", async () => {
                const response = await search.getListOfAnalyzers();
                expect(response.result.length >= 1).to.be.true;
            });

            it("get analyzers definition", async () => {
                search = c8Client.search({ analyzerName: `guest._system::${analyzerName}` });
                const response = await search.getAnalyzerDefinition();
                expect(response.name).to.equal(`guest._system::${analyzerName}`);
            });

            it("delete analyzer", async () => {
                search = c8Client.search({ analyzerName: `guest._system::${analyzerName}` });
                const response = await search.deleteAnalyzer(true);
                expect(response.name).to.equal(`guest._system::${analyzerName}`);
            });

        });
    });
});
