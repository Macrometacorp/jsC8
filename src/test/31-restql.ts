import { expect } from "chai";
import { Fabric } from "../jsC8";


describe("manipulating restql", function () {
    // create fabric takes 11s in a standard cluster
    this.timeout(50000);

    let fabric: Fabric;
    const testUrl: string =
        process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

    before(async () => {
        fabric = new Fabric({
            url: testUrl,
            c8Version: Number(process.env.C8_VERSION || 30400)
        });
        await fabric.login("demo", "root", "demo");
        fabric.useTenant("demo");
    });

    after(() => {
        fabric.close();
    });

    describe("fabric.listSavedQueries", () => {
        it("should make a successful API call", async () => {
            const response = await fabric.listSavedQueries();
            expect(response.error).to.be.false;
        })
    });

    describe("fabric.saveQuery", () => {
        let response: { error: any; };
        const queryName = "testQuery";
        before(async () => {
            response = await fabric.saveQuery(queryName, {}, "for coll in _collections return coll");
        });
        after(async () => {
            await fabric.deleteSavedQuery(queryName);
        })
        it("should save a query", async () => {
            expect(response.error).to.be.false;
        })
    });
})