import { expect } from "chai";
import { C8Client, Fabric } from "../jsC8";
import { BaseCollection } from "../collection";
import { C8Error } from "../error";
import { Graph, GraphVertexCollection } from "../graph";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const range = (n: number): number[] => Array.from(Array(n).keys());
const C8_VERSION = Number(process.env.C8_VERSION || 30400);

function createCollections(fabric: Fabric) {
  let vertexCollectionNames = range(2).map((i) => `vc${Date.now()}${i}`);
  let edgeCollectionNames = range(2).map((i) => `ec${Date.now()}${i}`);
  return Promise.all([
    ...vertexCollectionNames.map((name) => fabric.collection(name).create()),
    ...edgeCollectionNames.map((name) => fabric.edgeCollection(name).create()),
  ]).then(() => [vertexCollectionNames, edgeCollectionNames]);
}

function createGraph(
  graph: Graph,
  vertexCollectionNames: string[],
  edgeCollectionNames: string[]
) {
  return graph.create({
    edgeDefinitions: edgeCollectionNames.map((name) => ({
      collection: name,
      from: vertexCollectionNames,
      to: vertexCollectionNames,
    })),
  });
}

describe("Manipulating graph vertices", function () {
  dotenv.config();
  // create fabric takes 11s in a standard cluster
  this.timeout(20000);
  let c8Client: C8Client;

  let dcList: string;
  let name = `testfabric${Date.now()}`;
  let graph: Graph;
  let collectionNames: string[];
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
  beforeEach((done) => {
    graph = c8Client.graph(`g${Date.now()}`);
    createCollections(c8Client)
      .then((names) => {
        collectionNames = names.reduce((a, b) => a.concat(b));
        return createGraph(graph, names[0], names[1]);
      })
      .then(() => void done())
      .catch(done);
  });
  afterEach((done) => {
    graph
      .drop()
      .then(() =>
        Promise.all(
          collectionNames.map((name) => c8Client.collection(name).drop())
        )
      )
      .then(() => void done())
      .catch(done);
  });
  describe("graph.vertexCollection", () => {
    it("returns a GraphVertexCollection instance for the collection", () => {
      let name = "potato";
      let collection = graph.vertexCollection(name);
      expect(collection).to.be.an.instanceof(GraphVertexCollection);
      expect(collection).to.have.property("name").that.equals(name);
    });
  });
  describe("graph.addVertexCollection", () => {
    let vertexCollection: BaseCollection;
    beforeEach((done) => {
      vertexCollection = c8Client.collection(`coll${Date.now()}`);
      vertexCollection
        .create()
        .then(() => void done())
        .catch(done);
    });
    afterEach((done) => {
      vertexCollection
        .drop()
        .then(() => void done())
        .catch(done);
    });
    it("adds the given vertex collection to the graph", (done) => {
      graph
        .addVertexCollection(vertexCollection.name)
        .then((data) => {
          expect(data.orphanCollections).to.contain(vertexCollection.name);
          done();
        })
        .catch(done);
    });
  });
  describe("graph.removeVertexCollection", () => {
    let vertexCollection: BaseCollection;
    beforeEach((done) => {
      vertexCollection = c8Client.collection(`xc${Date.now()}`);
      vertexCollection
        .create()
        .then(() => graph.addVertexCollection(vertexCollection.name))
        .then(() => void done())
        .catch(done);
    });
    it("removes the given vertex collection from the graph", (done) => {
      graph
        .removeVertexCollection(vertexCollection.name)
        .then((data) => {
          expect(data.orphanCollections).not.to.contain(vertexCollection.name);
          return vertexCollection.get();
        })
        .then(() => done())
        .catch(done);
    });
    it("destroys the collection if explicitly passed true", (done) => {
      graph
        .removeVertexCollection(vertexCollection.name, true)
        .then((data) => {
          expect(data.orphanCollections).not.to.contain(vertexCollection.name);
          return vertexCollection.get();
        })
        .then(
          () => Promise.reject(new Error("Should not succeed")),
          (err) => {
            expect(err).to.be.an.instanceof(C8Error);
            done();
          }
        )
        .catch(done);
    });
  });
});
