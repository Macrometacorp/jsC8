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

`async collection.onChange(callbackObject, dcName, subscriptionName): void`

**Arguments**

- **callbackObj**: `{ onopen, onclose, onerror, onmessage }`

  An object having required callbacks. `onmessage` is necessary.

- **dcName**: `string``

  The dcName for the consumer.

- **subscriptionName**: `string`

  The name of the subscription.

**Examples**

```js
  collection.onChange({
    onmessage: (msg) => console.log("message=>", msg),
    onopen: async () => {
      console.log("connection open");
      //manipulate the collection here

      // add new documents to the collection
      await collection.save({ firstname: 'Jean', lastname: 'Picard' });
      await collection.save({ firstname: 'Bruce', lastname: 'Wayne' });

    },
    onclose: () => console.log("connection closed")
  }, "fed.macrometa.io", "mySub");
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
client.useTenant(tenant-name)
const collection = client.collection('some-collection');
await collection.drop();
// the collection "some-collection" no longer exists
```
