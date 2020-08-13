## Accessing graphs

These functions implement the [HTTP API for accessing general graphs](https://developer.document360.io/docs/graphs).

## client.graph

`client.graph(graphName): Graph`

Returns a `Graph` instance representing the graph with the given graph name.

## client.listGraphs

`async client.listGraphs(): Array<Object>`

Fetches all graphs from the fabric and returns an array of graph descriptions.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graphs = await client.listGraphs();
// graphs is an array of graph descriptions
```

## client.graphs

`async client.graphs(): Array<Graph>`

Fetches all graphs from the fabric and returns an array of `Graph` instances for the graphs.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const graphs = await client.graphs();
// graphs is an array of Graph instances
```
