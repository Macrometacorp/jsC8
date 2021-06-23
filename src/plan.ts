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
    demo?: boolean
}

export interface UpdateTenantPlan {
    attribution: string,
    plan: string,
    tenant: string,
    payment_method_id?: string
}

export class Plan {
    protected _connection: Connection;
    protected planName: string;

    constructor(connection: Connection, planName: string) {
        this._connection = connection;
        this.planName = planName;
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

    deletePlan() {
        return this._connection.request(
            {
                method: "DELETE",
                path: `/_api/plan/${this.planName}`,
            },
            (res) => res.body
        );
    }

    getPlanDetails() {
        return this._connection.request(
            {
                method: "GET",
                path: `/_api/plan/${this.planName}`,
            },
            (res) => res.body
        );
    }

    updatePlan(planDetails: PlanDetails) {
        return this._connection.request(
            {
                method: "PATCH",
                path: `/_api/plan/${this.planName}`,
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
}
