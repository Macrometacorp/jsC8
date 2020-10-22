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
        const coll = "test_search_collection";
        const viewName = "c8search_view_test_search_collection";
        beforeEach(async () => {
            await c8Client.createCollection(coll);
            await c8Client.insertDocumentMany(coll, [{"v": "The quick brown fox jumps over the lazy dog"}, {"v": "The quick black dog jumps over the brown fox"}, {"v": "The quick brown fox jumps over the lazy squirrel"}]);
            search = c8Client.search({ viewName, analyzerName: "analyzerName" });
        });

        afterEach(async () => {
            try {
                await c8Client.deleteCollection(coll);
                await c8Client.deleteView(viewName);
            } catch (error) { }
        });

        describe("search.setSearch", () => {
            it("set search capability for given collection", async () => {
                const response = await search.setSearch(coll, true, "v");
                expect(response).to.be.true;
            });
            it("search in collection", async () => {
                const response = await search.searchInCollection(coll, "RETURN doc");
                expect(response.count).to.equal(2);
            });
        });
    });
});
