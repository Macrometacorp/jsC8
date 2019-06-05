# Manipulating the collection

These functions implement
[the HTTP API for modifying collections](https://docs.macrometa.io/jsC8/latest/HTTP/Collection/Modifying.html).

## collection.create

`async collection.create([properties]): Object`

Creates a collection with the given _properties_ for this collection's name,
then returns the server response.

**Arguments**

- **properties**: `Object` (optional)

  For more information on the _properties_ object, see
  [the HTTP API documentation for creating collections](https://docs.macrometa.io/jsC8/latest/HTTP/Collection/Creating.html).

**Examples**

```js
const fabric = new Fabric();
const collection = fabric.collection('potatoes');
await collection.create()
// the document collection "potatoes" now exists

// -- or --

const collection = fabric.edgeCollection('friends');
await collection.create({
  waitForSync: true // always sync document changes to disk
});
// the edge collection "friends" now exists
```

To make the collection as `spot`, pass the `isSpot: true` in the `properties` object.


## collection.rename

`async collection.rename(name): Object`

Renames the collection. The _Collection_ instance will automatically update its
name when the rename succeeds.

**Examples**

```js
const fabric = new Fabric();
const collection = fabric.collection('some-collection');
const result = await collection.rename('new-collection-name')
assert.equal(result.name, 'new-collection-name');
assert.equal(collection.name, result.name);
// result contains additional information about the collection
```


## collection.truncate

`async collection.truncate(): Object`

Deletes **all documents** in the collection in the fabric.

**Examples**

```js
const fabric = new Fabric();
const collection = fabric.collection('some-collection');
await collection.truncate();
// the collection "some-collection" is now empty
```

## collection.drop

`async collection.drop([properties]): Object`

Deletes the collection from the fabric.

**Arguments**

- **properties**: `Object` (optional)

  An object with the following properties:

  - **isSystem**: `Boolean` (Default: `false`)

    Whether the collection should be dropped even if it is a system collection.

    This parameter must be set to `true` when dropping a system collection.

  For more information on the _properties_ object, see
  [the HTTP API documentation for dropping collections](https://docs.macrometa.io/jsC8/latest/HTTP/Collection/Creating.html#drops-a-collection).
  **Examples**

```js
const fabric = new Fabric();
const collection = fabric.collection('some-collection');
await collection.drop();
// the collection "some-collection" no longer exists
```
