import { Connection } from "./connection";

export class Streamapps {
    _connection: Connection;
    name: string;

    constructor(connection: Connection, appName: string) {
        this._connection = connection;
        this.name = appName
        
    }

    retriveApplication(){
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/streamapps/${this.name}`,
            },
            res => res.body
        );
    }

    updateApplication(regions: Array<string>, appDefinition: string){
        return this._connection.request(
            {
                method: "PUT",
                path: `/_api/streamapps/${this.name}`,
                body: JSON.stringify({
                    "definition": appDefinition, 
                    "regions": regions,
                })
            },
            res => res.body
        );


    }

    deleteApplication():Promise<any>{
        return this._connection.request(
            {
                method: "DELETE",
                path: `/_api/streamapps/${this.name}`,
            },
            res => res.body
        );
        
    }

    activateStreamApplication(active: boolean){
        return this._connection.request(
            {
                method: "PATCH",
                path: `/_api/streamapps/${this.name}/active`,
                qs: {
                    active
                }
            },
            res => res.body
        );
    }

    query(query: string){
        return this._connection.request({
            method: "POST",
            path: `/_api/streamapps/query/${this.name}`,
            body: {
                "query": query
              }
        },
        res => res.body
      );
    }  


}