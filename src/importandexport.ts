import { Connection } from "./connection";

export interface CollectionParams {
    offset?: number;
    limit?: number;
    order?: string;
}

export class ImportAndExport {
    protected _connection: Connection;
    protected collectionName: string;

    constructor(connection: Connection, collectionName: string) {
        this._connection = connection;
        this.collectionName = collectionName;
    }

    getDataByQuery(query: string) {
        return this._connection.request(
            {
                method: "POST",
                path: "/_api/export",
                body: { query },
            },
            (res) => res.body
        );
    }

    getDataByCollectionName(params: CollectionParams) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/export/${this.collectionName}`,
                qs: params
            },
            (res) => res.body
        );
    }

    createDocuments(data: string[], showErrors: boolean = false) {
        return this._connection.request(
            {
                method: "POST",
                path: `/_api/import/${this.collectionName}`,
                body: { data, details: showErrors }
            },
            (res) => res.body
        );
    }
}