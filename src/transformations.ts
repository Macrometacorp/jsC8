import { Config, Connection } from "./connection";

export class Transformations {
  protected _connection: Connection;

  constructor(config?: Config) {
    this._connection = new Connection(config);
  }

  // body: type is `any` since users can define their own transformations
  // absolutePath: true is required since this endpoint is not prefixed with /_fabric
  validateTransformation(body: any) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/transformations/validate",
        body,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  retrieveTransformedDataSample(body: any) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/transformations/sample",
        body,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  retrieveTransformedDataPreview(body: any) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/transformations/preview",
        body,
        absolutePath: true,
      },
      (res) => res.body
    );
  }
}
