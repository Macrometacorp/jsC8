import { expect } from "chai";
import { C8Client } from "../jsC8";
import { Graph } from "../graph";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const range = (n: number): number[] => Array.from(Array(n).keys());
const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("Accessing graphs", function () {
  // create fabric takes 11s in a standard cluster
  dotenv.config();
  this.timeout(600000);
  let c8Client: C8Client;
  let name = `testdb${Date.now()}`;

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
    await c8Client.createFabric(name, ["root"], { dcList: dcList });
    c8Client.useFabric(name);
  });
  after(async () => {
    try {
      c8Client.useFabric("_system");
      await c8Client.dropFabric(name);
    } finally {
      c8Client.close();
    }
  });
  describe("fabric.graph", () => {
    it("returns a Graph instance", () => {
      let name = "potato";
      let graph = c8Client.graph(name);
      expect(graph).to.be.an.instanceof(Graph);
      expect(graph).to.have.property("name").that.equals(name);
    });
  });
  describe("fabric.listGraphs", () => {
    let vertexCollectionNames = range(2).map((i) => `vc${Date.now()}${i}`);
    let edgeCollectionNames = range(2).map((i) => `ec${Date.now()}${i}`);
    let graphNames = range(4).map((i) => `g${Date.now()}${i}`);
    before((done) => {
      Promise.all([
        ...vertexCollectionNames.map((name) =>
          c8Client.collection(name).create()
        ),
        ...edgeCollectionNames.map((name) =>
          c8Client.edgeCollection(name).create()
        ),
      ])
        .then(() =>
          Promise.all([
            ...graphNames.map((name) =>
              c8Client.graph(name).create({
                edgeDefinitions: edgeCollectionNames.map((name) => ({
                  collection: name,
                  from: vertexCollectionNames,
                  to: vertexCollectionNames,
                })),
                isSmart: true,
                options: {
                  numberOfShards: 1,
                  smartGraphAttribute: "test",
                },
                orphanCollections: [],
              })
            ),
          ])
        )
        .then(() => void done())
        .catch(done);
    });
    after((done) => {
      Promise.all(graphNames.map((name) => c8Client.graph(name).drop()))
        .then(() =>
          Promise.all(
            vertexCollectionNames
              .concat(edgeCollectionNames)
              .map((name) => c8Client.collection(name).drop())
          )
        )
        .then(() => void done())
        .catch(done);
    });
    it("fetches information about all graphs", (done) => {
      c8Client
        .listGraphs()
        .then((graphs) => {
          expect(graphs.length).to.equal(graphNames.length);
          expect(graphs.map((g: any) => g._key).sort()).to.eql(graphNames);
          done();
        })
        .catch(done);
    });
  });
  describe("fabric.graphs", () => {
    let vertexCollectionNames = range(2).map((i) => `vc${Date.now()}${i}`);
    let edgeCollectionNames = range(2).map((i) => `ec${Date.now()}${i}`);
    let graphNames = range(4).map((i) => `g${Date.now()}${i}`);
    before((done) => {
      Promise.all([
        ...vertexCollectionNames.map((name) =>
          c8Client.collection(name).create()
        ),
        ...edgeCollectionNames.map((name) =>
          c8Client.edgeCollection(name).create()
        ),
      ])
        .then(() =>
          Promise.all([
            ...graphNames.map((name) =>
              c8Client.graph(name).create({
                edgeDefinitions: edgeCollectionNames.map((name) => ({
                  collection: name,
                  from: vertexCollectionNames,
                  to: vertexCollectionNames,
                })),
              })
            ),
          ])
        )
        .then(() => void done())
        .catch(done);
    });
    after((done) => {
      Promise.all(graphNames.map((name) => c8Client.graph(name).drop()))
        .then(() =>
          Promise.all(
            vertexCollectionNames
              .concat(edgeCollectionNames)
              .map((name) => c8Client.collection(name).drop())
          )
        )
        .then(() => void done())
        .catch(done);
    });
    it("creates Graph instances", (done) => {
      c8Client
        .graphs()
        .then((graphs) => {
          expect(graphs.length).to.equal(graphNames.length);
          expect(graphs.map((g: any) => g.name).sort()).to.eql(graphNames);
          graphs.forEach((graph: any) =>
            expect(graph).to.be.an.instanceof(Graph)
          );
          done();
        })
        .catch(done);
    });
  });
});
