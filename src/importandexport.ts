import { Connection } from "./connection";

export class ImportAndExport {
    protected _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
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

    getDataByCollectionName(collectionName: string, offset?: number, limit?: number, order?: string) {
        const qs: { [key: string]: any } = {};

        if (offset) {
            qs.offset = offset;
        }

        if (limit) {
            qs.limit = limit;
        }

        if (order) {
            qs.order = order;
        }

        return this._connection.request(
            {
                method: "GET",
                path: `/_api/export/${collectionName}`,
                qs
            },
            (res) => res.body
        );
    }

    createDocuments(collectionName: string, data: string[], showErrors: boolean = false) {
        return this._connection.request(
            {
                method: "POST",
                path: `/_api/import/${collectionName}`,
                body: { data, details: showErrors }
            },
            (res) => res.body
        );
    }
}