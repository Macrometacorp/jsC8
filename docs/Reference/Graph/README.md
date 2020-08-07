## Graph 

These functions implement the [HTTP API for manipulating graphs](https://developer.document360.io/docs/graphs).

## client.createGraph

`async graph.createGraph(graphName, properties): Object`

Creates a graph with the given `properties` for this `graphName`, then returns the server response.

**Arguments**

- **graphName**: `string`

  Graph name

- **properties**: `Object`

  For more information on the `properties` object, see  [the HTTP API documentation for creating graphs](https://developer.document360.io/docs/graphs).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.createGraph('some-graph');
```

## client.deleteGraph

`async graph.deleteGraph(graphName, dropCollections): Object`

Deletes the graph from the client.

**Arguments**

- **graphName**: `string`

  Graph name

- **dropCollections**: `boolean` (optional)

  If set to `true`, the collections associated with the graph will also be deleted.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.deleteGraph('some-graph');
```

## client.hasGraph

`async graph.hasGraph(graphName): Boolean`

Deletes the graph from the client.

**Arguments**

- **graphName**: `string`

  Graph name

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const hasGraph = await client.hasGraph('some-graph');
```

## client.getGraph

`async graph.getGraph(graphName): Boolean`

Retrieves general information about the graph.

**Arguments**

- **graphName**: `string`

  Graph name

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const graph = await client.getGraph('some-graph');
```

## client.getGraphs

`async graph.getGraphs(): Boolean`

Retrieves all graphs information.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const graphs = await client.getGraphs();
```

## Advanced User

## graph.exists

`async graph.exists(): boolean`

Checks whether the graph exists.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const graph = client.graph('some-graph');
const result = await graph.exists();
// result indicates whether the graph exists
```

## graph.get

`async graph.get(): Object`

Retrieves general information about the graph.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const graph = client.graph('some-graph');
const data = await graph.get();
// data contains general information about the graph
```

## graph.create

`async graph.create(properties): Object`

Creates a graph with the given `properties` for this graph's name, then returns the server response.

**Arguments**

- **properties**: `Object`

  For more information on the `properties` object, see  [the HTTP API documentation for creating graphs](https://developer.document360.io/docs/graphs).

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const graph = client.graph('some-graph');
const info = await graph.create({
  edgeDefinitions: [{
    collection: 'edges',
    from: ['start-vertices'],
    to: ['end-vertices']
  }]
});
// graph now exists
```

## graph.drop

`async graph.drop([dropCollections]): Object`

Deletes the graph from the client.

**Arguments**

- **dropCollections**: `boolean` (optional)

  If set to `true`, the collections associated with the graph will also be deleted.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const graph = client.graph('some-graph');
await graph.drop();
// the graph "some-graph" no longer exists
```
