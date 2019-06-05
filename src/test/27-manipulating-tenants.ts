import { expect } from "chai";
import { Fabric } from "../jsC8";
import { Tenant } from "../tenant";
import { EdgeLocation, TenantListObj, TenantList } from "../fabric";

describe("Manipulating tenants", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(20000);

  let fabric: Fabric;
  const testUrl: string =
    process.env.TEST_C8_URL || "https://test.macrometa.io";

  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
    });
    
  });
  

  after(() => {
    fabric.close();
  });

  describe("fabric.tenant", () => {
    it("creates a new tenant instance", () => {
      expect(fabric.tenant("testTenant")).to.be.instanceof(Tenant);
    });
    it("gets all tenants", async () => {
      const response = await fabric.listTenants();
      expect(response.error).to.be.false;
    });
  });

  describe("tenant.create", () => {
    let tenant: Tenant;
    let dcListUrls: string[];
    before(async () => {
      const tenantName: string = `testTenant${Date.now()}`;
      tenant = fabric.tenant(tenantName);
      const response = await fabric.getAllEdgeLocations();
      dcListUrls = response.map((elem: EdgeLocation) => elem.tags.url);
    });
    after(async () => {
      await tenant.dropTenant();
    });
    it("creates a tenant with the given name", async () => {
      const password = "1234";
      const response = await tenant.createTenant(password);
      expect(response.error).to.be.false;
    });
    it("tenant gets replicated", done => {
      const promises: Promise<TenantList>[] = [];
      const fabrics: any = [];
      dcListUrls.forEach(url => {
        const newFabric = new Fabric({
          url: `https://${url}`,
          c8Version: Number(process.env.C8_VERSION || 30400)
        });
        fabrics.push(newFabric);
        promises.push(newFabric.listTenants());
      });
      Promise.all(promises).then(tenants => {
        for (let i = 0; i < tenants.length; ++i) {
          const elem = tenants[i].result.find(
            (ten: TenantListObj) => ten.tenant === tenant.name
          );
          expect(elem).to.be.not.equal(undefined);
          fabrics[i].close();
        }
        done();
      });
    });
  });

  describe("tenant.dropTenant", () => {
    let tenant: Tenant;
    beforeEach(async () => {
      const password = "1234";
      const tenantName = `testTenant${Date.now()}`;
      tenant = fabric.tenant(tenantName);
      await tenant.createTenant(password);
    });
    it("deletes the given tenant from the server", async () => {
      await tenant.dropTenant();
      try {
        await tenant.tenantDetails();
      } catch (e) {
        return;
      }
      expect.fail("should not succeed");
    });
  });

  describe("tenant.tenantDetails", () => {
    let tenant: Tenant;
    before(async () => {
      const tenantName: string = `testTenant${Date.now()}`;
      tenant = fabric.tenant(tenantName);
      const password = "1234";
      await tenant.createTenant(password);
    });

    after(async () => {
      await tenant.dropTenant();
    });

    it("gets tenant details", async () => {
      const response = await tenant.tenantDetails();
      expect(response.error).to.be.false;
    });
  });

  describe("tenant.modifyTenant", () => {
    let tenant: Tenant;
    before(async () => {
      const tenantName: string = `testTenant${Date.now()}`;
      tenant = fabric.tenant(tenantName);
      const password = "1234";
      await tenant.createTenant(password);
    });

    after(async () => {
      await tenant.dropTenant();
    });

    it("modifies tenant", async () => {
      const newPassword = "54321";
      const response = await tenant.modifyTenant(newPassword);
      expect(response.error).to.be.false;
    });
  });
});
