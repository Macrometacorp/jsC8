import { expect } from "chai";
import { C8Client } from "../jsC8";
import { getDCListString } from "../util/helper";

describe("manipulating restql", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(50000);

  let client: C8Client;
  let name = `testdb${Date.now()}`;
  let dcList: string;

  before(async () => {
    client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC
    });
    const response = await client.getAllEdgeLocations();
    dcList = getDCListString(response);
    await client.createFabric(name, ["root"], { dcList: dcList });
    client.useFabric(name);
  });

  after(() => {
    client.close();
  });

  describe("client.saveQuery", () => {
    it("should save a query", async () => {
      const queryName = "testQuery";
      const response: any = await client.saveQuery(
        queryName,
        {},
        "for coll in _collections return coll"
      );
      expect(response.error).to.be.false;
      expect(response.result.name).to.equal(queryName);
    });
  });

  describe("client.listSavedQueries", () => {
    it("should make a successful API call", async () => {
      const response: any = await client.listSavedQueries();
      expect(response.error).to.be.false;
      expect(response.result.length).to.be.at.least(1);
    });
  });

  describe("client.executeSavedQuery", () => {
    let response: { error: any };
    const queryName = "testQuery";
    before(async () => {
      response = await client.executeSavedQuery(queryName, {});
    });

    it("should execute a saved query", async () => {
      expect(response.error).to.be.false;
    });
  });

  describe("client.deleteSavedQuery", () => {
    let response: { error: any };
    const queryName = "testQuery";

    it("should delete a saved query", async () => {
      response = await client.deleteSavedQuery(queryName);
      expect(response.error).to.be.false;
    });
  });

  describe("client.createRestqlCursor", () => {
    //const query = "FOR x IN _routing RETURN x";

    it("should delete a saved query");
  });
});
