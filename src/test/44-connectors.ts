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

  let config = {
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
  };

  let defaultBody = {
    name: connectionName,
    type: "connection",
    connector: {
      name: "postgres",
      displayName: "PostgreSQL",
      type: "source",
    },
    isEditable: true,
    metadata: config,
  };

  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
  });

  // Even though JavaScript test run sequentially, we are writing tests so that
  // they can be run in parallel to ensure that we can run tests in CI/CD
  describe("test integrations", () => {
    it("create integration", async () => {
      const response = await c8Client.integrations.createIntegration(
        defaultBody
      );
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
    });

    it("List all integrations", async () => {
      const response = await c8Client.integrations.getIntegrations();
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("array");
    });
    it("Validate integration", async () => {
      const response = await c8Client.integrations.validateIntegration(
        defaultBody
      );
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
    });
    it("Get integration", async () => {
      const response = await c8Client.integrations.getIntegration(
        connectionName
      );
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("object");
    });
    it("Update integration", async () => {
      const response = await c8Client.integrations.updateIntegration(
        connectionName,
        defaultBody
      );
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
    });
    it("Delete integration", async () => {
      const response = await c8Client.integrations.deleteIntegration(
        connectionName
      );
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
    });
  });

  describe("test transformations", () => {
    it("Validate transformation", async () => {
      const response = await c8Client.transformations.validateTransformation({
        collection: "Cars",
        type: "source",
        query:
          "INSERT INTO Output\nSELECT \n\t id,\n\t make_id,\n\t model,\n\t year,\n\t vin,\n\t color,\n\t price,\n\t city,\n\t state,\n\t postal,\n\t longitude,\n\t latitude,\n\t description,\n\t seller,\n\t seller_name,\n\t image,\n\t image_thumb\nFROM Input;",
        inputSchema: {
          name: "cars",
          attributes: [
            {
              name: "id",
              type: "long",
            },
            {
              name: "make_id",
              type: "string",
            },
            {
              name: "model",
              type: "string",
            },
            {
              name: "year",
              type: "long",
            },
            {
              name: "vin",
              type: "string",
            },
            {
              name: "color",
              type: "string",
            },
            {
              name: "price",
              type: "double",
            },
            {
              name: "city",
              type: "string",
            },
            {
              name: "state",
              type: "string",
            },
            {
              name: "postal",
              type: "long",
            },
            {
              name: "longitude",
              type: "double",
            },
            {
              name: "latitude",
              type: "double",
            },
            {
              name: "description",
              type: "string",
            },
            {
              name: "seller",
              type: "string",
            },
            {
              name: "seller_name",
              type: "string",
            },
            {
              name: "image",
              type: "string",
            },
            {
              name: "image_thumb",
              type: "string",
            },
          ],
        },
      });
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
    });

    it("Retrieve transformed data sample", async () => {
      const response =
        await c8Client.transformations.retrieveTransformedDataSample({
          name: "cars",
          attributes: [
            {
              name: "id",
              type: "long",
            },
            {
              name: "make_id",
              type: "string",
            },
            {
              name: "model",
              type: "string",
            },
            {
              name: "year",
              type: "long",
            },
            {
              name: "vin",
              type: "string",
            },
            {
              name: "color",
              type: "string",
            },
            {
              name: "price",
              type: "double",
            },
            {
              name: "city",
              type: "string",
            },
            {
              name: "state",
              type: "string",
            },
            {
              name: "postal",
              type: "long",
            },
            {
              name: "longitude",
              type: "double",
            },
            {
              name: "latitude",
              type: "double",
            },
            {
              name: "description",
              type: "string",
            },
            {
              name: "seller",
              type: "string",
            },
            {
              name: "seller_name",
              type: "string",
            },
            {
              name: "image",
              type: "string",
            },
            {
              name: "image_thumb",
              type: "string",
            },
          ],
        });
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
    });
    it("Retrieve transformed data preview", async () => {
      const response =
        await c8Client.transformations.retrieveTransformedDataPreview({
          query:
            "INSERT INTO Output\nSELECT \n\t id,\n\t make_id,\n\t model,\n\t year,\n\t vin,\n\t color,\n\t price,\n\t city,\n\t state,\n\t postal,\n\t longitude,\n\t latitude,\n\t description,\n\t seller,\n\t seller_name,\n\t image,\n\t image_thumb\nFROM Input;",
          inputSchema: {
            name: "cars",
            attributes: [
              {
                name: "id",
                type: "long",
              },
              {
                name: "make_id",
                type: "string",
              },
              {
                name: "model",
                type: "string",
              },
              {
                name: "year",
                type: "long",
              },
              {
                name: "vin",
                type: "string",
              },
              {
                name: "color",
                type: "string",
              },
              {
                name: "price",
                type: "double",
              },
              {
                name: "city",
                type: "string",
              },
              {
                name: "state",
                type: "string",
              },
              {
                name: "postal",
                type: "long",
              },
              {
                name: "longitude",
                type: "double",
              },
              {
                name: "latitude",
                type: "double",
              },
              {
                name: "description",
                type: "string",
              },
              {
                name: "seller",
                type: "string",
              },
              {
                name: "seller_name",
                type: "string",
              },
              {
                name: "image",
                type: "string",
              },
              {
                name: "image_thumb",
                type: "string",
              },
            ],
          },
          data: [
            {
              city: "Sacramento",
              color: "Goldenrod",
              description:
                "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus\\, auctor sed\\, tristique in\\, tempus sit amet\\, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum\\, felis sed interdum venenatis\\, turpis enim blandit mi\\, in porttitor pede justo eu massa.",
              id: 1.0,
              image:
                "https://images.unsplash.com/photo-1520116468816-95b69f847357?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1520116468816-95b69f847357?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: 9.9255,
              longitude: -75.6014,
              make_id: "Dodge",
              model: "Journey",
              postal: 95833.0,
              price: 1612.0,
              seller: "Billy.Kling66",
              seller_name: "Lissie Neesham",
              state: "California",
              vin: "WAURFAFR5BA409381",
              year: 2009.0,
            },
            {
              city: "Dallas",
              color: "Indigo",
              description:
                "Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo\\, rhoncus sed\\, vestibulum sit amet\\, cursus id\\, turpis. Integer aliquet\\, massa id lobortis convallis\\, tortor risus dapibus augue\\, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo.",
              id: 2.0,
              image:
                "https://images.unsplash.com/photo-1533903179229-783a50d25dd7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1533903179229-783a50d25dd7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: -77.8224,
              longitude: 55.0286,
              make_id: "Lincoln",
              model: "Continental Mark VII",
              postal: 75310.0,
              price: 82665.0,
              seller: "Fay.Mills",
              seller_name: "Obidiah Breton",
              state: "Texas",
              vin: "WBA3D3C56EK000457",
              year: 1990.0,
            },
            {
              city: "Albuquerque",
              color: "Violet",
              description:
                "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo\\, sollicitudin ut\\, suscipit a\\, feugiat et\\, eros.",
              id: 3.0,
              image:
                "https://images.unsplash.com/photo-1537294620176-089fc97ed2eb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1537294620176-089fc97ed2eb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: -60.6977,
              longitude: -55.5027,
              make_id: "Pontiac",
              model: "Torrent",
              postal: 87201.0,
              price: 94314.0,
              seller: "Antoinette.Hayes",
              seller_name: "Missy Ovell",
              state: "New Mexico",
              vin: "1G4HP54KX54034031",
              year: 2008.0,
            },
            {
              city: "Dayton",
              color: "Green",
              description:
                "Nam dui. Proin leo odio\\, porttitor id\\, consequat in\\, consequat ut\\, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
              id: 4.0,
              image:
                "https://images.unsplash.com/photo-1528659874595-6e92d957afcd?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1528659874595-6e92d957afcd?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: -39.7726,
              longitude: -35.3417,
              make_id: "Ford",
              model: "Falcon",
              postal: 45454.0,
              price: 41388.0,
              seller: "Sydni_Little15",
              seller_name: "Rosamund Strickland",
              state: "Ohio",
              vin: "JM1NC2MFXD0382356",
              year: 1966.0,
            },
            {
              city: "Warren",
              color: "Purple",
              description:
                "Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
              id: 5.0,
              image:
                "https://images.unsplash.com/photo-1511045709180-5907d822a33e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1511045709180-5907d822a33e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: 63.2554,
              longitude: -118.7472,
              make_id: "Mercedes-Benz",
              model: "CL-Class",
              postal: 44485.0,
              price: 57738.0,
              seller: "Annabelle11",
              seller_name: "Alphard Matthessen",
              state: "Ohio",
              vin: "JA32X8HWXAU202509",
              year: 2002.0,
            },
            {
              city: "San Angelo",
              color: "Pink",
              description:
                "In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.",
              id: 6.0,
              image:
                "https://images.unsplash.com/photo-1527989212891-7a76e4991927?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1527989212891-7a76e4991927?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: -60.0582,
              longitude: 27.466,
              make_id: "Toyota",
              model: "Highlander",
              postal: 76905.0,
              price: 57084.0,
              seller: "Thalia52",
              seller_name: "Hilarius Gelardi",
              state: "Texas",
              vin: "WBADN53413G135575",
              year: 2009.0,
            },
            {
              city: "Louisville",
              color: "Blue",
              description:
                "Nam ultrices\\, libero non mattis pulvinar\\, nulla pede ullamcorper augue\\, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum.",
              id: 7.0,
              image:
                "https://images.unsplash.com/photo-1514950568576-31f7200d5b72?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1514950568576-31f7200d5b72?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: 39.4494,
              longitude: -4.8221,
              make_id: "Mercury",
              model: "Mariner",
              postal: 40266.0,
              price: 70501.0,
              seller: "Cristian_Mosciski86",
              seller_name: "Booth Clipsham",
              state: "Kentucky",
              vin: "WAUGF98KX9A692750",
              year: 2009.0,
            },
            {
              city: "Olympia",
              color: "Indigo",
              description:
                "Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus\\, aliquet at\\, feugiat non\\, pretium quis\\, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.",
              id: 8.0,
              image:
                "https://images.unsplash.com/photo-1537166373494-05097c27a525?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1537166373494-05097c27a525?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: 60.6196,
              longitude: -45.3254,
              make_id: "Hummer",
              model: "H3T",
              postal: 98506.0,
              price: 37298.0,
              seller: "Candelario_Schowalter78",
              seller_name: "Michele Amberger",
              state: "Washington",
              vin: "1N6AA0CH3DN653723",
              year: 2010.0,
            },
            {
              city: "Houston",
              color: "Turquoise",
              description:
                "Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros\\, viverra eget\\, congue eget\\, semper rutrum\\, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui.",
              id: 9.0,
              image:
                "https://images.unsplash.com/photo-1510359609841-ca83daddf94e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1510359609841-ca83daddf94e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: 27.2747,
              longitude: -63.7248,
              make_id: "Lexus",
              model: "LS",
              postal: 77245.0,
              price: 50000.0,
              seller: "Joy_Hessel39",
              seller_name: "Lawrence Kleinbaum",
              state: "Texas",
              vin: "2C3CDXFG7FH373706",
              year: 1991.0,
            },
            {
              city: "Las Vegas",
              color: "Purple",
              description:
                "Morbi odio odio\\, elementum eu\\, interdum eu\\, tincidunt in\\, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.",
              id: 10.0,
              image:
                "https://images.unsplash.com/photo-1530227825882-5893f2425e14?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              image_thumb:
                "https://images.unsplash.com/photo-1530227825882-5893f2425e14?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMjA3NH0",
              latitude: 23.3657,
              longitude: -27.9849,
              make_id: "Nissan",
              model: "Sentra",
              postal: 89160.0,
              price: 99373.0,
              seller: "Osvaldo16",
              seller_name: "Crystie Bremmell",
              state: "Nevada",
              vin: "1G4GF5G38EF682104",
              year: 2011.0,
            },
          ],
        });
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
    });
  });

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
          config: config,
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
          config: config,
        }
      );
      expect(response.error).to.equal(false);
      expect(response.code).to.equal(200);
      expect(response.result).to.be.a("array");
    });
  });
});
