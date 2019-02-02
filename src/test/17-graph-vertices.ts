import { expect } from "chai";
import { Fabric } from "../jsC8";
import { BaseCollection } from "../collection";
import { C8Error } from "../error";
import { Graph, GraphVertexCollection } from "../graph";
import { getDCListString } from "../util/helper";

const range = (n: number): number[] => Array.from(Array(n).keys());

function createCollections(fabric: Fabric) {
  let vertexCollectionNames = range(2).map(i => `vc_${Date.now()}_${i}`);
  let edgeCollectionNames = range(2).map(i => `ec_${Date.now()}_${i}`);
  return Promise.all([
    ...vertexCollectionNames.map(name => fabric.collection(name).create()),
    ...edgeCollectionNames.map(name => fabric.edgeCollection(name).create())
  ]).then(() => [vertexCollectionNames, edgeCollectionNames]);
}

function createGraph(
  graph: Graph,
  vertexCollectionNames: string[],
  edgeCollectionNames: string[]
) {
  return graph.create({
    edgeDefinitions: edgeCollectionNames.map(name => ({
      collection: name,
      from: vertexCollectionNames,
      to: vertexCollectionNames
    }))
  });
}

describe("Manipulating graph vertices", function () {
  // create fabric takes 11s in a standard cluster
  this.timeout(20000);

  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

  let dcList: string;
  let name = `testfabric_${Date.now()}`;
  let graph: Graph;
  let collectionNames: string[];
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
    });

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);

    await fabric.createFabric(name, [{ username: 'root' }], { dcList: dcList });
    fabric.useFabric(name);
  });
  after(async () => {
    try {
      fabric.useFabric("_system");
      await fabric.dropFabric(name);
    } finally {
      fabric.close();
    }
  });
  beforeEach(done => {
    graph = fabric.graph(`g_${Date.now()}`);
    createCollections(fabric)
      .then(names => {
        collectionNames = names.reduce((a, b) => a.concat(b));
        return createGraph(graph, names[0], names[1]);
      })
      .then(() => void done())
      .catch(done);
  });
  afterEach(done => {
    graph
      .drop()
      .then(() =>
        Promise.all(collectionNames.map(name => fabric.collection(name).drop()))
      )
      .then(() => void done())
      .catch(done);
  });
  describe("graph.vertexCollection", () => {
    it("returns a GraphVertexCollection instance for the collection", () => {
      let name = "potato";
      let collection = graph.vertexCollection(name);
      expect(collection).to.be.an.instanceof(GraphVertexCollection);
      expect(collection)
        .to.have.property("name")
        .that.equals(name);
    });
  });
  describe("graph.addVertexCollection", () => {
    let vertexCollection: BaseCollection;
    beforeEach(done => {
      vertexCollection = fabric.collection(`xc_${Date.now()}`);
      vertexCollection
        .create()
        .then(() => void done())
        .catch(done);
    });
    afterEach(done => {
      vertexCollection
        .drop()
        .then(() => void done())
        .catch(done);
    });
    it("adds the given vertex collection to the graph", done => {
      graph
        .addVertexCollection(vertexCollection.name)
        .then(data => {
          expect(data.orphanCollections).to.contain(vertexCollection.name);
          done();
        })
        .catch(done);
    });
  });
  describe("graph.removeVertexCollection", () => {
    let vertexCollection: BaseCollection;
    beforeEach(done => {
      vertexCollection = fabric.collection(`xc_${Date.now()}`);
      vertexCollection
        .create()
        .then(() => graph.addVertexCollection(vertexCollection.name))
        .then(() => void done())
        .catch(done);
    });
    it("removes the given vertex collection from the graph", done => {
      graph
        .removeVertexCollection(vertexCollection.name)
        .then(data => {
          expect(data.orphanCollections).not.to.contain(vertexCollection.name);
          return vertexCollection.get();
        })
        .then(() => done())
        .catch(done);
    });
    it("destroys the collection if explicitly passed true", done => {
      graph
        .removeVertexCollection(vertexCollection.name, true)
        .then(data => {
          expect(data.orphanCollections).not.to.contain(vertexCollection.name);
          return vertexCollection.get();
        })
        .then(
          () => Promise.reject(new Error("Should not succeed")),
          err => {
            expect(err).to.be.an.instanceof(C8Error);
            done();
          }
        )
        .catch(done);
    });
  });
});
