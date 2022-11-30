import {Config, Connection} from "./connection";

export interface DeployParameters {
    type?: string;
    edgeWorkerName: string;
    queryWorkerName: string;
    environment?: string;
}

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

    deployQueryWorkerToEdgeWorker(
        parameters: DeployParameters
        ){
        return this._connection.request(
            {
                method: "GET",
                path: "/_api/function/generate",
                qs: parameters
            },
            res => res.body
        );
    }

    getFuctionWorkerInfo(functionName: string){
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/function/${functionName}`,
            },
            res => res.body
        );
    }

    getEdgeWorkerMetadata(){
        return this._connection.request(
            {
                method: "GET",
                path: "/_api/function/metadata",
            },
            res => res.body
        );
    }
}