import { expect } from "chai";
import { C8Client } from "../jsC8";
import User from "../user";
import { HttpError } from "../error";
import { getDCListString } from "../util/helper";

describe("User Management", function () {
  // create fabric takes 11s in a standard cluster
  this.timeout(20000);

  let client: C8Client;
  let name = `testdb${Date.now()}`;
  let dcList: string;
  const tenant = "guest";

  before(async () => {
    client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC
    });
    const response = await client.getAllEdgeLocations();
    dcList = getDCListString(response);
    await client.createFabric(name, ["root"], { dcList: dcList });
    client.useFabric(name);
  });

  after(() => {
    client.close();
  });

  describe("client.user", () => {
    it("creates a new user instance", () => {
      expect(client.user("testUser", "testUser@test.com")).to.be.instanceof(
        User
      );
    });
  });

  describe("user.create", () => {
    let user: User;

    it("creates a user", async () => {
      const userName = `user${Date.now()}`;
      const userEmail = `${userName}@test.com`;
      user = client.user(userName, userEmail);
      const response = await user.createUser("testPass");
      expect(response.error).to.be.false;
    });

    after(async () => {
      await user.deleteUser();
    });
  });

  describe("client.getAllUsers", () => {
    it("Lists all users", async () => {
      const response = await client.getAllUsers();
      expect(response.error).to.be.false;
    });
  });

  describe("user.crud_operations", () => {
    let user: User;
    beforeEach(async () => {
      const userName = `user${Date.now()}`;
      const userEmail = `${userName}@test.com`;
      user = client.user(userName, userEmail);
      await user.createUser("testPass");
    });

    afterEach(async () => {
      try {
        await user.deleteUser();
      } catch (error) { }
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
          active: false,
          passwd: "test_passwordddd"
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
        await client.createFabric(testFabricName, [user.user], {
          dcList: dcList
        });
        // client.useFabric(testFabricName);
      });

      afterEach(async () => {
        client.useFabric("_system");
        await client.dropFabric(testFabricName);
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
        await client.collection(collectionName).create();
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
        client.useFabric(testFabricName);
        const collectionName = `coll${Date.now()}`;
        await client.collection(collectionName).create();
        const response = await user.clearCollectionAccessLevel(
          testFabricName,
          collectionName
        );
        expect(response.error).to.be.false;
        expect(response.code).eq(202);
      });

      it.skip("Sets the access level of a collection in a database ", async () => {
        const collectionName = `coll${Date.now()}`;
        await client.collection(collectionName).create();
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
    describe("user collection access level", () => {
      const testFabricName = `testFabric${Date.now()}`;
      const collectionName = `testColle${Date.now()}`;

      beforeEach(async () => {
        await client.createFabric(testFabricName, [user.user], {
          dcList: dcList
        });
        // client.useFabric(testFabricName);
        await client.createCollection(collectionName);
      });

      afterEach(async () => {
        client.useFabric("_system");
        await client.deleteCollection(collectionName);
        await client.dropFabric(testFabricName);
      });

      describe("user.listAccessibleCollections", () => {
        it("list accessible collections", async () => {
          const response = await user.listAccessibleCollections(testFabricName);
          expect(response.error).to.be.false;
        });
      });

      describe("user.getCollectionAccessLevel", () => {
        it("get collection access level", async () => {
          const response = await user.getCollectionAccessLevel(testFabricName, collectionName);
          expect(response.error).to.be.false;
        });
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
            expect(err).to.have.property("errorMessage","invalid api key id");
        }
      });
    });

    describe("user.createUpdateUserAttributes", () => {
      it("Create or update user attributes", async () => {
        const response = await user.createUpdateUserAttributes({ name: "anurag" });
        expect(response.error).to.be.false;
      });

      it("user.createUpdateUserAttributes", async () => {
        try {
          const response = await user.createUpdateUserAttributes({ age:12 });
          expect(response.error).to.be.false;
        } catch (err) {
            expect(err).is.instanceof(HttpError);
            expect(err).to.have.property("code", 400);
            expect(err).to.have.property("errorMessage","Failed to parse JSON object. Error code: 17");
        }
      });
    });

    describe("user.deleteUserAttribute", () => {
      it("Delete a particular user attribute", async () => {
        const response = await user.deleteUserAttribute('name');
        expect(response.error).to.be.false;
      });

      it("user.deleteUserAttribute", async () => {
        try {
          const response = await user.deleteUserAttribute("attributId");
          expect(response.error).to.be.false;
        } catch (err) {
            expect(err).is.instanceof(HttpError);
            expect(err).to.have.property("code", 404);
            expect(err).to.have.property("errorMessage","invalid api key id");
        }
      });
    });
  });
});
