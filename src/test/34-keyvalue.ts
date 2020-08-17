import { expect } from "chai";
import { KeyValue } from "../keyValue";
import { C8Client } from "../jsC8";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating new apis", function () {
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
    describe("keyValue.crud_operations", () => {
        let keyValue: KeyValue;
        beforeEach(async () => {
            const collName = "kv_collection";
            keyValue = c8Client.keyValue(collName);
            await keyValue.createCollection();
            await keyValue.insertKVPairs([{ _key: "kv", value: { val: 123 }, expireAt: 0 }]);
        });

        afterEach(async () => {
            try {
                await keyValue.deleteCollection();
            } catch (error) { }
        });

        describe("keyValue.getKVCount", () => {
            it("get kv count", async () => {
                const response = await keyValue.getKVCount();
                expect(response.error).to.be.false;
                expect(response.count).to.equal(1);
            });
        });

        describe("keyValue.getKVKeys", () => {
            it("get kv Keys", async () => {
                const response = await keyValue.getKVKeys();
                expect(response.error).to.be.false;
                expect(response.result).to.deep.equal(["kv"]);
            });
        });

        describe("keyValue.getValueForKey", () => {
            it("get value for Key", async () => {
                const response = await keyValue.getValueForKey("kv");
                expect(response.value).to.deep.equal({ val: 123 });
            });
        });

        describe("keyValue.deleteEntryForKey", () => {
            it("delete entry for Key", async () => {
                const key = "kv";
                const response = await keyValue.deleteEntryForKey(key);
                expect(response._key).to.equal(key);
            });
        });

        describe("keyValue.deleteEntryForKeys", () => {
            it("delete entry for Keys", async () => {
                const key = "kv";
                const response = await keyValue.deleteEntryForKeys([key]);
                expect(response[0]._key).to.equal(key);
            });
        });
    });
});
