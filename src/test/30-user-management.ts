import { expect } from "chai";
import { Fabric } from "../jsC8";
import User from "../user";
import { getDCListString } from "../util/helper";

describe("User Management", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(20000);

  let fabric: Fabric;
  let dcList: string;
  const testUrl: string =
    process.env.TEST_C8_URL || "https://test.macrometa.io";
  const tenant = "guest";
  
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
    });

    await fabric.login("guest@macrometa.io", "guest");
    fabric.useTenant(tenant);

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);
  });

  after(() => {
    fabric.close();
  });

  describe("fabric.user", () => {
    it("creates a new user instance", () => {
      expect(fabric.user("testUser", "testUser@test.com")).to.be.instanceof(
        User
      );
    });
  });

  describe("user.create", () => {
    let user: User;

    it("creates a user", async () => {
      const userName = `user${Date.now()}`;
      const userEmail = `${userName}@test.com`;
      user = fabric.user(userName, userEmail);
      const response = await user.createUser("testPass");
      expect(response.error).to.be.false;
    });

    after(async () => {
      await user.deleteUser();
    });
  });

  describe("fabric.getAllUsers", () => {
    it("Lists all users", async () => {
      const response = await fabric.getAllUsers();
      expect(response.error).to.be.false;
    });
  });

  describe("user.crud_operations", () => {
    let user: User;
    beforeEach(async () => {
      const userName = `user${Date.now()}`;
      const userEmail = `${userName}@test.com`;
      user = fabric.user(userName, userEmail);
      await user.createUser("testPass");
    });

    afterEach(async () => {
      try {
        await user.deleteUser();
      } catch (error) {}
    });

    describe("user.deleteUser", () => {
      it("Deletes a user", async () => {
        const response = await user.deleteUser();
        expect(response.error).to.be.false;
      });
    });

    describe("user.getUserDetails", () => {
      it("Fetches a user", async () => {
        const response = await user.getUserDeatils();
        expect(response.error).to.be.false;
      });
    });

    describe("user.modifyUser", () => {
      it("Modifies a user", async () => {
        const response = await user.modifyUser({
          active: false
        });
        expect(response.error).to.be.false;
        expect(response.active).to.be.false;
      });
    });

    describe("user.replaceUser", () => {
      it("Modifies a user", async () => {
        const response = await user.replaceUser({
          passwd: "test_passwordddd"
        });
        expect(response.error).to.be.false;
      });
    });
    describe("User.FabricAccessOperations", () => {
      const testFabricName = `testFabric${Date.now()}`;

      beforeEach(async () => {
        await fabric.createFabric(testFabricName, [{ username: user.user }], {
          dcList: dcList
        });
        // fabric.useFabric(testFabricName);
      });

      afterEach(async () => {
        fabric.useFabric("_system");
        await fabric.dropFabric(testFabricName);
      });

      it("Lists the accessible databases and their permissions ", async () => {
        const response = await user.getAllDatabases();
        expect(response.error).to.be.false;
        expect(response.result[testFabricName]).to.exist;
        expect(response.result[testFabricName].collections).not.exist;
      });

      it("Lists the accessible databases and their permissions with all the collections", async () => {
        const response = await user.getAllDatabases(true);
        expect(response.error).to.be.false;
        expect(response.result[testFabricName]).to.exist;
        expect(response.result[testFabricName].collections).to.exist;
      });

      it("Gets the access level of a database ", async () => {
        const response = await user.getDatabaseAccessLevel(testFabricName);
        expect(response.error).to.be.false;
        expect(response.result).to.be.oneOf(["rw", "ro", "none"]);
      });

      it("Gets the access level of a collection in a database ", async () => {
        const collectionName = `coll${Date.now()}`;
        await fabric.collection(collectionName).create();
        const response = await user.getCollectionAccessLevel(
          testFabricName,
          collectionName
        );
        expect(response.error).to.be.false;
      });

      it("Clears the access level of a database ", async () => {
        const response = await user.clearDatabaseAccessLevel(testFabricName);
        expect(response.error).to.be.false;
        expect(response.code).eq(202);
      });

      it.skip("Clears the access level of a collection in a database ", async () => {
        fabric.useFabric(testFabricName);
        const collectionName = `coll${Date.now()}`;
        await fabric.collection(collectionName).create();
        const response = await user.clearCollectionAccessLevel(
          testFabricName,
          collectionName
        );
        expect(response.error).to.be.false;
        expect(response.code).eq(202);
      });

      it.skip("Sets the access level of a collection in a database ", async () => {
        const collectionName = `coll${Date.now()}`;
        await fabric.collection(collectionName).create();
        const response = await user.setCollectionAccessLevel(
          testFabricName,
          collectionName,
          "ro"
        );
        expect(response.error).to.be.false;
        expect(response.code).eq(200);
        expect(response[`${testFabricName}/${collectionName}`]).eq("ro");
      });

      it("Sets the access level of a database", async () => {
        const response = await user.setDatabaseAccessLevel(
          testFabricName,
          "ro"
        );
        expect(response.error).to.be.false;
        expect(response.code).eq(200);
        expect(response[`${tenant}.${testFabricName}`]).eq("ro");
      });
    });
  });
});
