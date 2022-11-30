import {Config, Connection} from "./connection";

export class Function {
    protected _connection: Connection;

    constructor(config?: Config) {
        this._connection = new Connection(config);
    }

    listFunctionWorkers(type: string = "all"){
        return this._connection.request(
            {
                method: "GET",
                path: "/_api/function",
                qs: type
            },
            res => res.body
        );
    }
}