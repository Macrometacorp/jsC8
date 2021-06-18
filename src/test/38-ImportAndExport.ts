import { expect } from "chai";
import { C8Client } from "../jsC8";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);


describe("validating Import and Export apis", function () {
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


    describe("Import and Export", () => {

        const collectionName = 'persons';

        it("importAndExport.getDataByQuery", async () => {
            const query = `FOR x in ${collectionName} LIMIT 0, 10 RETURN x`;
            const response = await c8Client.getDataByQuery(query);
            expect(response.code).to.equal(200);
        });

        it("importAndExport.getDataByCollectionName", async () => {
            const response = await c8Client.getDataByCollectionName(collectionName);
            expect(response.code).to.equal(200);
        });

        it("importAndExport.createDocuments", async () => {
            const data: any = [{ value: 'value' }]
            const response = await c8Client.createDocuments(collectionName, data, true);
            expect(response.result.created).to.equal(1);
        });
    });
})