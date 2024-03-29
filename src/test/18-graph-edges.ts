import { expect } from "chai";
import { C8Client } from "../jsC8";
import { Graph } from "../graph";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

// Works only with global MM api key
describe("Manipulating graph edges", function () {
  dotenv.config();
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);
  let c8Client: C8Client;

  const dbName = `testdb${Date.now()}`;

  let dcList: string;
  const graphName = `testgraph${Date.now()}`;
  let graph: Graph;
  before(async () => {
    c8Client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
      c8Version: C8_VERSION,
    });

    const response = await c8Client.getAllEdgeLocations();
    dcList = getDCListString(response);

    await c8Client.createFabric(dbName, ["root"], {
      dcList: dcList,
    });
    c8Client.useFabric(dbName);
  });
  after(async () => {
    try {
      c8Client.useFabric("_system");
      await c8Client.dropFabric(dbName);
    } finally {
      c8Client.close();
    }
  });
  beforeEach((done) => {
    graph = c8Client.graph(graphName);
    graph
      .create({
        edgeDefinitions: [
          {
            collection: "knows",
            from: ["person"],
            to: ["person"],
          },
        ],
      })
      .then(() => void done())
      .catch(done);
  });
  afterEach((done) => {
    graph
      .drop()
      .then(() => void done())
      .catch(done);
  });
  describe("graph.get", () => {
    it("should return information about the graph", (done) => {
      graph
        .get()
        .then((info) => {
          expect(info).to.have.property("name", graphName);
          expect(info).to.have.property("edgeDefinitions");
          expect(info.edgeDefinitions).to.be.instanceOf(Array);
          expect(info.edgeDefinitions.length).to.equal(1);
          expect(info.edgeDefinitions.map((e: any) => e.collection)).to.contain(
            "knows"
          );
          const edgeDefinition = info.edgeDefinitions.filter(
            (e: any) => e.collection === "knows"
          );
          expect(
            [].concat.apply(
              [],
              edgeDefinition.map((e: any) => e.from)
            )
          ).to.contain("person");
          expect(
            [].concat.apply(
              [],
              edgeDefinition.map((e: any) => e.to)
            )
          ).to.contain("person");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("graph.edgeCollections", () => {
    it("should contain edge collection", (done) => {
      graph
        .edgeCollections()
        .then((info) => {
          expect(info).to.be.instanceOf(Array);
          expect(info.length).to.equal(1);
          expect(info.map((c: any) => c.name)).to.contain("knows");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("graph.listEdgeCollections", () => {
    it("should return all edge collection names", (done) => {
      graph
        .listEdgeCollections()
        .then((info) => {
          expect(info).to.be.instanceOf(Array);
          expect(info.length).to.equal(1);
          expect(info).to.contain("knows");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("graph.listVertexCollections", () => {
    it("should return all vertex collection names", (done) => {
      graph
        .listVertexCollections()
        .then((info) => {
          expect(info).to.be.instanceOf(Array);
          expect(info.length).to.equal(1);
          expect(info).to.contain("person");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("graph.addEdgeDefinition", () => {
    it("should add an edgeDefinition to the graph", (done) => {
      graph
        .addEdgeDefinition({
          collection: "works_in",
          from: ["person"],
          to: ["city"],
        })
        .then((info) => {
          expect(info).to.have.property("name", graphName);
          expect(info).to.have.property("edgeDefinitions");
          expect(info.edgeDefinitions).to.be.instanceOf(Array);
          expect(info.edgeDefinitions.length).to.equal(2);
          expect(info.edgeDefinitions.map((e: any) => e.collection)).to.contain(
            "works_in"
          );
          const edgeDefinition = info.edgeDefinitions.filter(
            (e: any) => e.collection === "works_in"
          );
          expect(
            [].concat.apply(
              [],
              edgeDefinition.map((e: any) => e.from)
            )
          ).to.contain("person");
          expect(
            [].concat.apply(
              [],
              edgeDefinition.map((e: any) => e.to)
            )
          ).to.contain("city");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("graph.replaceEdgeDefinition", () => {
    it("should replace an existing edgeDefinition in the graph", (done) => {
      graph
        .replaceEdgeDefinition("knows", {
          collection: "knows",
          from: ["person"],
          to: ["city"],
        })
        .then((info) => {
          expect(info).to.have.property("name", graphName);
          expect(info).to.have.property("edgeDefinitions");
          expect(info.edgeDefinitions).to.be.instanceOf(Array);
          expect(info.edgeDefinitions.length).to.equal(1);
          expect(info.edgeDefinitions.map((e: any) => e.collection)).to.contain(
            "knows"
          );
          const edgeDefinition = info.edgeDefinitions.filter(
            (e: any) => e.collection === "knows"
          );
          expect(
            [].concat.apply(
              [],
              edgeDefinition.map((e: any) => e.from)
            )
          ).to.contain("person");
          expect(
            [].concat.apply(
              [],
              edgeDefinition.map((e: any) => e.to)
            )
          ).to.contain("city");
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe("graph.removeEdgeDefinition", () => {
    it("should remove an edgeDefinition from the graph", (done) => {
      graph
        .removeEdgeDefinition("knows")
        .then((info) => {
          expect(info).to.have.property("name", graphName);
          expect(info).to.have.property("edgeDefinitions");
          expect(info.edgeDefinitions).to.be.instanceOf(Array);
          expect(info.edgeDefinitions.length).to.equal(0);
        })
        .then(() => done())
        .catch(done);
    });
  });
  // describe("graph.traversal", () => {
  //   beforeEach(done => {
  //     const knows = graph.edgeCollection("knows");
  //     const person = graph.vertexCollection("person");
  //     Promise.all([
  //       person.import([
  //         { _key: "Alice" },
  //         { _key: "Bob" },
  //         { _key: "Charlie" },
  //         { _key: "Dave" },
  //         { _key: "Eve" }
  //       ]),
  //       knows.import([
  //         { _from: "person/Alice", _to: "person/Bob" },
  //         { _from: "person/Bob", _to: "person/Charlie" },
  //         { _from: "person/Bob", _to: "person/Dave" },
  //         { _from: "person/Eve", _to: "person/Alice" },
  //         { _from: "person/Eve", _to: "person/Bob" }
  //       ])
  //     ])
  //       .then(() => done())
  //       .catch(done);
  //   });
  //   // it("executes traversal", done => {
  //   //   graph
  //   //     .traversal("person/Alice", { direction: "outbound" })
  //   //     .then((result: any) => {
  //   //       expect(result).to.have.property("visited");
  //   //       const visited = result.visited;
  //   //       expect(visited).to.have.property("vertices");
  //   //       const vertices = visited.vertices;
  //   //       expect(vertices).to.be.instanceOf(Array);
  //   //       expect(vertices.length).to.equal(4);
  //   //       const names = vertices.map((d: any) => d._key);
  //   //       for (const name of ["Alice", "Bob", "Charlie", "Dave"]) {
  //   //         expect(names).to.contain(name);
  //   //       }
  //   //       expect(visited).to.have.property("paths");
  //   //       const paths = visited.paths;
  //   //       expect(paths).to.be.instanceOf(Array);
  //   //       expect(paths.length).to.equal(4);
  //   //     })
  //   //     .then(() => done())
  //   //     .catch(done);
  //   // });
  // });
});
