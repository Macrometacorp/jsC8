import { expect } from "chai";
import { Fabric } from "../jsC8";
import { Graph } from "../graph";
import { getDCListString } from "../util/helper";

const range = (n: number): number[] => Array.from(Array(n).keys());

function createCollections(fabric: Fabric) {
  let vertexCollectionNames = range(2).map(i => `vc${Date.now()}${i}`);
  let edgeCollectionNames = range(2).map(i => `ec${Date.now()}${i}`);
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

describe("Graph API", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);

  let fabric: Fabric;
  const testUrl = process.env.TEST_C8_URL || "https://test.macrometa.io";

  let dcList: string;
  let name = `testfabric${Date.now()}`;
  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
    });

    await fabric.login("demo", "root", "demo");
    fabric.useTenant("demo");

    const response = await fabric.getAllEdgeLocations();
    dcList = getDCListString(response);

    await fabric.createFabric(name, [{ username: "root" }], { dcList: dcList });
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
  describe("graph.get", () => {
    let graph: Graph;
    let collectionNames: string[];
    before(done => {
      graph = fabric.graph(`g${Date.now()}`);
      createCollections(fabric)
        .then(names => {
          collectionNames = names.reduce((a, b) => a.concat(b));
          return createGraph(graph, names[0], names[1]);
        })
        .then(() => void done())
        .catch(done);
    });
    after(done => {
      graph
        .drop()
        .then(() =>
          Promise.all(
            collectionNames.map(name => fabric.collection(name).drop())
          )
        )
        .then(() => void done())
        .catch(done);
    });
    it("fetches information about the graph", done => {
      graph
        .get()
        .then(data => {
          expect(data).to.have.property("name", graph.name);
          done();
        })
        .catch(done);
    });
  });
  describe("graph.create", () => {
    let edgeCollectionNames: string[];
    let vertexCollectionNames: string[];
    before(done => {
      createCollections(fabric)
        .then(names => {
          [vertexCollectionNames, edgeCollectionNames] = names;
          done();
        })
        .catch(done);
    });
    after(done => {
      Promise.all(
        [...edgeCollectionNames, ...vertexCollectionNames].map(name =>
          fabric.collection(name).drop()
        )
      )
        .then(() => void done())
        .catch(done);
    });
    it("creates the graph", done => {
      let graph = fabric.graph(`g${Date.now()}`);
      graph
        .create({
          edgeDefinitions: edgeCollectionNames.map(name => ({
            collection: name,
            from: vertexCollectionNames,
            to: vertexCollectionNames
          }))
        })
        .then(() => graph.get())
        .then(data => {
          expect(data).to.have.property("name", graph.name);
          done();
        })
        .catch(done);
    });
  });
  describe("graph.drop", () => {
    let graph: Graph;
    let edgeCollectionNames: string[];
    let vertexCollectionNames: string[];
    beforeEach(done => {
      graph = fabric.graph(`g${Date.now()}`);
      createCollections(fabric)
        .then(names => {
          [vertexCollectionNames, edgeCollectionNames] = names;
          return createGraph(graph, names[0], names[1]);
        })
        .then(() => void done())
        .catch(done);
    });
    afterEach(done => {
      Promise.all(
        [...edgeCollectionNames, ...vertexCollectionNames].map(name =>
          fabric
            .collection(name)
            .drop()
            .catch(() => null)
        )
      )
        .then(() => void done())
        .catch(done);
    });
    it("destroys the graph if not passed true", done => {
      graph
        .drop()
        .then(() =>
          graph
            .get()
            .then(
              () => Promise.reject(new Error("Should not succeed")),
              () => undefined
            )
        )
        .then(() => fabric.listCollections())
        .then(collections => {
          expect(collections.map((c: any) => c.name)).to.include.members([
            ...edgeCollectionNames,
            ...vertexCollectionNames
          ]);
          done();
        })
        .catch(done);
    });
    it("additionally drops all of its collections if passed true", done => {
      graph
        .drop(true)
        .then(() =>
          graph
            .get()
            .then(
              () => Promise.reject(new Error("Should not succeed")),
              () => undefined
            )
        )
        .then(() => fabric.listCollections())
        .then(collections => {
          expect(collections.map((c: any) => c.name)).not.to.include.members([
            ...edgeCollectionNames,
            ...vertexCollectionNames
          ]);
          done();
        })
        .catch(done);
    });
  });
});
