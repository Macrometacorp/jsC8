import { expect } from "chai";
import { C8Client } from "../jsC8";
import { HttpError } from "../error";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating billing apis", function () {
  dotenv.config();
  this.timeout(60000);
  let c8Client: C8Client;

  beforeEach(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
  });

  const contactDetails: {
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
  } = {
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
    // To run tests with on billing endpoints we need to set up tenant name
    // We need to have a paid account to test this test cases
    const tenantName = "";

    if (tenantName.trim() !== "") {
      describe("if tenant exists", () => {
        it("billing.getAccountDetails", async () => {
          const response = await c8Client
            .billing(tenantName)
            .getAccountDetails();
          expect(response.data.tenant).to.equal(tenantName);
        });

        it("billing.updateAccountDetails", async () => {
          const response = await c8Client
            .billing(tenantName)
            .updateAccountDetails(contactDetails);
          expect(response).to.deep.equal({
            code: 200,
            error: false,
            data: contactDetails,
          });
        });

        it("billing.getPaymentDetailsOfPreviousMonths", async () => {
          const response = await c8Client
            .billing(tenantName)
            .getPaymentDetailsOfPreviousMonths(1);
          expect(response.code).to.equal(200);
        });

        it("billing.getInvoices", async () => {
          const response = await c8Client.billing(tenantName).getInvoices(1);
          expect(response.code).to.equal(200);
        });

        it("billing.getCurrentInvoices", async () => {
          const response = await c8Client
            .billing(tenantName)
            .getCurrentInvoices();
          expect(response.code).to.equal(200);
        });
        it("billing.getInvoiceOfSpecificMonthYear", async () => {
          const response = await c8Client
            .billing(tenantName)
            .getInvoiceOfSpecificMonthYear(2021, 6);
          expect(response.code).to.equal(200);
        });

        it("billing.getUsageOfTenant", async () => {
          const response = await c8Client
            .billing(tenantName)
            .getUsageOfTenant();
          expect(response.code).to.equal(200);
        });
        it("billing.getUsageOfTenantForSpecificRegion", async () => {
          const response = await c8Client
            .billing(tenantName)
            .getUsageOfTenantForSpecificRegion("ws");
          expect(response.code).to.equal(200);
        });
      });
    }

    describe("if tenant not exists", () => {
      const tenantName = "tenant_not_exist@test.com";

      it("billing.getAccountDetails", async () => {
        try {
          const response = await c8Client
            .billing(tenantName)
            .getAccountDetails();
          expect(response.data.tenant).to.equal(tenantName);
        } catch (err) {
          expect(err).is.instanceof(HttpError);
          expect(err).to.have.property("statusCode", 404);
        }
      });

      it("billing.updateAccountDetails", async () => {
        try {
          const response = await c8Client
            .billing(tenantName)
            .updateAccountDetails(contactDetails);
          expect(response).to.deep.equal({
            code: 200,
            error: false,
            data: null,
          });
        } catch (err) {
          expect(err).is.instanceof(HttpError);
          expect(err).to.have.property("statusCode", 404);
        }
      });

      it("billing.updatePaymentSettings", async () => {
        try {
          const response = await c8Client
            .billing(tenantName)
            .updatePaymentSettings("paymentMethodId");
          expect(response).to.deep.equal({
            code: 200,
            error: false,
            data: null,
          });
        } catch (err) {
          expect(err).is.instanceof(HttpError);
          expect(err).to.have.property("statusCode", 404);
        }
      });

      it("billing.getPaymentDetailsOfPreviousMonths", async () => {
        try {
          const response = await c8Client
            .billing(tenantName)
            .getPaymentDetailsOfPreviousMonths(1);
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
          const response = await c8Client
            .billing(tenantName)
            .getCurrentInvoices();
          expect(response.code).to.equal(200);
        } catch (err) {
          expect(err).is.instanceof(HttpError);
          expect(err).to.have.property("statusCode", 404);
        }
      });

      it("billing.getInvoiceOfSpecificMonthYear", async () => {
        try {
          const response = await c8Client
            .billing(tenantName)
            .getInvoiceOfSpecificMonthYear(2021, 6);
          expect(response.code).to.equal(200);
        } catch (err) {
          expect(err).is.instanceof(HttpError);
          expect(err).to.have.property("statusCode", 404);
        }
      });

      it("billing.getUsageOfTenant", async () => {
        try {
          const response = await c8Client
            .billing(tenantName)
            .getUsageOfTenant();
          expect(response.code).to.equal(200);
        } catch (err) {
          expect(err).is.instanceof(HttpError);
          expect(err).to.have.property("statusCode", 404);
        }
      });

      it("billing.getUsageOfTenantForSpecificRegion", async () => {
        try {
          const response = await c8Client
            .billing(tenantName)
            .getUsageOfTenantForSpecificRegion("ws");
          expect(response.code).to.equal(200);
        } catch (err) {
          expect(err).is.instanceof(HttpError);
          expect(err).to.have.property("statusCode", 400);
        }
      });
    });
  });
});
