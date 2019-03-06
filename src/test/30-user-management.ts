import { expect } from "chai";
import { Fabric } from "../jsC8";
import User from "../user";
// import { EdgeLocation, TenantListObj, TenantList } from '../fabric';

describe("User Management", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(20000);

  let fabric: Fabric;
  const testUrl: string =
    process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
    });
  });

  after(() => {
    fabric.close();
  });

  describe("fabric.user", () => {
    it("creates a new user instance", () => {
      expect(fabric.user("testUser")).to.be.instanceof(User);
    });
  });

  describe("user.create", () => {
    let user: User;

    it("creates a user", async () => {
      const userName = `user_${Date.now()}`;
      user = fabric.user(userName);
      const response = await user.createUser("test_pass");
      expect(response.error).to.be.false;
    });

    after(async () => {
      await user.deleteUser();
    });
  });

  describe("fabric.getAllUsers", () => {
    it("Lists all users", async () => {
      const response = await fabric.getAllUsers();
      console.log(response);
      expect(response.error).to.be.false;
    });
  });

  describe("user.crud_operations", () => {
    let user: User;
    beforeEach(async () => {
      user = fabric.user(`user_${Date.now()}`);
      const resp = await user.createUser("test_pass");
      console.log("user Created ==>>", resp);
    });

    describe("user.deleteUser", () => {
      it("Deletes a user", async () => {
        const response = await user.deleteUser();
        console.log("user deleted ==>>", response);
        expect(response.error).to.be.false;
      });
    });

    describe("fabric.getUser", () => {
      it("Fetches a user", async () => {
        const response = await fabric.getUser(user.user);
        console.log("Got User ==>>", response);
        expect(response.error).to.be.false;
      });
    });

    describe("user.modifyUser", () => {
      it("Modifies a user", async () => {
        const response = await user.modifyUser({
          active: false
        });
        console.log("user modified ==>>", response);
        expect(response.error).to.be.false;
        expect(response.active).to.be.false;
      });
    });

    describe("user.replaceUser", () => {
      it("Modifies a user", async () => {
        const response = await user.replaceUser({
          passwd: "test_passwordddd"
        });
        console.log("user modified ==>>", response);
        expect(response.error).to.be.false;
      });
    });
  });
});
