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
        @App:qlVersion("2")
        @App:description('Basic stream application to demonstrate reading data from input stream and store it in the collection. The stream and collections are automatically created if they do not already exist.')
        /**
            Testing the Stream Application:
            1. Open Stream SampleCargoAppDestStream in Console. The output can be monitored here.
            2. Upload following data into SampleCargoAppInputTable C8DB Collection
                {"weight": 1}
                {"weight": 2}
                {"weight": 3}
                {"weight": 4}
                {"weight": 5}
            3. Following messages would be shown on the SampleCargoAppDestStream Stream Console.
                [2021-08-27T14:12:15.795Z] {"weight":1}
                [2021-08-27T14:12:15.799Z] {"weight":2}
                [2021-08-27T14:12:15.805Z] {"weight":3}
                [2021-08-27T14:12:15.809Z] {"weight":4}
                [2021-08-27T14:12:15.814Z] {"weight":5}
            4. Following messages would be stored into SampleCargoAppDestTable
                {"weight":1}
                {"weight":2}
                {"weight":3}
                {"weight":4}
                {"weight":5}
        */
        -- Defines Table SampleCargoAppInputTable
        CREATE SOURCE SampleCargoAppInputTable WITH (type = 'database', collection = "SampleCargoAppInputTable", collection.type="doc", replication.type="global", map.type='json') (weight int);
        -- Define Stream SampleCargoAppDestStream
        CREATE SINK SampleCargoAppDestStream WITH (type = 'stream', stream = "SampleCargoAppDestStream", replication.type="local") (weight int);
        -- Defining a Destination table to dump the data from the stream
        CREATE STORE SampleCargoAppDestTable WITH (type = 'database', stream = "SampleCargoAppDestTable") (weight int);
        -- Data Processing
        @info(name='Query')
        INSERT INTO SampleCargoAppDestStream
        SELECT weight
        FROM SampleCargoAppInputTable;
        -- Data Processing
        @info(name='Dump')
        INSERT INTO SampleCargoAppDestTable
        SELECT weight
        FROM SampleCargoAppInputTable;`;
      const app = client.streamApp("Sample-Cargo-App");
      let response = await app.updateApplication(dcList, appdef);
      await new Promise(r => setTimeout(r, 15000));
      expect(response.error).to.be.false;
    });
  });

  describe("streamapps.query", () => {
    it("runs query", async () => {
      await new Promise(r => setTimeout(r, 6000));
      await client.insertDocumentMany("SampleCargoAppInputTable", [
        { weight: 10 },
        { weight: 9 },
      ]);
      const app = client.streamApp("Sample-Cargo-App");
      let response = await app.query(
        "select * from SampleCargoAppDestTable limit 2"
      );
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
