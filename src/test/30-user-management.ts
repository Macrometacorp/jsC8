import { expect } from "chai";
import { C8Client } from "../jsC8";
import User from "../user";
import { C8Error } from "../error";
import { HttpError } from "../error";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("User Management", function() {
  // create fabric takes 11s in a standard cluster
  dotenv.config();
  this.timeout(100000);
  let c8Client: C8Client;
  let dcList: string;

  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });

    const response = await c8Client.getAllEdgeLocations();
    dcList = getDCListString(response);
  });

  after(() => {
    c8Client.close();
  });

  describe("fabric.user", () => {
    it("creates a new user instance", () => {
      expect(c8Client.user("testUser", "testUser@test.com")).to.be.instanceof(
        User
      );
    });
  });

  describe("user.create", () => {
    let user: User;
    let generatedUserId = "";

    it("creates a user", async () => {
      const userName = `user${Date.now()}`;
      const userEmail = `${userName}@test.com`;
      user = c8Client.user(userName, userEmail);
      const response = await user.createUser("Test1234!");
      generatedUserId = response.user;
      expect(response.error).to.be.false;
    });

    after(async () => {
      user.user = generatedUserId;
      await user.deleteUser();
    });
  });

  describe("fabric.getAllUsers", () => {
    it("Lists all users", async () => {
      const response = await c8Client.getAllUsers();
      expect(response.error).to.be.false;
    });
  });

  describe("user.crud_operations", () => {
    let user: User;
    let generatedUserId = "";
    beforeEach(async () => {
      const userName = `user${Date.now()}`;
      const userEmail = `${userName}@test.com`;
      user = c8Client.user(userName, userEmail);

      const response = await user.createUser("Test1234!");
      generatedUserId = response.user;
    });

    afterEach(async () => {
      try {
        user.user = generatedUserId;
        await user.deleteUser();
      } catch (error) {}
    });

    describe("user.getUserDetails", () => {
      it("Fetches a user", async () => {
        user.user = generatedUserId;
        const response = await user.getUserDeatils();
        expect(response.error).to.be.false;
      });
    });

    describe("user.modifyUser", () => {
      it("Modifies a user", async () => {
        user.user = generatedUserId;
        const response = await user.modifyUser({
          active: false,
          passwd: "Test1234!",
        });
        expect(response.error).to.be.false;
        expect(response.active).to.be.false;
      });
    });

    //Depricated
    // describe("user.replaceUser", () => {
    //   it("Modifies a user", async () => {
    //     user.user = generatedUserId;
    //     const response = await user.replaceUser({
    //       passwd: "Test1234!"
    //     });
    //     expect(response.error).to.be.false;
    //   });
    // });
    describe("User.FabricAccessOperations", () => {
      const testFabricName = `testFabric${Date.now()}`;

      beforeEach(async () => {
        user.user = generatedUserId;
        await c8Client.createFabric(testFabricName, [user.user], {
          dcList: dcList,
        });
        // fabric.useFabric(testFabricName);
      });

      afterEach(async () => {
        //c8Client.useFabric("_system");
        await c8Client.dropFabric(testFabricName);
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

      it("Clears the access level of a database ", async () => {
        const response = await user.clearDatabaseAccessLevel(testFabricName);
        expect(response.error).to.be.false;
        expect(response.code).eq(202);
      });

      it("Sets the access level of a database", async () => {
        const response = await user.setDatabaseAccessLevel(
          testFabricName,
          "ro"
        );
        expect(response.error).to.be.false;
        expect(response.code).eq(200);
        expect(response[testFabricName]).eq("ro");
      });
    });
    describe("user collection access level", () => {
      const testFabricName = `testFabric${Date.now()}`;
      const collectionName = `testColle${Date.now()}`;

      beforeEach(async () => {
        user.user = generatedUserId;
        await c8Client.createFabric(testFabricName, [user.user], {
          dcList: dcList,
        });
        // fabric.useFabric(testFabricName);
        c8Client.useFabric(testFabricName);
        await c8Client.createCollection(collectionName);
      });

      afterEach(async () => {
        await c8Client.deleteCollection(collectionName);
        c8Client.useFabric("_system");
        await c8Client.dropFabric(testFabricName);
      });

      describe("user.listAccessibleCollections", () => {
        it("list accessible collections", async () => {
          const response = await user.listAccessibleCollections(testFabricName);
          expect(response.error).to.be.false;
        });
      });

      describe("user.getCollectionAccessLevel", () => {
        it("get collection access level", async () => {
          await new Promise(r => setTimeout(r, 1000));
          const response = await user.getCollectionAccessLevel(
            testFabricName,
            collectionName
          );
          expect(response.error).to.be.false;
        });
      });

      it("Clears the access level of a collection in a database ", async () => {
        const response = await user.clearCollectionAccessLevel(
          testFabricName,
          collectionName
        );
        expect(response.error).to.be.false;
        expect(response.code).eq(202);
      });

      it("Sets the access level of a collection in a database ", async () => {
        const response = await user.setCollectionAccessLevel(
          testFabricName,
          collectionName,
          "ro"
        );
        expect(response.error).to.be.false;
        expect(response.code).eq(200);
        expect(response[`${testFabricName}/${collectionName}`]).eq("ro");
      });
    });

    describe("user.getUserAttributes", () => {
      it("Get user attributes", async () => {
        const response = await user.getUserAttributes();
        expect(response.error).to.be.false;
      });

      it("user.getUserAttributes", async () => {
        try {
          const response = await user.getUserAttributes();
          expect(response.error).to.be.false;
        } catch (err) {
          expect(err).is.instanceof(HttpError);
          expect(err).to.have.property("code", 404);
          expect(err).to.have.property("errorMessage", "invalid api key id");
        }
      });
    });

    describe("user.createUpdateUserAttributes", () => {
      it("Create or update user attributes", async () => {
        user.user = generatedUserId;
        const response = await user.createUpdateUserAttributes({
          name: "testUser",
        });
        expect(response.error).to.be.false;
      });

      it("user.createUpdateUserAttributes", async () => {
        try {
          user.user = generatedUserId;
          const response = await user.createUpdateUserAttributes({ age: 12 });
          expect(response.error).to.be.false;
        } catch (err) {
          expect(err).is.instanceof(C8Error);
          expect(err).to.have.property("code", 400);
          expect(err).to.have.property(
            "message",
            "Failed to parse JSON object. Error code: 17"
          );
        }
      });
    });

    describe("user.deleteUserAttribute", () => {
      it("Delete a particular user attribute", async () => {
        user.user = generatedUserId;
        await user.createUpdateUserAttributes({ name: "testUser" });
        const response = await user.deleteUserAttribute("testUser");
        expect(response.error).to.be.false;
      });

      it("user.deleteUserAttribute", async () => {
        try {
          user.user = generatedUserId;
          const response = await user.deleteUserAttribute("attributId");
          expect(response.error).to.be.false;
        } catch (err) {
          expect(err).is.instanceof(C8Error);
          expect(err).to.have.property("code", 404);
          expect(err).to.have.property("message", "user not found");
        }
      });
    });
  });
});
