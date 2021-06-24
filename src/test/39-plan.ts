import { expect } from "chai";
import { C8Client } from "../jsC8";
import { C8Error } from "../error";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating plan apis", function () {
    this.timeout(60000);

    let c8Client: C8Client;
    const testUrl: string = process.env.TEST_C8_URL || "https://test.macrometa.io";

    beforeEach(async () => {
        c8Client = new C8Client({
            url: testUrl,
            c8Version: C8_VERSION,
        });
        await c8Client.login("guest@macrometa.io", "guest");
        c8Client.useTenant("guest");
    });

    describe("Plan", () => {
        const planDetails = {
            name: "testPlan",
            planId: "planId",
            description: "description",
            featureGates: ["DOCS"],
            attribution: "attribution",
            label: "label",
            pricing: "10",
            isBundle: true,
            metadata: {
                key: "value",
            },
            metrics: [
                {
                    name: "name",
                    value: "value",
                    metricType: "metricType",
                },
            ],
            active: true,
            demo: true,
        };

        describe("plan.createPlan", () => {
            it("if tenant provides the valid data", async () => {
                const response = await c8Client.plan("").createPlan(planDetails);
                expect(response.name).to.equals(planDetails.name);
            });

            it("if tenant provides the invalid data", async () => {
                delete planDetails.active;
                try {
                    const response = await c8Client.plan("").createPlan(planDetails);
                    expect(response.name).to.equals(planDetails.name);
                } catch (err) {
                    expect(err).is.instanceof(C8Error);
                    expect(err).to.have.property("statusCode", 400);
                    expect(err).to.have.property("errorNum", 10);
                }
            });
        });

        it("plan.getListOfPlans", async () => {
            const response = await c8Client.plan("").getListOfPlans();
            const planDetail = response.find((res: any) => (res.name = planDetails.name));
            expect(planDetail.name).to.equals(planDetails.name);
        });

        describe("plan.getPlanDetails", () => {
            it("if plan exists", async () => {
                const response = await c8Client.plan(planDetails.name).getPlanDetails();
                expect(response.name).to.equals(planDetails.name);
            });

            it("if plan does not exists", async () => {
                try {
                    const response = await c8Client.plan("test-plan").getPlanDetails();
                    expect(response.name).to.equals(planDetails.name);
                } catch (err) {
                    expect(err).is.instanceof(C8Error);
                    expect(err).to.have.property("statusCode", 404);
                    expect(err).to.have.property("errorNum", 102004);
                }
            });
        });

        describe("plan.updatePlan", () => {
            it("if tenant provides the valid data to update", async () => {
                const newPlanDetails = { ...planDetails, description: "test-description" };
                const response = await c8Client.plan(planDetails.name).updatePlan(newPlanDetails);
                expect(response.description).to.equals(newPlanDetails.description);
            });

            it("if tenant provides the invalid data to update", async () => {
                try {
                    const newPlanDetails = { ...planDetails, description: "test-description" };
                    delete newPlanDetails.active;
                    const response = await c8Client.plan(planDetails.name).updatePlan(newPlanDetails);
                    expect(response.description).to.equals(newPlanDetails.description);
                } catch (err) {
                    expect(err).is.instanceof(C8Error);
                    expect(err).to.have.property("statusCode", 404);
                    expect(err).to.have.property("errorNum", 10);
                }
            });
        });

        describe("plan.deletePlan", () => {
            it("if plan exists", async () => {
                const response = await c8Client.plan(planDetails.name).deletePlan();
                expect(response.name).to.equals(planDetails.name);
            });

            it("if plan does not exists", async () => {
                try {
                    const response = await c8Client.plan("test-plan").deletePlan();
                    expect(response.name).to.equals(planDetails.name);
                } catch (err) {
                    expect(err).is.instanceof(C8Error);
                    expect(err).to.have.property("statusCode", 404);
                    expect(err).to.have.property("errorNum", 102004);
                }
            });
        });
    });
});
