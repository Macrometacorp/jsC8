## Accessing graphs

These functions implement the [HTTP API for accessing general graphs](https://developer.document360.io/docs/graphs).

## fabric.graph

`fabric.graph(graphName): Graph`

Returns a `Graph` instance representing the graph with the given graph name.

## fabric.listGraphs

`async fabric.listGraphs(): Array<Object>`

Fetches all graphs from the fabric and returns an array of graph descriptions.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const graphs = await fabric.listGraphs();
// graphs is an array of graph descriptions
```

## fabric.graphs

`async fabric.graphs(): Array<Graph>`

Fetches all graphs from the fabric and returns an array of `Graph` instances for the graphs.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const graphs = await fabric.graphs();
// graphs is an array of Graph instances
```
