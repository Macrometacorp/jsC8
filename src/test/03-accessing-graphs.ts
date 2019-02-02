import { expect } from "chai";
import { Fabric } from "../jsC8";
import { Graph } from "../graph";
import { getDCListString } from "../util/helper";

const range = (n: number): number[] => Array.from(Array(n).keys());

describe("Accessing graphs", function () {
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);

  let name = `testdb_${Date.now()}`;
  let fabric: Fabric;
  const testUrl: string = process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

  let dcList: string;
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
  describe("fabric.graph", () => {
    it("returns a Graph instance", () => {
      let name = "potato";
      let graph = fabric.graph(name);
      expect(graph).to.be.an.instanceof(Graph);
      expect(graph)
        .to.have.property("name")
        .that.equals(name);
    });
  });
  describe("fabric.listGraphs", () => {
    let vertexCollectionNames = range(2).map(i => `vc_${Date.now()}_${i}`);
    let edgeCollectionNames = range(2).map(i => `ec_${Date.now()}_${i}`);
    let graphNames = range(4).map(i => `g_${Date.now()}_${i}`);
    before(done => {
      Promise.all([
        ...vertexCollectionNames.map(name => fabric.collection(name).create()),
        ...edgeCollectionNames.map(name => fabric.edgeCollection(name).create())
      ])
        .then(() =>
          Promise.all([
            ...graphNames.map(name =>
              fabric.graph(name).create({
                edgeDefinitions: edgeCollectionNames.map(name => ({
                  collection: name,
                  from: vertexCollectionNames,
                  to: vertexCollectionNames
                })),
                isSmart: true,
                options: {
                  numberOfShards: 1,
                  smartGraphAttribute: "test"
                },
                orphanCollections: []
              })
            )
          ])
        )
        .then(() => void done())
        .catch(done);
    });
    after(done => {
      Promise.all(graphNames.map(name => fabric.graph(name).drop()))
        .then(() =>
          Promise.all(
            vertexCollectionNames
              .concat(edgeCollectionNames)
              .map(name => fabric.collection(name).drop())
          )
        )
        .then(() => void done())
        .catch(done);
    });
    it("fetches information about all graphs", done => {
      fabric.listGraphs()
        .then(graphs => {
          expect(graphs.length).to.equal(graphNames.length);
          expect(graphs.map((g: any) => g._key).sort()).to.eql(graphNames);
          done();
        })
        .catch(done);
    });
  });
  describe("fabric.graphs", () => {
    let vertexCollectionNames = range(2).map(i => `vc_${Date.now()}_${i}`);
    let edgeCollectionNames = range(2).map(i => `ec_${Date.now()}_${i}`);
    let graphNames = range(4).map(i => `g_${Date.now()}_${i}`);
    before(done => {
      Promise.all([
        ...vertexCollectionNames.map(name => fabric.collection(name).create()),
        ...edgeCollectionNames.map(name => fabric.edgeCollection(name).create())
      ])
        .then(() =>
          Promise.all([
            ...graphNames.map(name =>
              fabric.graph(name).create({
                edgeDefinitions: edgeCollectionNames.map(name => ({
                  collection: name,
                  from: vertexCollectionNames,
                  to: vertexCollectionNames
                }))
              })
            )
          ])
        )
        .then(() => void done())
        .catch(done);
    });
    after(done => {
      Promise.all(graphNames.map(name => fabric.graph(name).drop()))
        .then(() =>
          Promise.all(
            vertexCollectionNames
              .concat(edgeCollectionNames)
              .map(name => fabric.collection(name).drop())
          )
        )
        .then(() => void done())
        .catch(done);
    });
    it("creates Graph instances", done => {
      fabric.graphs()
        .then(graphs => {
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
