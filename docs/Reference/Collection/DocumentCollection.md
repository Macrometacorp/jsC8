## DocumentCollection 

The `DocumentCollection API` extends the [_Collection API_](https://developer.document360.io/docs/overview-4)        with the following methods.

## client.getDocument

`async client.getDocument(collectionName, documentHandle, [graceful]): Object`

Returns document for given collection

**Arguments**

- **collectionName**: `string`

  Name of the collection

- **documentHandle**: `string`

  The handle of the document to retrieve. This can be either the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

- **graceful**: `boolean` (Default: `false`)

  If set to `true`, the method will return `null` instead of throwing an error
  if the document does not exist.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const doc = await client.getDocument('some-collection', 'some-key');
```

## client.getDocumentMany

`async client.getDocumentMany(collectionName, [limit], [skip]): Array<Object>`

Returns documents for given collection

**Arguments**

- **collectionName**: `string`

  Name of the collection

- **limit**: `number`

  returns the recent most documents of given limit

- **skip**: `number`

  skips the recent most documents from given limit

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const docs = await client.getDocumentMany('some-collection', 10, 2);
```

## client.insertDocument

`async client.insertDocument(collectionName, data, [opts]): Object`

Inserts document in collection

**Arguments**

- **collectionName**: `string`

  Name of the collection

- **data**: `Object`

  The data of the new document, may include a `_key`.

- **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  - **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  - **returnNew**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete new documents under the
    attribute `new` in the result.

  - **returnOld**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete old documents under the
    attribute `old` in the result.

  - **silent**: `boolean` (Default: `false`)

    If set to true, an empty object will be returned as response. No meta-data
    will be returned for the created document. This option can be used to save
    some network traffic.

  - **overwrite**: `boolean` (Default: `false`)

    If set to true, the insert becomes a replace-insert. If a document with the
    same \_key already exists the new document is not rejected with unique
    constraint violated but will replace the old document.

@(Info)(Note:-)(If a boolean is passed instead of an options object, it will be interpreted as the `returnNew` option.)

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const insertedDoc = await client.insertDocument("some-collection", {some: 'data'});
```

## client.insertDocumentMany

`async client.insertDocumentMany(collectionName, data, [opts]): Array<Object>`

Inserts documents in collection

**Arguments**

- **collectionName**: `string`

  Name of the collection

- **data**: `Array<Object>`

  The data of the new documents, may include a `_key`.

- **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  - **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  - **returnNew**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete new documents under the
    attribute `new` in the result.

  - **returnOld**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete old documents under the
    attribute `old` in the result.

  - **silent**: `boolean` (Default: `false`)

    If set to true, an empty object will be returned as response. No meta-data
    will be returned for the created document. This option can be used to save
    some network traffic.

  - **overwrite**: `boolean` (Default: `false`)

    If set to true, the insert becomes a replace-insert. If a document with the
    same \_key already exists the new document is not rejected with unique
    constraint violated but will replace the old document.

@(Info)(Note:-)(If a boolean is passed instead of an options object, it will be interpreted as the `returnNew` option.)

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const insertedDocs = await client.insertDocumentMany("some-collection", [{some: 'data'}]);
```

## client.insertDocumentFromFile

`async client.insertDocumentFromFile(collectionName, csvPath, [opts]): Array<Object>`

Inserts documents from file. Only accepts CSV file.

**Arguments**

- **collectionName**: `string`

  Name of the collection

- **csvPath**: `string`

  path of the csv file

- **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  - **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  - **returnNew**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete new documents under the
    attribute `new` in the result.

  - **returnOld**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete old documents under the
    attribute `old` in the result.

  - **silent**: `boolean` (Default: `false`)

    If set to true, an empty object will be returned as response. No meta-data
    will be returned for the created document. This option can be used to save
    some network traffic.

  - **overwrite**: `boolean` (Default: `false`)

    If set to true, the insert becomes a replace-insert. If a document with the
    same \_key already exists the new document is not rejected with unique
    constraint violated but will replace the old document.

@(Info)(Note:-)(If a boolean is passed instead of an options object, it will be interpreted as the `returnNew` option.)

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const insertedDocsFromFile  = await client.insertDocumentFromFile("some-collection", '~/data.csv');
```

## Advanced User

## documentCollection.document

`async documentCollection.document(documentHandle, [graceful]): Object`

Retrieves the document with the given `documentHandle` from the collection.

**Arguments**

- **documentHandle**: `string`

  The handle of the document to retrieve. This can be either the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

- **graceful**: `boolean` (Default: `false`)

  If set to `true`, the method will return `null` instead of throwing an error
  if the document does not exist.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
const collection = client.collection('my-docs');

try {
  const doc = await collection.document('some-key');
  // the document exists
  assert.equal(doc._key, 'some-key');
  assert.equal(doc._id, 'my-docs/some-key');
} catch (err) {
  // something went wrong or
  // the document does not exist
}

// -- or --

try {
  const doc = await collection.document('my-docs/some-key');
  // the document exists
  assert.equal(doc._key, 'some-key');
  assert.equal(doc._id, 'my-docs/some-key');
} catch (err) {
  // something went wrong or
  // the document does not exist
}

// -- or --

const doc = await collection.document('some-key', true);
if (doc === null) {
  // the document does not exist
}
```

## documentCollection.documentExists

`async documentCollection.documentExists(documentHandle): boolean`

Checks whether the document with the given `documentHandle` exists.

**Arguments**

- **documentHandle**: `string`

  The handle of the document to retrieve. This can be either the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
const collection = client.collection('my-docs');

const exists = await collection.documentExists('some-key');
if (exists === false) {
  // the document does not exist
}
```

## documentCollection.save

`async documentCollection.save(data, [opts]): Object`

Creates a new document with the given `data` and returns an object containing
the document's metadata.

**Arguments**

- **data**: `Object`

  The data of the new document, may include a `_key`.

- **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  - **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  - **returnNew**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete new documents under the
    attribute `new` in the result.

  - **returnOld**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete old documents under the
    attribute `old` in the result.

  - **silent**: `boolean` (Default: `false`)

    If set to true, an empty object will be returned as response. No meta-data
    will be returned for the created document. This option can be used to save
    some network traffic.

  - **overwrite**: `boolean` (Default: `false`)

    If set to true, the insert becomes a replace-insert. If a document with the
    same \_key already exists the new document is not rejected with unique
    constraint violated but will replace the old document.

@(Info)(Note:-)(If a boolean is passed instead of an options object, it will be interpreted as the `returnNew` option.)

For more information on the _opts_ object, see
[the HTTP API documentation for working with documents](https://developer.document360.io/docs/documents).

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
const collection = client.collection('my-docs');
const data = {some: 'data'};
const info = await collection.save(data);
assert.equal(info._id, 'my-docs/' + info._key);
const doc2 = await collection.document(info)
assert.equal(doc2._id, info._id);
assert.equal(doc2._rev, info._rev);
assert.equal(doc2.some, data.some);

// -- or --

const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
const collection = client.collection('my-docs');
const data = {some: 'data'};
const opts = {returnNew: true};
const doc = await collection.save(data, opts)
assert.equal(doc1._id, 'my-docs/' + doc1._key);
assert.equal(doc1.new.some, data.some);
```
