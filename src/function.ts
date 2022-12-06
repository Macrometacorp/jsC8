import { Config, Connection } from "./connection";

export interface DeployQueryWorkerParameters {
  type: string;
  name: string;
  queryWorkerName: string;
  environment: string;
}

export interface DeployStreamAdhocQueryParameters {
  type: string;
  name: string;
  streamWorkerName: string;
  environment: string;
}

export interface DeployStreamPublisherParameters {
  type: string;
  name: string;
  streamWorkerName: string;
  streamName: string;
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

  deployQueryWorkerToEdgeWorker(parameters: DeployQueryWorkerParameters) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/function/generate",
        qs: parameters,
      },
      res => res.body
    );
  }

  deployStreamAdhocQueryToEdgeWorker(
    parameters: DeployStreamAdhocQueryParameters
  ) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/function/generate/query",
        qs: parameters,
      },
      res => res.body
    );
  }

  deployStreamPublisherToEdgeWorker(
    parameters: DeployStreamPublisherParameters
  ) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/function/generate/publisher",
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

  invokeFunctionWorker(functionName: string, parameters?: any) {
    let queryParameters = "";
    if (parameters !== undefined) {
      queryParameters = `params=${JSON.stringify(parameters)}`;
    }
    const request = this._connection.request(
      {
        method: "POST",
        path: `/_api/function/invoke/${functionName}`,
        qs: queryParameters,
      },
      res => res.body
    );
    return request;
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
