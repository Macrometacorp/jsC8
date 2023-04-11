import { expect } from "chai";
import { C8Client } from "../jsC8";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

// To run this tests we need to have PostgreSQL integration set up
// Only run when PostgreSQL is configured
// When running from terminal or with npm run devtest function tests will
// be skipped
// To enable tests, remove skip flag from describe method
describe("validating connectors apis", function () {
  dotenv.config();
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);
  let c8Client: C8Client;

  const connectionName: string = "test-new-connection";

  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
  });

  describe("test integrations", () => {
    it("create integration", async () => {
      const response = await c8Client.integrations.createIntegration({
        name: connectionName,
        type: "connection",
        connector: {
          name: "postgres",
          displayName: "PostgreSQL",
          type: "source",
        },
        isEditable: true,
        metadata: {
          connection_name: "fromPG",
          host: process.env.DB_HOST ? process.env.DB_HOST : "",
          port: process.env.DB_PORT ? process.env.DB_PORT : "",
          user: process.env.DB_USER ? process.env.DB_USER : "",
          password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "",
          dbname: "from_pg",
          filter_schemas: "public",
          filter_table: "cars",
          default_replication_method: "FULL_TABLE",
          ssl: false,
          logical_poll_total_seconds: "10800",
          break_at_end_lsn: false,
          max_run_seconds: "43200",
          debug_lsn: "false",
          itersize: "20000",
          use_secondary: false,
        },
      });
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
    });

    it("List all integrations", async () => {
      const response = await c8Client.integrations.getIntegrations();
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("array");
    });
    it("Validate integration", async () => {});
    it("Get integration", async () => {});
    it("Update integration", async () => {});
  });

  describe("test transformations", () => {});

  describe("test connectors", () => {
    it("Get available connectors", async () => {
      const response = await c8Client.connectors.getAvailableConnectors();
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("array");
    });
    //todo not working
    it("Get connector details", async () => {
      const response = await c8Client.connectors.getConnectorDetails(
        "postgres"
      );
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("object");
    });
    it("Retrieve connector schema", async () => {
      const response = await c8Client.connectors.retrieveConnectorSchema(
        "postgres",
        {
          type: "source",
          config: {
            logical_poll_total_seconds: "10800",
            max_run_seconds: "43200",
            ssl: false,
            debug_lsn: "false",
            connection_name: "fromPG",
            password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "",
            use_secondary: false,
            dbname: "from_pg",
            port: process.env.DB_PORT ? process.env.DB_PORT : "",
            default_replication_method: "FULL_TABLE",
            host: process.env.DB_HOST ? process.env.DB_HOST : "",
            break_at_end_lsn: false,
            filter_table: "cars",
            filter_schemas: "public",
            itersize: "20000",
            user: process.env.DB_USER ? process.env.DB_USER : "",
          },
        }
      );
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("array");
    });
    it("Retrieve connector sample data", async () => {
      const response = await c8Client.connectors.retrieveConnectorSampleData(
        "postgres",
        {
          type: "source",
          config: {
            logical_poll_total_seconds: "10800",
            max_run_seconds: "43200",
            ssl: false,
            debug_lsn: "false",
            connection_name: "fromPG",
            password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "",
            use_secondary: false,
            dbname: "from_pg",
            port: process.env.DB_PORT ? process.env.DB_PORT : "",
            default_replication_method: "FULL_TABLE",
            host: process.env.DB_HOST ? process.env.DB_HOST : "",
            break_at_end_lsn: false,
            filter_table: "cars",
            filter_schemas: "public",
            itersize: "20000",
            user: process.env.DB_USER ? process.env.DB_USER : "",
          },
        }
      );
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("array");
    });
  });
});
