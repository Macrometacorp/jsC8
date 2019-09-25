import { Connection } from "./connection";

export class Tenant {

    _connection: Connection;
    name?: string;
    email: string;

    constructor(connection: Connection, email: string, tenantName?: string) {
        this._connection = connection;
        this.name = tenantName;
        this.email = email;
    }

    createTenant(passwd: string, extra: object = {}, dcList: string = "") {
        return this._connection.request(
            {
                method: "POST",
                path: "/tenant",
                absolutePath: true,
                body: {
                    dcList,
                    email: this.email,
                    passwd,
                    extra
                }
            },
            res => {
                this.name = res.body.tenant;
                return res.body;
            }
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