import { Connection } from "./connection";

export interface AccountDetails {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export class Billing {
  protected _connection: Connection;
  protected tenantName: string;

  constructor(connection: Connection, tenantName: string) {
    this._connection = connection;
    this.tenantName = tenantName;
  }

  setResultCallback(callback: ((res: any) => void) | undefined) {
    this._connection.setResultCallback(callback);
  }

  getAccountDetails() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/billing/account",
        headers: { tenant: this.tenantName },
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  updateAccountDetails(accountDetails: AccountDetails) {
    return this._connection.request(
      {
        method: "PUT",
        path: "/_api/billing/contact",
        headers: { tenant: this.tenantName },
        body: accountDetails,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  updatePaymentSettings(paymentMethodId: string) {
    return this._connection.request(
      {
        method: "PUT",
        path: "/_api/billing/paymentsettings",
        headers: { tenant: this.tenantName },
        body: { payment_method_id: paymentMethodId },
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getPaymentDetailsOfPreviousMonths(limit?: number) {
    const qs: { [key: string]: any } = {};

    if (limit) {
      qs.limit = limit;
    }

    return this._connection.request(
      {
        method: "GET",
        path: `/_api/billing/payments`,
        headers: { tenant: this.tenantName },
        qs,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getInvoices(limit?: number) {
    const qs: { [key: string]: any } = {};

    if (limit) {
      qs.limit = limit;
    }

    return this._connection.request(
      {
        method: "GET",
        path: `/_api/billing/invoices`,
        qs,
        headers: { tenant: this.tenantName },
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getCurrentInvoices() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/billing/invoice/current",
        headers: { tenant: this.tenantName },
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getInvoiceOfSpecificMonthYear(year: number, month: number) {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/billing/invoices/${year}/${month}`,
        headers: { tenant: this.tenantName },
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getUsageOfTenant(startDate?: string, endDate?: string) {
    const qs: { [key: string]: any } = {};

    if (startDate) {
      qs.startDate = startDate;
    }

    if (endDate) {
      qs.endDate = endDate;
    }

    return this._connection.request(
      {
        method: "GET",
        path: "/_api/billing/usage",
        qs,
        headers: { tenant: this.tenantName },
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getUsageOfTenantForSpecificRegion(
    region: string,
    startDate?: string,
    endDate?: string
  ) {
    const qs: { [key: string]: any } = {};

    if (startDate && endDate) {
      qs.startDate = startDate;
      qs.endDate = endDate;
    }

    if (endDate) {
      qs.endDate = endDate;
    }

    return this._connection.request(
      {
        method: "GET",
        path: `/_api/billing/region/${region}/usage`,
        qs,
        headers: { tenant: this.tenantName },
        absolutePath: true,
      },
      (res) => res.body
    );
  }
}
