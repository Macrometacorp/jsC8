## GraphEdgeCollection 

The GraphEdgeCollection API extends the [Collection API](https://developer.document360.io/docs/collections) with the following methods.

## client.updateEdge

`async client.updateEdge(graphName, collectionName, documentHandle, newValue, [opts]): Object`

Updates the edge in collection to the given graph.

**Arguments**

- **graphName**: `string`

  Name of the graph

- **collectionName**: `string`

  Name of the collection

- **documentHandle**: `string`

  Handle of the document to update. This can be either the `_id` or the `_key`
  of a document in the collection, or a document (i.e. an object with an `_id`
  or `_key` property).

- **newValue**: `Object`

  The new data of the document.

- **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  - **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  - **keepNull**: `boolean` (Default: `true`)

    If set to `false`, properties with a value of `null` indicate that a
    property should be deleted.

  - **mergeObjects**: `boolean` (Default: `true`)

    If set to `false`, object properties that already exist in the old document
    will be overwritten rather than merged. This does not affect arrays.

  - **returnOld**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete previous revision of the
    changed documents under the attribute `old` in the result.

  - **returnNew**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete new documents under the
    attribute `new` in the result.

  - **ignoreRevs**: `boolean` (Default: `true`)

    By default, or if this is set to true, the _rev attributes in the given
    documents are ignored. If this is set to false, then any _rev attribute
    given in a body document is taken as a precondition. The document is only
    updated if the current revision is the one specified.

  - **rev**: `string` (optional)

    Only update the document if it matches this revision.

  - **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.

Note:- If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.updateEdge('some-graph', 'edge-collection' , "some_key" , {some: "data"});
```

## client.replaceEdge

`async client.replaceEdge(graphName, collectionName, documentHandle, newValue, [opts]): Object`

Replace the edge in collection to the given graph.

**Arguments**

- **graphName**: `string`

  Name of the graph

- **collectionName**: `string`

  Name of the collection

- **documentHandle**: `string`

  The handle of the document to replace. This can either be the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

- **newValue**: `Object`

  The new data of the document.

- **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  - **waitForSync**: `boolean` (Default: `false`)

    Wait until the document has been synced to disk. Default: `false`.

  - **rev**: `string` (optional)

    Only replace the document if it matches this revision.

  - **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.
      
Note:-If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.replaceEdge('some-graph', 'edge-collection' , "some_key" , {some: "data"});
```

## client.deleteEdge

`async client.deleteEdge(graphName, collectionName, documentHandle, [opts]): Object`

Deletes the edge in collection to the given graph.

**Arguments**

- **graphName**: `string`

  Name of the graph

- **collectionName**: `string`

  Name of the collection

- **documentHandle**: `string`

  The handle of the document to delete. This can be either the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

- **opts**: `Object` (optional)

  If `opts` is set, it must be an object with any of the following properties:

  - **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  - **rev**: `string` (optional)

    Only update the document if it matches this revision.

  - **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.

Note:-If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.deleteEdge('some-graph', 'edge-collection' , "some_key");
```

## client.linkEdge

`async client.linkEdge(graphName, collectionName, fromId, toId): Object`

**Arguments**

- **graphName**: `string`

  Name of the graph

- **collectionName**: `string`

  Name of the collection

- **fromId**: `string`

  The handle of the start vertex of this edge. This can be either the `_id` of a document in the fabric, the `_key` of an edge in the collection, or a  document (i.e. an object with an `_id` or `_key` property).

- **toId**: `string`

  The handle of the end vertex of this edge. This can be either the `_id` of a  document in the fabric, the `_key` of an edge in the collection, or a document (i.e. an object with an `_id` or `_key` property).

- **opts**: `Object` (optional)

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.linkEdge('some-graph', 'edge-collection' , 'vertices/start-vertex', 'vertices/end-vertex');
```

# Advanced User

## graphEdgeCollection.remove

`async graphEdgeCollection.remove(documentHandle): Object`

Deletes the edge with the given `documentHandle` from the collection.

**Arguments**

- **documentHandle**: `string`

  The handle of the edge to retrieve. This can be either the `_id` or the `_key`  of an edge in the collection, or an edge (i.e. an object with an `_id` or `_key` property).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const collection = graph.edgeCollection('edges');

await collection.remove('some-key')
// document 'edges/some-key' no longer exists

// -- or --

await collection.remove('edges/some-key')
// document 'edges/some-key' no longer exists
```

## graphEdgeCollection.documentExists

`async graphEdgeCollection.documentExists(documentHandle): boolean`

Checks whether the edge with the given `documentHandle` exists.

**Arguments**

- **documentHandle**: `string`

  The handle of the edge to retrieve. This can be either the `_id` or the
  `_key` of a edge in the collection, or an edge (i.e. an object with an
  `_id` or `_key` property).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const collection = graph.edgeCollection('edges');

const exists = await collection.documentExists('some-key');
if (exists === false) {
  // the edge does not exist
}
```

## graphEdgeCollection.document

`async graphEdgeCollection.document(documentHandle, [graceful]): Object`

Alias: `graphEdgeCollection.edge`.

Retrieves the edge with the given `documentHandle` from the collection.

**Arguments**

- **documentHandle**: `string`

  The handle of the edge to retrieve. This can be either the `_id` or the `_key` of an edge in the collection, or an edge (i.e. an object with an `_id` or `_key` property).

- **graceful**: `boolean` (Default: `false`)

  If set to `true`, the method will return `null` instead of throwing an error  if the edge does not exist.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const collection = graph.edgeCollection('edges');

const edge = await collection.document('some-key');
// the edge exists
assert.equal(edge._key, 'some-key');
assert.equal(edge._id, 'edges/some-key');

// -- or --

const edge = await collection.document('edges/some-key');
// the edge exists
assert.equal(edge._key, 'some-key');
assert.equal(edge._id, 'edges/some-key');

// -- or --

const edge = await collection.document('some-key', true);
if (edge === null) {
  // the edge does not exist
}
```

## graphEdgeCollection.save

`async graphEdgeCollection.save(data, [fromId, toId]): Object`

Creates a new edge between the vertices `fromId` and `toId` with the given `data`.

**Arguments**

- **data**: `Object`

  The data of the new edge. If `fromId` and `toId` are not specified, the `data` needs to contain the properties **from\_ and **to\_.

- **fromId**: `string` (optional)

  The handle of the start vertex of this edge. This can be either the `_id` of a document in the fabric, the `_key` of an edge in the collection, or a  document (i.e. an object with an `_id` or `_key` property).

- **toId**: `string` (optional)

  The handle of the end vertex of this edge. This can be either the `_id` of a  document in the fabric, the `_key` of an edge in the collection, or a document (i.e. an object with an `_id` or `_key` property).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const collection = graph.edgeCollection('edges');
const edge = await collection.save(
  {some: 'data'},
  'vertices/start-vertex',
  'vertices/end-vertex'
);
assert.equal(edge._id, 'edges/' + edge._key);
assert.equal(edge.some, 'data');
assert.equal(edge._from, 'vertices/start-vertex');
assert.equal(edge._to, 'vertices/end-vertex');
```

## graphEdgeCollection.edges

`async graphEdgeCollection.edges(documentHandle): Array<Object>`

Retrieves a list of all edges of the document with the given `documentHandle`.

**Arguments**

- **documentHandle**: `string`

  The handle of the document to retrieve the edges of. This can be either the `_id` of a document in the fabric, the `_key` of an edge in the collection,  or a document (i.e. an object with an `_id` or `_key` property).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const collection = graph.edgeCollection('edges');
await collection.import([
  ['_key', '_from', '_to'],
  ['x', 'vertices/a', 'vertices/b'],
  ['y', 'vertices/a', 'vertices/c'],
  ['z', 'vertices/d', 'vertices/a']
]);
const edges = await collection.edges('vertices/a');
assert.equal(edges.length, 3);
assert.deepEqual(edges.map(edge => edge._key), ['x', 'y', 'z']);
```

## graphEdgeCollection.inEdges

`async graphEdgeCollection.inEdges(documentHandle): Array<Object>`

Retrieves a list of all incoming edges of the document with the given `documentHandle`.

**Arguments**

- **documentHandle**: `string`

  The handle of the document to retrieve the edges of. This can be either the `_id` of a document in the fabric, the `_key` of an edge in the collection,  or a document (i.e. an object with an `_id` or `_key` property).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const collection = graph.edgeCollection('edges');
await collection.import([
  ['_key', '_from', '_to'],
  ['x', 'vertices/a', 'vertices/b'],
  ['y', 'vertices/a', 'vertices/c'],
  ['z', 'vertices/d', 'vertices/a']
]);
const edges = await collection.inEdges('vertices/a');
assert.equal(edges.length, 1);
assert.equal(edges[0]._key, 'z');
```

## graphEdgeCollection.outEdges

`async graphEdgeCollection.outEdges(documentHandle): Array<Object>`

Retrieves a list of all outgoing edges of the document with the given `documentHandle`.

**Arguments**

- **documentHandle**: `string`

  The handle of the document to retrieve the edges of. This can be either the  `_id` of a document in the fabric, the `_key` of an edge in the collection,  or a document (i.e. an object with an `_id` or `_key` property).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const collection = graph.edgeCollection('edges');
await collection.import([
  ['_key', '_from', '_to'],
  ['x', 'vertices/a', 'vertices/b'],
  ['y', 'vertices/a', 'vertices/c'],
  ['z', 'vertices/d', 'vertices/a']
]);
const edges = await collection.outEdges('vertices/a');
assert.equal(edges.length, 2);
assert.deepEqual(edges.map(edge => edge._key), ['x', 'y']);
```

## graphEdgeCollection.traversal

`async graphEdgeCollection.traversal(startVertex, opts): Object`

Performs a traversal starting from the given _startVertex_ and following edges contained in this edge collection.

**Arguments**

- **startVertex**: `string`

  The handle of the start vertex. This can be either the `_id` of a document in   the fabric, the `_key` of an edge in the collection, or a document (i.e. an object with an `_id` or `_key` property).

- **opts**: `Object`

Note:-Please note that while `opts.filter`, `opts.visitor`, `opts.init`, `opts.expander` and `opts.sort` should be strings evaluating to well-formed JavaScript code, it's not possible to pass in JavaScript functions directly  because the code needs to be evaluated on the server and will be transmitted  in plain text.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const collection = graph.edgeCollection('edges');
await collection.import([
  ['_key', '_from', '_to'],
  ['x', 'vertices/a', 'vertices/b'],
  ['y', 'vertices/b', 'vertices/c'],
  ['z', 'vertices/c', 'vertices/d']
]);
const result = await collection.traversal('vertices/a', {
  direction: 'outbound',
  visitor: 'result.vertices.push(vertex._key);',
  init: 'result.vertices = [];'
});
assert.deepEqual(result.vertices, ['a', 'b', 'c', 'd']);
```
