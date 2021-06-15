import { Connection } from "./connection";

interface Metrics {
    name: string,
    value: string,
    metricType: string
}

export interface PlanDetails {
    name: string,
    planId: string,
    description: string,
    featureGates: string[],
    attribution: string,
    label: string,
    pricing: string,
    isBundle: boolean,
    metadata: {
        key: string
    },
    metrics: Metrics[],
    active: boolean,
    demo: boolean
}

export interface UpdateTenantPlan {
    attribution: string,
    plan: string,
    tenant: string,
    payment_method_id?: string
}

export interface AccountDetails {
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    line1: string,
    line2: string,
    city: string,
    state: string,
    country: string,
    zipcode: string
}


export class Billing {
    protected _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
    }

    getListOfPlans() {
        return this._connection.request(
            {
                method: "GET",
                path: "/_api/plan",
            },
            (res) => res.body
        );
    }

    createPlan(planDetails: PlanDetails) {
        return this._connection.request(
            {
                method: "POST",
                path: "/_api/plan",
                body: planDetails
            },
            (res) => res.body
        );
    }

    deletePlan(planName: string) {
        return this._connection.request(
            {
                method: "DELETE",
                path: `/_api/plan/${planName}`,
            },
            (res) => res.body
        );
    }

    getPlanDetails(planName: string) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/plan/${planName}`,
            },
            (res) => res.body
        );
    }

    updatePlan(planName: string, planDetails: PlanDetails) {
        return this._connection.request(
            {
                method: "PATCH",
                path: `/_api/plan/${planName}`,
                body: planDetails
            },
            (res) => res.body
        );
    }

    updateTenantPlan(updateTenantPlan: UpdateTenantPlan) {
        return this._connection.request(
            {
                method: "POST",
                path: "/_api/plan/update",
                body: updateTenantPlan
            },
            (res) => res.body
        );
    }

    getAccountDetails(tenant: string) {
        return this._connection.request(
            {
                method: "GET",
                path: "/_api/billing/account",
                headers: { tenant },
                absolutePath: true
            },
            (res) => res.body
        );
    }

    updateAccountDetails(tenant: string, accountDetails: AccountDetails) {
        return this._connection.request(
            {
                method: "PUT",
                path: "/_api/billing/contact",
                headers: { tenant },
                body: accountDetails,
                absolutePath: true
            },
            (res) => res.body
        );
    }

    updatePaymentSettings(tenant: string, paymentMethodId: string) {
        return this._connection.request(
            {
                method: "PUT",
                path: "/_api/billing/paymentsettings",
                headers: { tenant },
                body: { payment_method_id: paymentMethodId },
                absolutePath: true
            },
            (res) => res.body
        );
    }

    getPaymentDetailsOfPreviousMonths(tenant: string, limit: number) {
        const qs: { [key: string]: any } = {};

        if (limit) {
            qs.limit = limit;
        }

        return this._connection.request(
            {
                method: "GET",
                path: `/_api/billing/payments`,
                headers: { tenant },
                qs,
                absolutePath: true
            },
            (res) => res.body
        );
    }

    getInvoices(tenant: string, limit: number) {
        const qs: { [key: string]: any } = {};

        if (limit) {
            qs.limit = limit;
        }

        return this._connection.request(
            {
                method: "GET",
                path: `/_api/billing/invoices`,
                qs,
                headers: { tenant },
                absolutePath: true
            },
            (res) => res.body
        );
    }

    getCurrentInvoices(tenant: string) {
        return this._connection.request(
            {
                method: "GET",
                path: "/_api/billing/invoice/current",
                headers: { tenant },
                absolutePath: true
            },
            (res) => res.body
        );
    }

    getInvoiceOfSpecificMonthYear(tenant: string, year: number, month: number) {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/billing/invoices/${year}/${month}`,
                headers: { tenant },
                absolutePath: true
            },
            (res) => res.body
        );
    }

    getUsageOfTenant(tenant: string, startDate?: string, endDate?: string) {
        const qs: { [key: string]: any } = {};

        if (startDate && endDate) {
            qs.startDate = startDate;
            qs.endDate = endDate;
        }

        return this._connection.request(
            {
                method: "GET",
                path: "/_api/billing/usage",
                qs,
                headers: { tenant },
                absolutePath: true
            },
            (res) => res.body
        );
    }

    getUsageOfTenantForSpecificRegion(tenant: string, region: string, startDate: string, endDate: string) {
        const qs: { [key: string]: any } = {};

        if (startDate && endDate) {
            qs.startDate = startDate;
            qs.endDate = endDate;
        }

        return this._connection.request(
            {
                method: "GET",
                path: `/_api/billing/region/${region}/usage`,
                qs,
                headers: { tenant },
                absolutePath: true
            },
            (res) => res.body
        );
    }

}