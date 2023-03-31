import { Config, Connection } from "./connection";

export interface Integration {
  name: string;
  type: string;
  connector: {
    name: string;
    displayName: string;
    type: string;
  };
  isEditable: boolean;
  metadata: Metadata;
}

interface Metadata {
  connection_name: string;
  host: string;
  port: string;
  user: string;
  password: string;
  dbname: string;
  filter_schemas: string;
  filter_table: string;
  default_replication_method: string;
  ssl: boolean;
  logical_poll_total_seconds: string;
  break_at_end_lsn: boolean;
  max_run_seconds: string;
  debug_lsn: string;
  itersize: string;
  use_secondary: boolean;
}

export class Integrations {
  protected _connection: Connection;

  constructor(config?: Config) {
    this._connection = new Connection(config);
  }

  validateIntegration(body: Integration) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/integrations/validate",
        body,
      },
      (res) => res.body
    );
  }

  createIntegration(body: Integration) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/integrations",
        body,
      },
      (res) => res.body
    );
  }

  getIntegrations() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/integrations",
      },
      (res) => res.body
    );
  }

  getIntegration(integrationName: string) {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/integrations/${integrationName}`,
      },
      (res) => res.body
    );
  }

  updateIntegration(integrationName: string, body: Integration) {
    return this._connection.request(
      {
        method: "PUT",
        path: `/_api/integrations/${integrationName}`,
        body,
      },
      (res) => res.body
    );
  }

  deleteIntegration(integrationName: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/_api/integrations/${integrationName}`,
      },
      (res) => res.body
    );
  }
}
