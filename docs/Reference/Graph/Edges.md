## Manipulating edges

## client.insertEdge

`async client.insertEdge(graphName, definition): Object`

Adds the given edge definition `definition` to the given graph.

**Arguments**

- **graphName**: `string`

  Graph name

* **definition**: `Object`

  For more information on edge definitions see [the HTTP API for managing graphs](https://developer.document360.io/docs/graphs).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.insertEdge('some-graph', {
  collection: 'edges',
  from: ['vertices'],
  to: ['vertices']
});
```

## client.getEdges

`async client.getEdges(graphName): Array`

Returns the edge definitions for given graph.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.getEdges('some-graph');
```

## graph.edgeCollection

`graph.edgeCollection(collectionName): GraphEdgeCollection`

Returns a new [GraphEdgeCollection  instance](https://developer.document360.io/docs/edgecollection) with the given name bound to this graph.

**Arguments**

* **collectionName**: `string`

  Name of the edge collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

// assuming the collections "edges" and "vertices" exist
const graph = client.graph("some-graph");
const collection = graph.edgeCollection("edges");
assert.equal(collection.name, "edges");
// collection is a GraphEdgeCollection
```

## graph.addEdgeDefinition

`async graph.addEdgeDefinition(definition): Object`

Adds the given edge definition `definition` to the graph.

**Arguments**

* **definition**: `Object`

  For more information on edge definitions see [the HTTP API for managing graphs](https://developer.document360.io/docs/graphs).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

// assuming the collections "edges" and "vertices" exist
const graph = client.graph('some-graph');
await graph.addEdgeDefinition({
  collection: 'edges',
  from: ['vertices'],
  to: ['vertices']
});
// the edge definition has been added to the graph
```

## graph.replaceEdgeDefinition

`async graph.replaceEdgeDefinition(collectionName, definition): Object`

Replaces the edge definition for the edge collection named `collectionName` with
the given `definition`.

**Arguments**

* **collectionName**: `string`

  Name of the edge collection to replace the definition of.

* **definition**: `Object`

  For more information on edge definitions see [the HTTP API for managing graphs](https://developer.document360.io/docs/graphs).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

// assuming the collections "edges", "vertices" and "more-vertices" exist
const graph = client.graph('some-graph');
await graph.replaceEdgeDefinition('edges', {
  collection: 'edges',
  from: ['vertices'],
  to: ['more-vertices']
});
// the edge definition has been modified
```

## graph.removeEdgeDefinition

`async graph.removeEdgeDefinition(definitionName, [dropCollection]): Object`

Removes the edge definition with the given `definitionName` form the graph.

**Arguments**

* **definitionName**: `string`

  Name of the edge definition to remove from the graph.

* **dropCollection**: `boolean` (optional)

  If set to `true`, the edge collection associated with the definition will also be deleted from the client.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const graph = client.graph('some-graph');

await graph.removeEdgeDefinition('edges')
// the edge definition has been removed

// -- or --

await graph.removeEdgeDefinition('edges', true)
// the edge definition has been removed
// and the edge collection "edges" has been dropped
// this may have been a bad idea
```

## graph.traversal

`async graph.traversal(startVertex, opts): Object`

Performs a traversal starting from the given `startVertex` and following edges contained in any of the edge collections of this graph.

**Arguments**

* **startVertex**: `string`

  The handle of the start vertex. This can be either the `_id` of a document in the graph or a document (i.e. an object with an `_id` property).

* **opts**: `Object`

  See [the HTTP API documentation](https://developer.document360.io/docs/indexing) for details on the additional arguments.

Note:-Please note that while `opts.filte`, `opts.visitor`, `opts.init`, `opts.expander` and `opts.sort` should be strings evaluating to well-formed JavaScript functions, it's not possible to pass in JavaScript functions directly because the functions need to be evaluated on the server and will be transmitted in plain text.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const graph = client.graph('some-graph');
const collection = graph.edgeCollection('edges');
await collection.import([
  ['_key', '_from', '_to'],
  ['x', 'vertices/a', 'vertices/b'],
  ['y', 'vertices/b', 'vertices/c'],
  ['z', 'vertices/c', 'vertices/d']
])
const result = await graph.traversal('vertices/a', {
  direction: 'outbound',
  visitor: 'result.vertices.push(vertex._key);',
  init: 'result.vertices = [];'
});
assert.deepEqual(result.vertices, ['a', 'b', 'c', 'd']);
```
