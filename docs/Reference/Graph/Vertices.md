## Manipulating vertices

## graph.vertexCollection

`graph.vertexCollection(collectionName): GraphVertexCollection`

Returns a new [GraphVertexCollection  instance ](https://developer.document360.io/docs/vertexcollection)with the given name for this graph.

**Arguments**

* **collectionName**: `string`

  Name of the vertex collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph("some-graph");
const collection = graph.vertexCollection("vertices");
assert.equal(collection.name, "vertices");
// collection is a GraphVertexCollection
```

## graph.listVertexCollections

`async graph.listVertexCollections(): Array<Object>`

Fetches all vertex collections from the graph and returns an array of collection descriptions.

**Examples**

```js
const graph = client.graph('some-graph');

const collections = await graph.listVertexCollections();
// collections is an array of collection descriptions
// including orphan collections

// -- or --

const collections = await graph.listVertexCollections(true);
// collections is an array of collection descriptions
// not including orphan collections
```

## graph.vertexCollections

`async graph.vertexCollections(): Array<Collection>`

Fetches all vertex collections from the fabric and returns an array of `GraphVertexCollection` instances for the collections.

**Examples**

```js
const graph = client.graph('some-graph');

const collections = await graph.vertexCollections()
// collections is an array of GraphVertexCollection
// instances including orphan collections

// -- or --

const collections = await graph.vertexCollections(true)
// collections is an array of GraphVertexCollection
// instances not including orphan collections
```

## graph.addVertexCollection

`async graph.addVertexCollection(collectionName): Object`

Adds the collection with the given `collectionName` to the graph's vertex collections.

**Arguments**

* **collectionName**: `string`

  Name of the vertex collection to add to the graph.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
await graph.addVertexCollection('vertices');
// the collection "vertices" has been added to the graph
```

## graph.removeVertexCollection

`async graph.removeVertexCollection(collectionName, [dropCollection]): Object`

Removes the vertex collection with the given `collectionName`  from the graph.

**Arguments**

* **collectionName**: `string`

  Name of the vertex collection to remove from the graph.

* **dropCollection**: `boolean` (optional)

  If set to `true`, the collection will also be deleted from the client.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
await graph.removeVertexCollection('vertices')
// collection "vertices" has been removed from the graph

// -- or --

await graph.removeVertexCollection('vertices', true)
// collection "vertices" has been removed from the graph
// the collection has also been dropped from the fabric
// this may have been a bad idea
```
