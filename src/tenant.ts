import { Connection } from "./connection";

export type ModifyTenant = {
  active?: boolean;
  status?: string;
  metadata?: object;
};

type ContactObj = {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
};

export type CreateTenant = {
  contact?: ContactObj;
  metadata?: object;
};

const defaultContactInfo = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
};

export class Tenant {
  _connection: Connection;
  name?: string;
  email: string;

  constructor(connection: Connection, email: string, tenantName?: string) {
    this._connection = connection;
    this.name = tenantName ? tenantName : email.replace("@", "_");
    this.email = email;
  }

  createTenant(
    passwd: string,
    plan: string,
    attribution: string,
    dcList: string,
    otherParams: CreateTenant
  ) {
    let { contact } = otherParams;

    dcList = Array.isArray(dcList) ? dcList.join(",") : dcList;
    contact = contact || defaultContactInfo;
    plan = plan.toUpperCase();
    attribution = `${attribution.charAt(0).toUpperCase()}${attribution.slice(
      1
    )}`;

    return this._connection.request(
      {
        method: "POST",
        path: "/_api/tenant",
        absolutePath: true,
        body: {
          email: this.email,
          passwd,
          plan,
          attribution,
          dcList,
          contact,
          ...otherParams,
        },
      },
      (res) => {
        this.name = res.body.tenant;
        return res.body;
      }
    );
  }

  dropTenant() {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/_api/tenant/${this.name}`,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getTenantEdgeLocations() {
    return this._connection.request(
      {
        method: "GET",
        path: `/datacenter/_tenant/${this.name}`,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  tenantDetails() {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/tenant/${this.name}`,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  modifyTenant(modifyTenant: ModifyTenant) {
    return this._connection.request(
      {
        method: "PATCH",
        path: `/_api/tenant/${this.name}`,
        absolutePath: true,
        body: {
          ...modifyTenant,
        },
      },
      (res) => res.body
    );
  }
}
