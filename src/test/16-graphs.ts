import { expect } from "chai";
import { C8Client } from "../jsC8";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("Graph API", function () {
  dotenv.config();
  let c8Client: C8Client;

  const graphName = "testGraph";
  const vertexCollection1 = "VertexCollection1";
  const vertexCollection2 = "VertexCollection2";
  const vertexCollection3 = "VertexCollection3";
  const edgeCollection1 = "EdgeCollection1";
  const edgeCollection2 = "EdgeCollection2";

  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });
    //Vertex
    await c8Client.createCollection(vertexCollection1);
    await c8Client.createCollection(vertexCollection2);
    await c8Client.createCollection(vertexCollection3);
    //Edge
    await c8Client.createCollection(edgeCollection1, {}, true);
    await c8Client.createCollection(edgeCollection2, {}, true);
  });
  after(async () => {
    // Delete the collections
    await c8Client.deleteCollection(vertexCollection1);
    await c8Client.deleteCollection(vertexCollection2);
    await c8Client.deleteCollection(vertexCollection3);
    await c8Client.deleteCollection(edgeCollection1);
    await c8Client.deleteCollection(edgeCollection2);
  });

  describe("graph", () => {
    describe("graph.create", () => {
      it("should create a graph", async () => {
        const response = await c8Client.createGraph(graphName, {
          edgeDefinitions: [
            {
              collection: edgeCollection1,
              from: [vertexCollection1],
              to: [vertexCollection2],
            },
          ],
        });
        expect(response).to.have.all.keys(
          "_key",
          "numberOfShards",
          "replicationFactor",
          "minReplicationFactor",
          "isSmart",
          "edgeDefinitions",
          "orphanCollections",
          "_rev",
          "_id",
          "name"
        );
        expect(response.name).to.equal(graphName);
      });
    });

    describe("graph.get", () => {
      it("should get a graph", async () => {
        const response = await c8Client.getGraph(graphName);
        expect(response).to.have.all.keys(
          "_key",
          "numberOfShards",
          "replicationFactor",
          "minReplicationFactor",
          "isSmart",
          "edgeDefinitions",
          "orphanCollections",
          "_rev",
          "_id",
          "name"
        );
        expect(response.name).to.equal(graphName);
      });
    });

    describe("graphs.get", () => {
      it("should get all graphs", async () => {
        const response = await c8Client.getGraphs();
        expect(response).to.be.an("array");
      });
    });

    describe("graph.exists", () => {
      it("should check if a graph exists", async () => {
        const response = await c8Client.hasGraph(graphName);
        expect(response).to.equal(true);
      });
    });
  });

  describe("vertex", () => {
    describe("vertex.listVertexCollections", () => {
      it("should list all vertex collections", async () => {
        const response = await c8Client.listVertexCollections(graphName);
        expect(response).to.be.an("array");
      });
    });

    describe("vertex.add", () => {
      it("should add vertex collection to graph", async () => {
        const response = await c8Client.addVertexCollection(
          graphName,
          vertexCollection3
        );
        expect(response).to.have.all.keys(
          "_key",
          "numberOfShards",
          "replicationFactor",
          "minReplicationFactor",
          "isSmart",
          "edgeDefinitions",
          "orphanCollections",
          "_rev",
          "_id",
          "name"
        );
      });
    });

    describe("vertex.remove", () => {
      it("should remove vertex collection to graph", async () => {
        const response = await c8Client.removeVertexCollection(
          graphName,
          vertexCollection3
        );
        expect(response).to.have.all.keys(
          "_key",
          "numberOfShards",
          "replicationFactor",
          "minReplicationFactor",
          "isSmart",
          "edgeDefinitions",
          "orphanCollections",
          "_rev",
          "_id",
          "name"
        );
      });
    });

    describe("vertex.create", () => {
      it("add vertex to vertex collection", async () => {
        const response = await c8Client.addVertexToVertexCollection(
          graphName,
          vertexCollection1,
          { _key: "T1", name: "Test1" }
        );
        expect(response).to.have.all.keys("error", "code", "vertex");
        expect(response.error).to.equal(false);
        expect(response.code).to.equal(202);
      });

      it("add vertex to vertex collection", async () => {
        const response = await c8Client.addVertexToVertexCollection(
          graphName,
          vertexCollection1,
          { _key: "T3", name: "Test3" },
          true
        );
        expect(response).to.have.all.keys("error", "code", "vertex", "new");
        expect(response.error).to.equal(false);
        expect(response.code).to.equal(202);
      });
    });
    describe("vertex.update", () => {
      it("update vertex in vertex collection", async () => {
        const response = await c8Client.addVertexToVertexCollection(
          graphName,
          vertexCollection1,
          { _key: "T2", name: "Test2" }
        );
        expect(response).to.have.all.keys("error", "code", "vertex");
        expect(response.error).to.equal(false);
        expect(response.code).to.equal(202);
      });
    });
    describe("vertex.get", () => {
      it("get vertex from vertex collection", async () => {
        const response = await c8Client.getVertexFromVertexCollection(
          graphName,
          vertexCollection1,
          { _key: "T2" }
        );
        expect(response).to.have.all.keys("_id", "_key", "_rev", "name");
        expect(response._id).to.equal("VertexCollection1/T2");
        expect(response._key).to.equal("T2");
        expect(response.name).to.equal("Test2");
      });
    });
    describe("vertex.replace", () => {
      it("replace vertex from vertex collection", async () => {
        const response = await c8Client.replaceVertexFromVertexCollection(
          graphName,
          vertexCollection1,
          { _key: "T2" },
          { name: "Test3" }
        );
        expect(response).to.have.all.keys("_id", "_key", "_rev", "_oldRev");
      });
    });
  });

  describe("edge", () => {
    describe("edge.getEdges", () => {
      it("should get all edges", async () => {
        const response = await c8Client.getEdges(graphName);
        expect(response).to.be.an("array");
      });
    });

    describe("edge.addEdgeDefinition", () => {
      it("should add edge definition", async () => {
        const response = await c8Client.insertEdge(graphName, {
          collection: edgeCollection2,
          from: [vertexCollection1],
          to: [vertexCollection2],
        });
        expect(response).to.have.all.keys(
          "_key",
          "numberOfShards",
          "replicationFactor",
          "minReplicationFactor",
          "isSmart",
          "edgeDefinitions",
          "orphanCollections",
          "_rev",
          "_id",
          "name"
        );
      });
    });

    describe("edge.removeEdgeDefinition", () => {
      it("should remove edge definition", async () => {
        const response = await c8Client.removeEdgeDefinition(
          graphName,
          edgeCollection2
        );
        expect(response).to.have.all.keys(
          "_key",
          "numberOfShards",
          "replicationFactor",
          "minReplicationFactor",
          "isSmart",
          "edgeDefinitions",
          "orphanCollections",
          "_rev",
          "_id",
          "name"
        );
      });
    });

    describe("edge.addEdgeToEdgeCollection", () => {
      it("should add edge to edge collection", async () => {
        await c8Client.addVertexToVertexCollection(
          graphName,
          vertexCollection2,
          { _key: "C2", name: "Test2" }
        );
        const response = await c8Client.addEdgeToEdgeCollection(
          graphName,
          edgeCollection1,
          {
            _key: "E1",
            _from: "VertexCollection1/T1",
            _to: "VertexCollection2/C2",
          }
        );
        expect(response).to.have.all.keys("error", "code", "edge");
        expect(response.error).to.equal(false);
        expect(response.code).to.equal(202);
      });
    });

    describe("edge.update", () => {
      it("should update edge in edge collection", async () => {
        const response = await c8Client.updateEdge(
          graphName,
          edgeCollection1,
          { _key: "E1" },
          { name: "Test3" }
        );
        expect(response).to.have.all.keys("_id", "_key", "_rev", "_oldRev");
      });
    });

    describe("edge.replace", () => {
      it("should replace edge in edge collection", async () => {
        await c8Client.addVertexToVertexCollection(
          graphName,
          vertexCollection1,
          { _key: "T4", name: "Test4" }
        );
        await c8Client.addVertexToVertexCollection(
          graphName,
          vertexCollection2,
          { _key: "C8", name: "Test8" }
        );
        const response = await c8Client.replaceEdge(
          graphName,
          edgeCollection1,
          { _key: "E1" },
          { _from: "VertexCollection1/T4", _to: "VertexCollection2/C8" }
        );
        expect(response).to.have.all.keys("_id", "_key", "_rev", "_oldRev");
      });
    });

    describe("edges.get", () => {
      it("should get edge from edge collection", async () => {
        const response = await c8Client.getEdge(graphName, edgeCollection1, {
          _key: "E1",
        });
        expect(response).to.have.all.keys(
          "_id",
          "_key",
          "_rev",
          "_from",
          "_to"
        );
      });
    });
  });

  describe("delete", () => {
    describe("edge.delete", () => {
      it("should delete edge from edge collection", async () => {
        const response = await c8Client.deleteEdge(graphName, edgeCollection1, {
          _key: "E1",
        });
        expect(response).to.equal(true);
      });
    });

    describe("vertex.delete", () => {
      it("should delete vertex from vertex collection", async () => {
        const response = await c8Client.removeVertexFromVertexCollection(
          graphName,
          vertexCollection1,
          { _key: "T1" }
        );
        expect(response).to.have.all.keys("error", "code", "removed");
        expect(response.code).to.equal(202);
        expect(response.error).to.equal(false);
        expect(response.removed).to.equal(true);
      });
    });

    describe("graph.delete", () => {
      it("should delete a graph", async () => {
        const response = await c8Client.deleteGraph(graphName, false);
        expect(response).to.equal(true);
      });
    });
  });
});
