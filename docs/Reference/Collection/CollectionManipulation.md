## Manipulating the collection

These functions implement [the HTTP API for modifying collections](https://developer.document360.io/docs/using-c8-rest-api)

## collection.create

`async collection.create([properties]): Object`

Creates a collection with the given `properties` for this collection's name, then returns the server response.

**Arguments**

- **properties**: `Object` (optional)
  For more information on the 'properties` object, see  [the HTTP API documentation for creating collections](https://developer.document360.io/docs/using-c8-rest-api).

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)

const collection = client.collection('potatoes');
await collection.create()
// the document collection "potatoes" now exists

// -- or --

const collection = client.edgeCollection('friends');
await collection.create({
  waitForSync: true // always sync document changes to disk
});
// the edge collection "friends" now exists
```
Note:-(To make the collection as `spot`, pass the `isSpot: true` in the `properties` object.)

## collection.onChange

`collection.onChange(dcName, subscriptionName): void`

**Arguments**

- **dcName**: `string``

  The dcName for the consumer.

- **subscriptionName**: `string`

  The name of the subscription.

**Methods**

`listener.on('open', callback )`

`listener.on('message', callback )`

`listener.on('close', callback )`

`listener.on('error', callback )`

`listener.close()`

**Examples**

```js
const listener = collection.onChange("fed.macrometa.io", "mySub");

listener.on('message',(msg) => console.log("message=>", msg));
listener.on('open',() => console.log("connection open"));
listener.on('close',() => console.log("connection closed");

```


## collection.rename

`async collection.rename(name): Object`

Renames the collection. The  `Collection` instance will automatically update its name when the rename succeeds.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
const collection = client.collection('some-collection');
const result = await collection.rename('new-collection-name')
assert.equal(result.name, 'new-collection-name');
assert.equal(collection.name, result.name);
// result contains additional information about the collection
```


## collection.truncate

`async collection.truncate(): Object`

Deletes **all documents** in the collection in the client.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
const collection = client.collection('some-collection');
await collection.truncate();
// the collection "some-collection" is now empty
```

## collection.drop

`async collection.drop([properties]): Object`

Deletes the collection from the client.

**Arguments**

- **properties**: `Object` (optional)

  An object with the following properties:

  - **isSystem**: `Boolean` (Default: `false`)

    Whether the collection should be dropped even if it is a system collection.

    This parameter must be set to `true` when dropping a system collection.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const collection = client.collection('some-collection');
await collection.drop();
// the collection "some-collection" no longer exists
```

The Simple Way

**Examples**

```js
//Instance with login
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"}); //OR with apikey
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});
```

## client.createCollection

`async collection.createCollection(collectionName, [properties]): Object`

Creates collection

```js
await client.createCollection('some-collection');
```

## client.deleteCollection

`async collection.deleteCollection(collectionName, [properties]): Object`

Deletes collection

```js
await client.deleteCollection('some-collection');
```

## client.hasCollection

`async collection.hasCollection(collectionName): Boolean`

Returns true if collection exists else false

```js
await client.hasCollection('some-collection');
```

## client.getCollection

`async collection.getCollection(collectionName): Object`

Returns collection

```js
const collection = await client.getCollection('some-collection');
```

## client.getCollections

`async collection.getCollections(collectionName): Array<Object>`

Returns collections

```js
const collections = await client.getCollections('some-collection');
```

## client.getCollectionIds

`async collection.getCollectionIds(collectionName): Array<Object>`

Returns collection Ids

```js
const collectionIds = await client.getCollectionIds('some-collection');
```

## client.getCollectionKeys

`async collection.getCollectionKeys(collectionName): Array<Object>`

Returns collections keys

```js
const collectionKeys = await client.getCollectionKeys('some-collection');
```

## client.onCollectionChange

`async client.onCollectionChange(collectionName, [subscriptionName], [dcName]): void`

```js
const listener = client.onCollectionChange("some-collection");

listener.on('message',(msg) => console.log("message=>", msg));
listener.on('open',() => console.log("connection open"));
listener.on('close',() => console.log("connection closed");
```