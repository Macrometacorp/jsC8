import { expect } from "chai";
import { C8Client, Fabric } from "../jsC8";
import { Graph } from "../graph";
import { getDCListString } from "../util/helper";
import * as dotenv from "dotenv";

const range = (n: number): number[] => Array.from(Array(n).keys());
const C8_VERSION = Number(process.env.C8_VERSION || 30400);

function createCollections(fabric: Fabric) {
  let vertexCollectionNames = range(2).map(i => `vc${Date.now()}${i}`);
  let edgeCollectionNames = range(2).map(i => `ec${Date.now()}${i}`);
  return Promise.all([
    ...vertexCollectionNames.map(name => fabric.collection(name).create()),
    ...edgeCollectionNames.map(name => fabric.edgeCollection(name).create()),
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
      to: vertexCollectionNames,
    })),
  });
}

describe("Graph API", function() {
  dotenv.config();
  // create fabric takes 11s in a standard cluster
  this.timeout(60000);
  let c8Client: C8Client;

  let dcList: string;
  let name = `testfabric${Date.now()}`;
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
  describe("graph.get", () => {
    let graph: Graph;
    let collectionNames: string[];
    before(done => {
      graph = c8Client.graph(`g${Date.now()}`);
      createCollections(c8Client)
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
            collectionNames.map(name => c8Client.collection(name).drop())
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
      createCollections(c8Client)
        .then(names => {
          [vertexCollectionNames, edgeCollectionNames] = names;
          done();
        })
        .catch(done);
    });
    after(done => {
      Promise.all(
        [...edgeCollectionNames, ...vertexCollectionNames].map(name =>
          c8Client.collection(name).drop()
        )
      )
        .then(() => void done())
        .catch(done);
    });
    it("creates the graph", done => {
      let graph = c8Client.graph(`g${Date.now()}`);
      graph
        .create({
          edgeDefinitions: edgeCollectionNames.map(name => ({
            collection: name,
            from: vertexCollectionNames,
            to: vertexCollectionNames,
          })),
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
      graph = c8Client.graph(`g${Date.now()}`);
      createCollections(c8Client)
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
          c8Client
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
          graph.get().then(
            () => Promise.reject(new Error("Should not succeed")),
            () => undefined
          )
        )
        .then(() => c8Client.listCollections())
        .then(collections => {
          expect(collections.map((c: any) => c.name)).to.include.members([
            ...edgeCollectionNames,
            ...vertexCollectionNames,
          ]);
          done();
        })
        .catch(done);
    });
    it("additionally drops all of its collections if passed true", done => {
      graph
        .drop(true)
        .then(() =>
          graph.get().then(
            () => Promise.reject(new Error("Should not succeed")),
            () => undefined
          )
        )
        .then(() => c8Client.listCollections())
        .then(collections => {
          expect(collections.map((c: any) => c.name)).not.to.include.members([
            ...edgeCollectionNames,
            ...vertexCollectionNames,
          ]);
          done();
        })
        .catch(done);
    });
  });
});
