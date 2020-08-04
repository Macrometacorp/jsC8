import { expect } from "chai";
import { C8Client } from "../jsC8";
const path = require('path');
const csvPath = path.join(__dirname, 'mockFiles', 'data.csv');

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
    it("Validate createCollection, hasCollection, getCollection, deleteCollection", done => {
        const collectionName = 'ping_test';
        c8Client.createCollection(collectionName)
            .then(async (data) => {
                expect(data).to.have.property("name", collectionName);
                await c8Client.hasCollection(collectionName).then((hasCollection) => {
                    expect(hasCollection).to.be.true;
                });
                await c8Client.getCollection(collectionName).then((collection) => {
                    expect(collection).to.have.property("name", collectionName)
                });
            })
            .then(async () => {
                await c8Client.deleteCollection(collectionName).then((data) => {
                    expect(data).to.have.property("error", false);
                });
            })
            .then(() => void done())
            .catch(done);
    });

    it("Validate insertDocumentMany, getDocumentMany", done => {
        const collectionName = 'ping_test';
        c8Client.createCollection(collectionName)
            .then(async () => {
                await c8Client.insertDocumentMany(collectionName, [{ "value": "123" }, { "value": "1234" }]).then((data) => {
                    expect(data.length).to.equal(2);
                });
                await c8Client.getDocumentMany(collectionName, 2, 0).then((data) => {
                    expect(data.length).to.equal(2);
                });
            })
            .then(async () => {
                await c8Client.deleteCollection(collectionName).then((data) => {
                    expect(data).to.have.property("error", false);
                });
            })
            .then(() => void done())
            .catch(done);
    });

    it("Validate insertDocumentFromFile", done => {
        const collectionName = 'ping_test';
        c8Client.createCollection(collectionName)
            .then(async () => {
                await c8Client.insertDocumentFromFile(collectionName, csvPath).then((data) => {
                    expect(data.length).to.equal(2);
                });
            })
            .then(async () => {
                await c8Client.deleteCollection(collectionName).then((data) => {
                    expect(data).to.have.property("error", false);
                });
            })
            .then(() => void done())
            .catch(done);
    });

    it("get Collection Ids, keys", done => {
        const collectionName = 'ping_test';

        c8Client.createCollection(collectionName)
            .then(async () => {
                let ids: string[] = [];
                let keys: string[] = [];
                await c8Client.insertDocumentMany(collectionName, [{ "value": "123" }, { "value": "1234" }]).then((data) => {
                    ids = data.map((doc: any) => doc._id);
                    keys = data.map((doc: any) => doc._key);
                });
                await c8Client.getCollectionIds(collectionName).then((data) => {
                    expect(data).to.deep.equal(ids);
                });
                await c8Client.getCollectionKeys(collectionName).then((data) => {
                    expect(data).to.deep.equal(keys);
                });
            })
            .then(async () => {
                await c8Client.deleteCollection(collectionName).then((data) => {
                    expect(data).to.have.property("error", false);
                });
            })
            .then(() => void done())
            .catch(done);
    });
    it("validate executeQuery", done => {
        const collectionName = 'ping_test';
        const query = `FOR doc IN ${collectionName} RETURN doc._id`
        c8Client.createCollection(collectionName)
            .then(async () => {
                let ids: string[] = [];
                await c8Client.insertDocumentMany(collectionName, [{ "value": "123" }, { "value": "1234" }]).then((data) => {
                    ids = data.map((doc: any) => doc._id);
                });
                await c8Client.executeQuery(query).then((data) => {
                    expect(data).to.deep.equal(ids);
                });
            })
            .then(async () => {
                await c8Client.deleteCollection(collectionName).then((data) => {
                    expect(data).to.have.property("error", false);
                });
            })
            .then(() => void done())
            .catch(done);
    });
    it("validate hasUser", done => {
        const userName = "guest_test";
        const userEmail = "guesttest@macrometa.io";
        c8Client.createUser(userName, userEmail)
            .then(async () => {
                const hasUser = await c8Client.hasUser(userName, userEmail);
                expect(hasUser).to.be.true;
            })
            .then(async () => {
                await c8Client.deleteUser(userName, userEmail);
            })
            .then(() => void done())
            .catch(done);
    });
});