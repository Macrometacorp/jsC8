import { expect } from "chai";
import { C8Client } from "../jsC8";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);


describe("validating plan apis", function () {
    this.timeout(60000);

    let c8Client: C8Client;
    const testUrl: string =
        process.env.TEST_C8_URL || "https://test.macrometa.io";

    beforeEach(async () => {
        c8Client = new C8Client({
            url: testUrl,
            c8Version: C8_VERSION
        });
        await c8Client.login("guest@macrometa.io", "guest");
        c8Client.useTenant("guest");
    });


    describe("Plan", () => {
        const planDetails = {
            name: "testPlan",
            planId: "planId",
            description: "description",
            featureGates: [
                "DOCS"
            ],
            attribution: "attribution",
            label: "label",
            pricing: "10",
            isBundle: true,
            metadata: {
                key: "value"
            },
            metrics: [
                {
                    name: "name",
                    value: "value",
                    metricType: "metricType"
                }
            ],
            active: true,
            demo: true
        }

        it('plan.createPlan', async () => {
            const response = await c8Client.plan("").createPlan(planDetails);
            expect(response.name).to.equals(planDetails.name);
        });

        it('plan.getListOfPlans', async () => {
            const response = await c8Client.plan("").getListOfPlans();
            const planDetail = response.find((res: any) => res.name = planDetails.name)
            expect(planDetail.name).to.equals(planDetails.name);
        });

        it('plan.getPlanDetails', async () => {
            const response = await c8Client.plan(planDetails.name).getPlanDetails();
            expect(response.name).to.equals(planDetails.name);
        });

        it('plan.updatePlan', async () => {
            const newPlanDetails = { ...planDetails, description: "test-description" }
            const response = await c8Client.plan(planDetails.name).updatePlan(newPlanDetails);
            expect(response.description).to.equals(newPlanDetails.description);
        });

        it('plan.deletePlan', async () => {
            const response = await c8Client.plan(planDetails.name).deletePlan();
            expect(response.name).to.equals(planDetails.name);
        });

    })

})