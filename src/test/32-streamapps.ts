import { expect } from "chai";
import { C8Client } from "../jsC8";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

describe(" StreamApps ", function() {
  this.timeout(50000);
  dotenv.config();
  let client: C8Client;
  let name = `testFabric-test`;
  // let dcList: string;

  client = new C8Client({
    url: process.env.URL,
    apiKey: process.env.API_KEY,
    fabricName: process.env.FABRIC,
  });
  client.useFabric(name);

  // before(async () => {
  //   client = new C8Client({
  //     url: process.env.URL,
  //     apiKey: process.env.API_KEY,
  //     fabricName: process.env.FABRIC
  //   });
  //   const response = await client.getAllEdgeLocations();
  //   dcList = getDCListString(response);
  //   await client.createFabric(name, ["root"], { dcList: dcList });
  //   client.useFabric(name);
  // });

  after(() => {
    client.close();
  });

  describe("client.createStreamApp", async () => {
    it("Should create a Stream Apllication", async () => {
      const response = await client.getAllEdgeLocations();
      let dcListAll = getDCListString(response);
      let dcList = dcListAll.split(",");

      let appDefinition = `@App:name('Sample-Cargo-App')
                -- Stream
                define stream srcCargoStream (weight int);
                -- Table
                define table destCargoTable (weight int, totalWeight long);
                -- Data Processing
                @info(name='Query')
                select weight, sum(weight) as totalWeight
                from srcCargoStream
                insert into destCargoTable;`;
      let resp = await client.createStreamApp(dcList, appDefinition);
      expect(resp.error).to.be.false;
    });
  });

  describe("client.getAllStreamApps", () => {
    it("get all stream apps", async () => {
      let response = await client.getAllStreamApps();
      expect(response.error).to.be.false;
    });
  });

  describe("client.validateStreamappDefinition", () => {
    it("validate the streamapp definition", async () => {
      let appDefinition = `@App:name('Sample-Cargo-App')
                -- Stream
                define stream srcCargoStream (weight int);
                -- Table
                define table destCargoTable (weight int, totalWeight long);
                -- Data Processing
                @info(name='Query')
                select weight, sum(weight) as totalWeight
                from srcCargoStream
                insert into destCargoTable;`;
      let response = await client.validateStreamappDefinition(appDefinition);
      expect(response.error).to.be.false;
    });
  });

  describe("client.getSampleStreamApps", () => {
    it("get sample stream apps", async () => {
      let response = await client.getSampleStreamApps();
      expect(response.error).to.be.false;
    });
  });

  describe("streamapps.activateStreamApplication", () => {
    it("Activate a stream App", async () => {
      const app = client.streamApp("Sample-Cargo-App");
      let response = await app.activateStreamApplication(true);
      expect(response.error).to.be.false;
    });
  });

  describe("streamapps.retriveApplication", () => {
    it("Retrive a stream App", async () => {
      const app = client.streamApp("Sample-Cargo-App");
      let response = await app.retriveApplication();
      expect(response.error).to.be.false;
    });
  });

  describe("streamapps.updateApplication", () => {
    it("Update a stream App", async () => {
      const resp = await client.getAllEdgeLocations();
      let dcListAll = getDCListString(resp);
      let dcList = dcListAll.split(",");
      let appdef = `@App:name('Sample-Cargo-App')
                -- Stream
                define stream srcCargoStream (weight int);
                -- Table
                define table destCargoTable (weight int, totalWeight long);
                -- Data Processing
                @info(name='Query')
                select weight, sum(weight) as totalWeight
                from srcCargoStream
                insert into destCargoTable;`;
      const app = client.streamApp("Sample-Cargo-App");
      let response = await app.updateApplication(dcList, appdef);
      expect(response.error).to.be.false;
    });
  });

  describe("streamapps.query", () => {
    it("runs query", async () => {
      const app = client.streamApp("Sample-Cargo-App");
      let response = await app.query("select * from destCargoTable limit 3");
      expect(response.error).to.be.false;
    });
  });

  describe("streamapps.deleteApplication", () => {
    it("Delete a stream App", async () => {
      const app = client.streamApp("Sample-Cargo-App");
      let response = await app.deleteApplication();
      expect(response.error).to.be.false;
    });
  });
});
