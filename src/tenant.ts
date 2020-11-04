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

    createTenant(passwd: string, dcList: string | string[], extra: object = {}) {
        return this._connection.request(
            {
                method: "POST",
                path: "/tenant",
                absolutePath: true,
                body: {
                    dcList: Array.isArray(dcList) ? dcList.join(',') : dcList,
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

    modifyTenant(passwd: string, fabricName='_system', extra={}) {
        return this._connection.request(
            {
                method: "PATCH",
                path: `/_fabric/${fabricName}/_api/user/${this.name}`,
                absolutePath: true,
                body: {
                    extra,
                    passwd,
                    active: true
                }
            },
            res => res.body
        );
    }
}