## Manipulating the collection

These functions implement [the HTTP API for modifying collections](https://developer.document360.io/docs/using-c8-rest-api)

## client.createCollection

`async client.createCollection(collectionName, [properties], [isEdge]): Object`

Creates collection

**Arguments**

- **collectionName**: `string`
  Name of the collection

- **properties**: `Object` (optional)

    - **stream**: `boolean` (optional)

        If it is set to true then creates a local stream for collection. Default is false.

    - **waitForSync**: `boolean` (optional)

        If true then creating or changing a document will wait until the data has been synchronized to disk. Default is false.

    - **isSystem**: `boolean` (optional)

         If true, create a system collection.  Default is false.

    - **isLocal**: `boolean` (optional)

        If true, create a local collection. For a local collection data is not replicated across regions. Default is false.

- **isEdge**: `boolean` (optional)
  If yes then it will create an Edge Collection. Default is false.
  Note:- If this prop is provided then no need to pass type in properties object.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.createCollection('some-collection');
```

## client.deleteCollection

`async client.deleteCollection(collectionName, [opts]): Object`

Deletes collection

**Arguments**

- **collectionName**: `string`
  Name of the collection

- **opts**: `Object` (optional)
  An object with the following properties:

  - **isSystem**: `boolean` (Default: `false`)

    Whether the collection should be dropped even if it is a system collection.

    This parameter must be set to `true` when dropping a system collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.deleteCollection('some-collection');
```

## client.hasCollection

`async client.hasCollection(collectionName): Boolean`

Returns true if collection exists otherwise false

**Arguments**

- **collectionName**: `string`
  Name of the collection

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const hasCollection = await client.hasCollection('some-collection');
```

## client.getCollection

`async client.getCollection(collectionName): Object`

Returns collection info

**Arguments**

- **collectionName**: `string`
  Name of the collection

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = await client.getCollection('some-collection');
```

## client.getCollections

`async client.getCollections(collectionName): Array<Object>`

Returns collections info

**Arguments**

- **collectionName**: `string`
  Name of the collection

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collections = await client.getCollections('some-collection');
```

## client.getCollectionIds

`async client.getCollectionIds(collectionName): Array<Object>`

Returns collection Ids

**Arguments**

- **collectionName**: `string`
  Name of the collection

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collectionIds = await client.getCollectionIds('some-collection');
```

## client.getCollectionKeys

`async client.getCollectionKeys(collectionName): Array<Object>`

Returns collections keys

**Arguments**

- **collectionName**: `string`
  Name of the collection

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collectionKeys = await client.getCollectionKeys('some-collection');
```

## client.onCollectionChange

`async client.onCollectionChange(collectionName, [subscriptionName], [dcName]): void`

**Arguments**

- **collectionName**: `string`
  Name of the collection

- **dcName**: `string` (optional)

  The dcName for the consumer.

- **subscriptionName**: `string` (optional)

  The name of the subscription.

**Methods**

`listener.on('open', callback )`

`listener.on('message', callback )`

`listener.on('close', callback )`

`listener.on('error', callback )`

`listener.close()`

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const listener = await client.onCollectionChange("some-collection");

listener.on('message',(msg) => console.log("message=>", msg));
listener.on('open',() => console.log("connection open"));
listener.on('close',() => console.log("connection closed"));
```

## client.updateCollectionProperties

`async client.updateCollectionProperties(collectionName, properties): Object`

Updates the collection properties.

**Arguments**

- **collectionName**: `string`
  Name of the collection

- **properties**: `Object` 

    - **hasStream**: `boolean`

        Whether the stream should be enabled on the collection or not.
        This parameter must be set to `true` when enabling a stream on the collection.

    - **waitForSync**: `boolean`

        If true then creating or changing a document will wait until the data has been synchronized to disk.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = await client.updateCollectionProperties('some-collection', { hasStream: true, waitForSync: true });

```
# Advanced User

## collection.create

`async collection.create([properties]): Object`

Creates a collection with the given `properties` for this collection's name, then returns the server response.

**Arguments**

- **properties**: `Object` (optional)

    - **stream**: `boolean` (optional)

        If it is set to true then creates a local stream for collection. Default is false.

    - **waitForSync**: `boolean` (optional)

        If true then creating or changing a document will wait until the data has been synchronized to disk. Default is false.

    - **isSystem**: `boolean` (optional)

         If true, create a system collection.  Default is false.

    - **isLocal**: `boolean` (optional)

        If true, create a local collection. For a local collection data is not replicated across regions. Default is false.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

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
const listener = await collection.onChange("fed.macrometa.io", "mySub");

listener.on('message',(msg) => console.log("message=>", msg));
listener.on('open',() => console.log("connection open"));
listener.on('close',() => console.log("connection closed"));

```


## collection.rename

`async collection.rename(name): Object`

Renames the collection. The  `Collection` instance will automatically update its name when the rename succeeds.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

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
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

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

  - **isSystem**: `boolean` (Default: `false`)

    Whether the collection should be dropped even if it is a system collection.

    This parameter must be set to `true` when dropping a system collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
await collection.drop();
// the collection "some-collection" no longer exists
```

## collection.updateCollectionProperties

`async collection.updateCollectionProperties(properties): Object`

Updates the collection properties.

**Arguments**

- **properties**: `Object` 

    - **hasStream**: `boolean`

        Whether the stream should be enabled on the collection or not.
        This parameter must be set to `true` when enabling a stream on the collection.

    - **waitForSync**: `boolean`

        If true then creating or changing a document will wait until the data has been synchronized to disk.


**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
await collection.updateCollectionProperties({ hasStream: true, waitForSync: false });
```