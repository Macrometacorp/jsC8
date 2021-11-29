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

    exportDataByQuery(query: string, bindVars?: Record<string, any>) {
        return this._connection.request(
            {
                method: "POST",
                path: "/_api/export",
                body: { query, bindVars },
            },
            (res) => res.body
        );
    }

    exportDataByCollectionName(params?: CollectionParams) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/export/${this.collectionName}`,
                qs: params
            },
            (res) => res.body
        );
    }

    importDocuments(data: string[], showErrors: boolean = false, primaryKey: string, replace: boolean = false) {
        return this._connection.request(
            {
                method: "POST",
                path: `/_api/import/${this.collectionName}`,
                body: { data, details: showErrors, primaryKey, replace }
            },
            (res) => res.body
        );
    }
}
