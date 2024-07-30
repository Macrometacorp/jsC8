import { expect } from "chai";
import { C8Client } from "../jsC8";
import { DocumentCollection } from "../collection";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("DocumentCollection API", function () {
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;

  let collection: DocumentCollection;
  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
  });
  after(async () => {
    try {
      c8Client.useFabric("_system");
    } finally {
      c8Client.close();
    }
  });
  beforeEach((done) => {
    collection = c8Client.collection(`c${Date.now()}`);
    collection.setResultCallback((res: any) => {
      expect([202, 200]).to.include(res.statusCode);
    });
    collection
      .create()
      .then(() => void done())
      .catch(done);
  });
  afterEach((done) => {
    // Disable result callback
    collection.setResultCallback(undefined);
    collection
      .drop()
      .then(() => void done())
      .catch(done);
  });
  describe("documentCollection.document", () => {
    let data = { foo: "bar" };
    let meta: any;
    beforeEach(async () => {
      meta = await collection.save(data);
    });
    it("returns a document should return 200 or 202", async () => {
      await collection.document(meta._id);
    });
    it("does not throw on not found when graceful", async () => {
      collection.setResultCallback((res: any) => {
        expect([404]).to.include(res.statusCode);
      });
      const doc = await collection.document("doesnotexist", true);
      expect(doc).to.equal(null);
    });
  });

  describe("fabric.useFabric", () => {
    it("getting version on fabric should return 200", async () => {
      collection.setResultCallback((res: any) => {
        expect([200]).to.include(res.statusCode);
      });
      const response = await c8Client.version();
      expect(response.server).to.equal("C8DB");
    });
  });
});
