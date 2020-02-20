import { Connection } from "./connection ";

export class Streamapps {
    constructor(connection: Connection, appName: string) {
        this._connection = connection;
        this.name = appName
        
    }

    create(regions: Array<string>, appDefinition: string){
        return this.connection.requst(
            {
                method: "POST",
                path: "/streamapps",
                body: {
                    name: this.name,
                    regions,
                    appDefinition, 
                }
            },
            res => res.body
        );
    }
}