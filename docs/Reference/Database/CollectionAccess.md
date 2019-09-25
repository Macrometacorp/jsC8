## Accessing collections

These functions implement the [HTTP API for accessing collections](https://developer.document360.io/docs/collections).

## fabric.collection

`fabric.collection(collectionName): DocumentCollection`

Returns a `DocumentCollection` instance for the given collection name.

**Arguments**

- **collectionName**: `string`

  Name of the edge collection.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name)
const collection = fabric.collection("potatoes");
```

## fabric.edgeCollection

`fabric.edgeCollection(collectionName): EdgeCollection`

Returns an `EdgeCollection` instance for the given collection name.

**Arguments**

- **collectionName**: `string`

  Name of the edge collection.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name);
const collection = fabric.edgeCollection("potatoes");
```

## fabric.listCollections

`async fabric.listCollections([excludeSystem]): Array<Object>`

Fetches all collections from the fabric and returns an array of collection descriptions.

**Arguments**

- **excludeSystem**: `boolean` (Default: `true`)

  Whether system collections should be excluded.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name)
const collections = await fabric.listCollections();
// collections is an array of collection descriptions
// not including system collections

// -- or --

const collections = await fabric.listCollections(false);
// collections is an array of collection descriptions
// including system collections
```

## fabric.collections

`async fabric.collections([excludeSystem]): Array<Collection>`

Fetches all collections from the fabric and returns an array of
`DocumentCollection` and `EdgeCollection` instances for the collections.

**Arguments**

- **excludeSystem**: `boolean` (Default: `true`)

  Whether system collections should be excluded.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name)
const collections = await fabric.collections()
// collections is an array of DocumentCollection
// and EdgeCollection instances
// not including system collections

// -- or --

const collections = await fabric.collections(false)
// collections is an array of DocumentCollection
// and EdgeCollection instances
// including system collections
```
