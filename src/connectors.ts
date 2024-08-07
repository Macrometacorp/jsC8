import { Config, Connection } from "./connection";

export class Connectors {
  protected _connection: Connection;

  constructor(config?: Config) {
    this._connection = new Connection(config);
  }

  // body: type is `any` since users can define their own connectors
  // absolutePath: true is required since this endpoint is not prefixed with /_fabric
  getAvailableConnectors() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/connectors",
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getConnectorDetails(connectorName: string) {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/connectors/${connectorName}`,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  retrieveConnectorSchema(connectorName: string, body: any) {
    return this._connection.request(
      {
        method: "POST",
        path: `/_api/connectors/${connectorName}/schema`,
        body,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  retrieveConnectorSampleData(connectorName: string, body: any) {
    return this._connection.request(
      {
        method: "POST",
        path: `/_api/connectors/${connectorName}/sample`,
        body,
        absolutePath: true,
      },
      (res) => res.body
    );
  }
}
