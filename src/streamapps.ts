import { Connection } from "./connection";

export class Streamapps {
    _connection: Connection;
    name: string;

    constructor(connection: Connection, appName: string) {
        this._connection = connection;
        this.name = appName
        
    }


}