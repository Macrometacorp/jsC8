import { expect } from "chai";
import { C8Client } from "../jsC8";
import { HttpError } from "../error";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating billing apis", function () {
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

    const contactDetails = {
        firstname: "test",
        lastname: "test",
        email: "test@email.com",
        phone: "1234567890",
        line1: "line1",
        line2: "line2",
        city: "city",
        state: "state",
        country: "country",
        zipcode: "zipcode",
    };

    describe("billing", () => {
        describe("if tenant exists", () => {
            const tenantName = "test_macrometa.com";

            it("billing.getAccountDetails", async () => {
                const response = await c8Client.billing(tenantName).getAccountDetails();
                expect(response.data.tenant).to.equal(tenantName);
            });

            it("billing.updateAccountDetails", async () => {
                const response = await c8Client.billing(tenantName).updateAccountDetails(contactDetails);
                expect(response).to.deep.equal({ code: 200, error: false, data: null });
            });

            it("billing.updatePaymentSettings", async () => {
                const response = await c8Client.billing(tenantName).updatePaymentSettings("paymentMethodId");
                expect(response).to.deep.equal({ code: 200, error: false, data: null });
            });

            it("billing.getPaymentDetailsOfPreviousMonths", async () => {
                const response = await c8Client.billing(tenantName).getPaymentDetailsOfPreviousMonths(1);
                expect(response.code).to.equal(200);
            });

            it("billing.getInvoices", async () => {
                const response = await c8Client.billing(tenantName).getInvoices(1);
                expect(response.code).to.equal(200);
            });

            it("billing.getCurrentInvoices", async () => {
                const response = await c8Client.billing(tenantName).getCurrentInvoices();
                expect(response.code).to.equal(200);
            });

            it("billing.getInvoiceOfSpecificMonthYear", async () => {
                const response = await c8Client.billing(tenantName).getInvoiceOfSpecificMonthYear(2021, 6);
                expect(response.code).to.equal(200);
            });

            it("billing.getUsageOfTenant", async () => {
                const response = await c8Client.billing(tenantName).getUsageOfTenant();
                expect(response.code).to.equal(200);
            });

            it("billing.getUsageOfTenantForSpecificRegion", async () => {
                const response = await c8Client.billing(tenantName).getUsageOfTenantForSpecificRegion("ws");
                expect(response.code).to.equal(200);
            });
        });

        describe("if tenant not exists", () => {
            const tenantName = "tenant_not_exist@test.com";

            it("billing.getAccountDetails", async () => {
                try {
                    const response = await c8Client.billing(tenantName).getAccountDetails();
                    expect(response.data.tenant).to.equal(tenantName);
                } catch (err) {
                    expect(err).is.instanceof(HttpError);
                    expect(err).to.have.property("statusCode", 404);
                }
            });

            it("billing.updateAccountDetails", async () => {
                delete contactDetails.zipcode;

                try {
                    const response = await c8Client.billing(tenantName).updateAccountDetails(contactDetails);
                    expect(response).to.deep.equal({ code: 200, error: false, data: null });
                } catch (err) {
                    expect(err).is.instanceof(HttpError);
                    expect(err).to.have.property("statusCode", 400);
                }
            });

            it("billing.updatePaymentSettings", async () => {
                try {
                    const response = await c8Client.billing(tenantName).updatePaymentSettings("paymentMethodId");
                    expect(response).to.deep.equal({ code: 200, error: false, data: null });
                } catch (err) {
                    expect(err).is.instanceof(HttpError);
                    expect(err).to.have.property("statusCode", 404);
                }
            });

            it("billing.getPaymentDetailsOfPreviousMonths", async () => {
                try {
                    const response = await c8Client.billing(tenantName).getPaymentDetailsOfPreviousMonths(1);
                    expect(response.code).to.equal(200);
                } catch (err) {
                    expect(err).is.instanceof(HttpError);
                    expect(err).to.have.property("statusCode", 404);
                }
            });

            it("billing.getInvoices", async () => {
                try {
                    const response = await c8Client.billing(tenantName).getInvoices(1);
                    expect(response.code).to.equal(200);
                } catch (err) {
                    expect(err).is.instanceof(HttpError);
                    expect(err).to.have.property("statusCode", 404);
                }
            });

            it("billing.getCurrentInvoices", async () => {
                try {
                    const response = await c8Client.billing(tenantName).getCurrentInvoices();
                    expect(response.code).to.equal(200);
                } catch (err) {
                    expect(err).is.instanceof(HttpError);
                    expect(err).to.have.property("statusCode", 404);
                }
            });

            it("billing.getInvoiceOfSpecificMonthYear", async () => {
                try {
                    const response = await c8Client.billing(tenantName).getInvoiceOfSpecificMonthYear(2021, 6);
                    expect(response.code).to.equal(200);
                } catch (err) {
                    expect(err).is.instanceof(HttpError);
                    expect(err).to.have.property("statusCode", 404);
                }
            });

            it("billing.getUsageOfTenant", async () => {
                try {
                    const response = await c8Client.billing(tenantName).getUsageOfTenant();
                    expect(response.code).to.equal(200);
                } catch (err) {
                    expect(err).is.instanceof(HttpError);
                    expect(err).to.have.property("statusCode", 404);
                }
            });

            it("billing.getUsageOfTenantForSpecificRegion", async () => {
                try {
                    const response = await c8Client.billing(tenantName).getUsageOfTenantForSpecificRegion("ws");
                    expect(response.code).to.equal(200);
                } catch (err) {
                    expect(err).is.instanceof(HttpError);
                    expect(err).to.have.property("statusCode", 404);
                }
            });
        });
    });
});
