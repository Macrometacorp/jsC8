import { Connection } from "./connection";

type ModifyTenant = {
    active?: boolean;
    status?: string;
    metaData?: object;
}
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

    modifyTenant(modifyTenant: ModifyTenant) {
        return this._connection.request(
            {
                method: "PATCH",
                path: `/tenant/${this.name}`,
                absolutePath: true,
                body: {
                    ...modifyTenant
                }
            },
            res => res.body
        );
    }
}