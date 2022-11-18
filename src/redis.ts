import { Config, Connection } from "./connection";

export class Redis {
  protected _connection: Connection;

  constructor(config?: Config) {
    this._connection = new Connection(config);
  }

  set(key: string, value: string, collection: string, options: any[] = []) {
    const command: string = "SET";
    return this._commandParser(command, collection, key, value, ...options);
  }

  protected _commandParser(
    command: string,
    collection: string,
    ...args: any[]
  ) {
    // Create a body for all the commands
    const data = [command, ...args];
    let request = this._connection.request(
      {
        method: "POST",
        path: `/_api/redis/${collection}`,
        body: data,
      },
      res => res.body
    );

    return request;
  }
}
