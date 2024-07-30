import { Config, Connection } from "./connection";

export interface DeployParametersBase {
  type: string;
  name: string;
  environment: string;
}

export interface DeployQueryWorkerParameters extends DeployParametersBase {
  queryWorkerName: string;
}

export interface DeployStreamAdhocQueryParameters extends DeployParametersBase {
  streamWorkerName: string;
}

export interface DeployStreamPublisherParameters extends DeployParametersBase {
  streamWorkerName: string;
  streamName: string;
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

  setResultCallback(callback: ((res: any) => void) | undefined) {
    this._connection.setResultCallback(callback);
  }

  listFunctionWorkers(type: string = "all") {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/function",
        qs: type,
      },
      (res) => res.body
    );
  }

  deployQueryWorkerToEdgeWorker(parameters: DeployQueryWorkerParameters) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/function/generate",
        qs: parameters,
      },
      (res) => res.body
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
      (res) => res.body
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
      (res) => res.body
    );
  }

  getFunctionWorkerInfo(functionName: string) {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/function/${functionName}`,
      },
      (res) => res.body
    );
  }

  removeFunctionWorker(functionName: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/_api/function/${functionName}`,
      },
      (res) => res.body
    );
  }

  invokeFunctionWorker(functionName: string, parameters?: any) {
    let queryParameters = "";
    if (parameters !== undefined) {
      queryParameters = `params=${JSON.stringify(parameters)}`;
    }
    return this._connection.request(
      {
        method: "POST",
        path: `/_api/function/invoke/${functionName}`,
        qs: queryParameters,
      },
      (res) => res.body
    );
  }

  getEdgeWorkerMetadata() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/function/metadata",
      },
      (res) => res.body
    );
  }
  modifyEdgeWorkerMetadata(body: MetadataParameters) {
    return this._connection.request(
      {
        method: "PUT",
        path: "/_api/function/metadata",
        body: body,
      },
      (res) => res.body
    );
  }

  deleteEdgeWorkerMetadata() {
    return this._connection.request(
      {
        method: "DELETE",
        path: "/_api/function/metadata",
      },
      (res) => res.body
    );
  }

  createEdgeWorkerMetadata(body: MetadataParameters) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/function/metadata",
        body: body,
      },
      (res) => res.body
    );
  }
}
