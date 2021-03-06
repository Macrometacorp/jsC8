## Graph API

These functions implement the [HTTP API for manipulating graphs](https://developer.document360.io/docs/indexing).

## graph.exists

`async graph.exists(): boolean`

Checks whether the graph exists.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const result = await graph.exists();
// result indicates whether the graph exists
```

## graph.get

`async graph.get(): Object`

Retrieves general information about the graph.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
const data = await graph.get();
// data contains general information about the graph
```

## graph.create

`async graph.create(properties): Object`

Creates a graph with the given `properties` for this graph's name, then returns the server response.

**Arguments**

- **properties**: `Object`

  For more information on the `properties` object, see
  [the HTTP API documentation for creating graphs](https://developer.document360.io/docs/overview-6).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

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
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graph = client.graph('some-graph');
await graph.drop();
// the graph "some-graph" no longer exists
```
