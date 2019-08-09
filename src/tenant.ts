import { Connection } from "./connection";

export class Tenant {

    _connection: Connection;
    name: string;

    constructor(connection: Connection, tenantName: string) {
        this._connection = connection;
        this.name = tenantName;
    }

    createTenant(passwd: string, extra: object = {}, dcList: string = "") {
        return this._connection.request(
            {
                method: "POST",
                path: "/tenant",
                absolutePath: true,
                body: {
                    dcList,
                    name: this.name,
                    passwd,
                    extra
                }
            },
            res => res.body
        );
    }

    dropTenant() {
        return this._connection.request(
            {
                method: "DELETE",
                path: `/tenant/${this.name}`,
                absolutePath: true
            },
            res => res.body
        );
    }

    getTenantEdgeLocations() {
        return this._connection.request(
            {
                method: "GET",
                path: `/datacenter/_tenant/${this.name}`,
                absolutePath: true
            },
            res => res.body
        )
    }

    tenantDetails() {
        return this._connection.request(
            {
                method: "GET",
                path: `/tenant/${this.name}`,
                absolutePath: true
            },
            res => res.body
        );
    }

    modifyTenant(passwd: string, extra?: object) {
        return this._connection.request(
            {
                method: "PATCH",
                path: `/tenant/${this.name}`,
                absolutePath: true,
                body: {
                    extra,
                    passwd
                }
            },
            res => res.body
        );
    }
}