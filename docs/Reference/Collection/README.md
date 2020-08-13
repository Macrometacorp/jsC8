## Collection

These functions implement the [HTTP API for manipulating collections](https://developer.document360.io/docs/collections).

The `Collection API` is implemented by all `Collection` instances, regardless of their specific type. I.e. it represents a shared subset between instances of [_DocumentCollection_](https://developer.document360.io/docs/documentcollection),[_EdgeCollection_](https://developer.document360.io/docs/edgecollection) ,[_GraphVertexCollection_](https://developer.document360.io/docs/vertexcollection) and [_GraphEdgeCollection_](https://developer.document360.io/docs/edgecollection-1).

## Getting information about the collection

See [the HTTP API documentation ](https://developer.document360.io/docs/collections)for details.

## collection.exists

`async collection.exists(): boolean`

Checks whether the collection exists.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
const result = await collection.exists();
// result indicates whether the collection exists
```

### collection.get

`async collection.get(): Object`

Retrieves general information about the collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
const data = await collection.get();
// data contains general information about the collection
```

### collection.properties

`async collection.properties(): Object`

Retrieves the collection's properties.

**Examples**

```js
const client = new jsc8();
const collection = client.collection('some-collection');
const data = await collection.properties();
// data contains the collection's properties
```

### collection.count

`async collection.count(): Object`

Retrieves information about the number of documents in a collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
const data = await collection.count();
// data contains the collection's count
```

### collection.figures

`async collection.figures(): Object`

Retrieves statistics for a collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
const data = await collection.figures();
// data contains the collection's figures
```

### collection.revision

`async collection.revision(): Object`

Retrieves the collection revision ID.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
const data = await collection.revision();
// data contains the collection's revision
```

### collection.checksum

`async collection.checksum([opts]): Object`

Retrieves the collection checksum.

**Arguments**

- **opts**: `Object` (optional)

  For information on the possible options see
  [the HTTP API for getting collection information](https://docs.macrometa.io/jsC8/latest/HTTP/Collection/Getting.html).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
const data = await collection.checksum();
// data contains the collection's checksum
```
