import { Connection } from "./connection";

export type validateApiKeyHandle = {
    apikey?: string;
    jwt?: string;
}

export type ApiKeyAttributesType = {
    [key:string]: string;
}

export class ApiKeys {
    private _connection: Connection;
    keyid: string;
    dbName: string;

    constructor(connection: Connection, keyid: string = "", dbName: string = "") {
        this._connection = connection;
        this.keyid = keyid;
        this.dbName = dbName;
    }

    validateApiKey(data: validateApiKeyHandle) {
        return this._connection.request(
            {
                method: "POST",
                path: "/_api/key/validate",
                body: data
            },
            (res) => res.body
        );
    }

    createApiKey() {
        return this._connection.request(
            {
                method: "POST",
                path: "/_api/key",
                body: {
                    keyid: this.keyid
                }
            },
            (res) => res.body
        );
    }

    getAvailableApiKeys() {
        return this._connection.request(
            {
                method: "GET",
                path: "/_api/key",
            },
            (res) => res.body
        );
    }

    getAvailableApiKey() {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/key/${this.keyid}`,
            },
            (res) => res.body
        );
    }

    removeApiKey() {
        return this._connection.request(
            {
                method: "DELETE",
                path: `/_api/key/${this.keyid}`,
            },
            (res) => res.body
        );
    }

    //---------------- database access level ----------------

    listAccessibleDatabases(full: boolean = false) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/key/${this.keyid}/database`,
                qs: {
                    full
                }
            },
            (res) => res.body
        );
    }

    getDatabaseAccessLevel() {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/key/${this.keyid}/database/${this.dbName}`,
            },
            (res) => res.body
        );
    }

    clearDatabaseAccessLevel() {
        return this._connection.request(
            {
                method: "DELETE",
                path: `/_api/key/${this.keyid}/database/${this.dbName}`,
            },
            (res) => res.body
        );
    }

    setDatabaseAccessLevel(permission: "rw" | "ro" | "none") {
        return this._connection.request(
            {
                method: "PUT",
                path: `/_api/key/${this.keyid}/database/${this.dbName}`,
                body: {
                    grant: permission
                }
            },
            (res) => res.body
        );
    }
    //---------------- Collection access level ----------------

    listAccessibleCollections(full: boolean = false) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/key/${this.keyid}/database/${this.dbName}/collection`,
                qs: {
                    full
                }
            },
            (res) => res.body
        );
    }

    getCollectionAccessLevel(collectionName: string) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/key/${this.keyid}/database/${this.dbName}/collection/${collectionName}`,
            },
            (res) => res.body
        );
    }

    clearCollectionAccessLevel(collectionName: string) {
        return this._connection.request(
            {
                method: "DELETE",
                path: `/_api/key/${this.keyid}/database/${this.dbName}/collection/${collectionName}`,
            },
            (res) => res.body
        );
    }

    setCollectionAccessLevel(collectionName: string, permission: "rw" | "ro" | "none") {
        return this._connection.request(
            {
                method: "PUT",
                path: `/_api/key/${this.keyid}/database/${this.dbName}/collection/${collectionName}`,
                body: {
                    grant: permission
                }
            },
            (res) => res.body
        );
    }

    //---------------- Stream access level ----------------

    listAccessibleStreams(full: boolean = false) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/key/${this.keyid}/database/${this.dbName}/stream`,
                qs: {
                    full
                }
            },
            (res) => res.body
        );
    }

    getStreamAccessLevel(streamName: string) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/key/${this.keyid}/database/${this.dbName}/stream/${streamName}`,
            },
            (res) => res.body
        );
    }

    clearStreamAccessLevel(streamName: string) {
        return this._connection.request(
            {
                method: "DELETE",
                path: `/_api/key/${this.keyid}/database/${this.dbName}/stream/${streamName}`,
            },
            (res) => res.body
        );
    }

    setStreamAccessLevel(streamName: string, permission: "rw" | "ro" | "none") {
        return this._connection.request(
            {
                method: "PUT",
                path: `/_api/key/${this.keyid}/database/${this.dbName}/stream/${streamName}`,
                body: {
                    grant: permission
                }
            },
            (res) => res.body
        );
    }

    //---------------- Billing access level ----------------

    getBillingAccessLevel() {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/key/${this.keyid}/billing`,
            },
            (res) => res.body
        );
    }

    clearBillingAccessLevel() {
        return this._connection.request(
            {
                method: "DELETE",
                path: `/_api/key/${this.keyid}/billing`,
            },
            (res) => res.body
        );
    }

    setBillingAccessLevel(permission: "rw" | "ro" | "none") {
        return this._connection.request(
            {
                method: "PUT",
                path: `/_api/key/${this.keyid}/billing`,
                body: {
                    grant: permission
                }
            },
            (res) => res.body
        );
    }

     //---------------- ApiKey attributes ----------------


    getApikeyAttributes() {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/key/${this.keyid}/attributes`,
            },
            (res) => res.body
        );
    }

    createUpdateApikeyAttributes(data:ApiKeyAttributesType) {
        return this._connection.request(
            {
                method: "PUT",
                path: `/_api/key/${this.keyid}/attributes`,
                body:data
            },
            (res) => res.body
        );
    }

    deleteApikeyAttribute(attributeId: string) {
       return this._connection.request(
            {
                method: "DELETE",
                path: `/_api/key/${this.keyid}/attributes/${attributeId}`,
            },
            (res) => res.body
        );
    }

}
