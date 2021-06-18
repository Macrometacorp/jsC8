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

    setDefaultLimits(limitDetails: LimitsData) {
        return this._connection.request(
            {
                method: "PUT",
                path: "/_api/limits/defaults",
                absolutePath: true,
                body: limitDetails
            },
            (res) => res.body
        );
    }

    updateDefaultLimits(limitDetails: LimitsData) {
        return this._connection.request(
            {
                method: "PATCH",
                path: "/_api/limits/defaults",
                absolutePath: true,
                body: limitDetails
            },
            (res) => res.body
        );
    }

    deleteDefaultLimits() {
        return this._connection.request(
            {
                method: "DELETE",
                path: "/_api/limits/defaults",
                absolutePath: true,
            },
            (res) => res.body
        );
    }

    getDefaultLimitsByServiceName(serviceName: ServiceName) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/limits/defaults/${serviceName}`,
                absolutePath: true,
            },
            (res) => res.body
        );
    }

    getLimitsFlag() {
        return this._connection.request(
            {
                method: "GET",
                path: "/_api/limits/enable",
                absolutePath: true,
            },
            (res) => res.body
        );
    }

    enableLimitsFlag(value: boolean = true) {
        return this._connection.request(
            {
                method: "POST",
                path: "/_api/limits/enable",
                absolutePath: true,
                qs: { value }
            },
            (res) => res.body
        );
    }

}