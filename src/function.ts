import { Config, Connection } from "./connection";

export interface DeployParameters {
  type: string;
  name: string;
  queryWorkerName: string;
  environment: string;
}

export interface MetadataParameters {
  type: string;
  accessToken: string;
  baseUri: string;
  clientSecret: string;
  clientToken: string;
  resourceTierId: string;
  groupId: string;
  hostName: string;
}

export class Function {
  protected _connection: Connection;

  constructor(config?: Config) {
    this._connection = new Connection(config);
  }
  listFunctionWorkers(type: string = "all") {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/function",
        qs: type,
      },
      res => res.body
    );
  }

  deployQueryWorkerToEdgeWorker(parameters: DeployParameters) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/function/generate",
        qs: parameters,
      },
      res => res.body
    );
  }

  getFunctionWorkerInfo(functionName: string) {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/function/${functionName}`,
      },
      res => res.body
    );
  }

  removeFunctionWorker(functionName: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/_api/function/${functionName}`,
      },
      res => res.body
    );
  }

  invokeFunctionWorker(functionName: string, parameters: any) {
    return this._connection.request(
      {
        method: "POST",
        path: `/_api/function/invoke/${functionName}`,
        qs: parameters,
      },
      res => res.body
    );
  }

  getEdgeWorkerMetadata() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/function/metadata",
      },
      res => res.body
    );
  }
  modifyEdgeWorkerMetadata(body: MetadataParameters) {
    return this._connection.request(
      {
        method: "PUT",
        path: "/_api/function/metadata",
        body: body,
      },
      res => res.body
    );
  }

  deleteEdgeWorkerMetadata() {
    return this._connection.request(
      {
        method: "DELETE",
        path: "/_api/function/metadata",
      },
      res => res.body
    );
  }

  createEdgeWorkerMetadata(body: MetadataParameters) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/function/metadata",
        body: body,
      },
      res => res.body
    );
  }
}
