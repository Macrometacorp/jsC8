## Accessing collections

These functions implement the [HTTP API for accessing collections](https://developer.document360.io/docs/collections).

## client.collection

`client.collection(collectionName): DocumentCollection`

Returns a `DocumentCollection` instance for the given collection name.

**Arguments**

- **collectionName**: `string`

  Name of the edge collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const collection = client.collection("potatoes");
```

## client.edgeCollection

`client.edgeCollection(collectionName): EdgeCollection`

Returns an `EdgeCollection` instance for the given collection name.

**Arguments**

- **collectionName**: `string`

  Name of the edge collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const collection = client.edgeCollection("potatoes");
```

## client.listCollections

`async client.listCollections([excludeSystem]): Array<Object>`

Fetches all collections from the fabric and returns an array of collection descriptions.

**Arguments**

- **excludeSystem**: `boolean` (Default: `true`)

  Whether system collections should be excluded.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const collections = await client.listCollections();
// collections is an array of collection descriptions
// not including system collections

// -- or --

const collections = await client.listCollections(false);
// collections is an array of collection descriptions
// including system collections
```

## client.collections

`async client.collections([excludeSystem]): Array<Collection>`

Fetches all collections from the fabric and returns an array of
`DocumentCollection` and `EdgeCollection` instances for the collections.

**Arguments**

- **excludeSystem**: `boolean` (Default: `true`)

  Whether system collections should be excluded.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const collections = await client.collections();
// collections is an array of DocumentCollection
// and EdgeCollection instances
// not including system collections

// -- or --

const collections = await client.collections(false);
// collections is an array of DocumentCollection
// and EdgeCollection instances
// including system collections
```
