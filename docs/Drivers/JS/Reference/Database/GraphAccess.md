# Accessing graphs

These functions implement the
[HTTP API for accessing general graphs](https://docs.macrometa.io/jsC8/latest/HTTP/Graph/index.html).

## fabric.graph

`fabric.graph(graphName): Graph`

Returns a _Graph_ instance representing the graph with the given graph name.

## fabric.listGraphs

`async fabric.listGraphs(): Array<Object>`

Fetches all graphs from the fabric and returns an array of graph descriptions.

**Examples**

```js
const fabric = new Fabric();
const graphs = await fabric.listGraphs();
// graphs is an array of graph descriptions
```

## fabric.graphs

`async fabric.graphs(): Array<Graph>`

Fetches all graphs from the fabric and returns an array of _Graph_ instances
for the graphs.

**Examples**

```js
const fabric = new Fabric();
const graphs = await fabric.graphs();
// graphs is an array of Graph instances
```
