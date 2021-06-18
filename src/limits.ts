import { Connection } from "./connection";

export class Limits {

    _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
    }

    getDefaultLimits() {
        return this._connection.request(
            {
                method: "GET",
                path: "/_api/limits/defaults",
                absolutePath: true,
            },
            (res) => res.body
        );
    }

}