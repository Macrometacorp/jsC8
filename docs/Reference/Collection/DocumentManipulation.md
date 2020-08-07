## Manipulating documents

These functions implement the [HTTP API for manipulating documents](https://developer.document360.io/docs/documents).

## client.updateDocument

`async client.updateDocument(collectionName, documentHandle, newValue, [opts]): Object`

Updates document with given value in collection

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **documentHandle**: `string`

  Handle of the document to update. This can be either the `_id` or the `_key`
  of a document in the collection, or a document (i.e. an object with an `_id`
  or `_key` property).

* **newValue**: `Object`

  The new data of the document.

* **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  * **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  * **keepNull**: `boolean` (Default: `true`)

    If set to `false`, properties with a value of `null` indicate that a
    property should be deleted.

  * **mergeObjects**: `boolean` (Default: `true`)

    If set to `false`, object properties that already exist in the old document
    will be overwritten rather than merged. This does not affect arrays.

  * **returnOld**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete previous revision of the
    changed documents under the attribute `old` in the result.

  * **returnNew**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete new documents under the
    attribute `new` in the result.

  * **ignoreRevs**: `boolean` (Default: `true`)

    By default, or if this is set to true, the _rev attributes in the given
    documents are ignored. If this is set to false, then any _rev attribute
    given in a body document is taken as a precondition. The document is only
    updated if the current revision is the one specified.

  * **rev**: `string` (optional)

    Only update the document if it matches this revision.

  * **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.

Note:- If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const updatedDoc  = await client.updateDocument("some-collection", "some_key", { some: "data" });
```

## client.updateDocuments

`async client.updateDocuments(collectionName, Array<documentHandle>, [opts]): Array<Object>`

Updates documents with given value in collection

**Arguments**

- **collectionName**: `string`

  Name of the collection
  
* **documentHandle**: `Array<Object>`

  Handle of the documents to update. This can be either the `_id` or the `_key`
  of a document in the collection, or a document (i.e. an object with an `_id`
  or `_key` property).
  
  It must include `_Key`.

* **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  * **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  * **keepNull**: `boolean` (Default: `true`)

    If set to `false`, properties with a value of `null` indicate that a
    property should be deleted.

  * **mergeObjects**: `boolean` (Default: `true`)

    If set to `false`, object properties that already exist in the old document
    will be overwritten rather than merged. This does not affect arrays.

  * **returnOld**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete previous revision of the
    changed documents under the attribute `old` in the result.

  * **returnNew**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete new documents under the
    attribute `new` in the result.

  * **ignoreRevs**: `boolean` (Default: `true`)

    By default, or if this is set to true, the _rev attributes in the given
    documents are ignored. If this is set to false, then any _rev attribute
    given in a body document is taken as a precondition. The document is only
    updated if the current revision is the one specified.

  * **rev**: `string` (optional)

    Only update the document if it matches this revision.

  * **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.

Note:- If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const updatedDocs = await client.updateDocuments("some-collection", [{ _key: "some_key", some: "data" }]);
```

## client.replaceDocument

`async client.replaceDocument(collectionName, documentHandle, newValue, [opts]): Object`

Replaces document with given value in collection

Note:-The `policy` option is not available when using the driver with C8 3.0 as it is redundant when specifying the `rev`option.

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **documentHandle**: `string`

  The handle of the document to replace. This can either be the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

* **newValue**: `Object`

  The new data of the document.

* **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  * **waitForSync**: `boolean` (Default: `false`)

    Wait until the document has been synced to disk. Default: `false`.

  * **rev**: `string` (optional)

    Only replace the document if it matches this revision.

  * **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.
      
Note:-If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const replacedDoc  = await client.replaceDocument("some-collection", "some_key", { some: "data" });
```

## client.replaceDocumentMany

`async client.replaceDocumentMany(collectionName, Array<documentHandle>, [opts]): Array<Object>`

Replaces documents with given value in collection

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **documentHandle**: `Array<Object>`

  The handle of the document to replace. This can either be the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

  It must include `_Key`.

* **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  * **waitForSync**: `boolean` (Default: `false`)

    Wait until the document has been synced to disk. Default: `false`.

  * **rev**: `string` (optional)

    Only replace the document if it matches this revision.

  * **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.
      
Note:-If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const replacedDocs = await client.replaceDocumentMany("some-collection", [{ _key: "some_key", some: "data" }]);
```

## client.deleteDocument

`async client.deleteDocument(collectionName, documentHandle, [opts]): Object`

Deletes document in collection

Note:- The `policy` option is not available when using the driver with C8 3.0 as it is redundant when specifying the `rev`option.

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **documentHandle**: `string`

  The handle of the document to delete. This can be either the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

* **opts**: `Object` (optional)

  If `opts` is set, it must be an object with any of the following properties:

  * **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  * **rev**: `string` (optional)

    Only update the document if it matches this revision.

  * **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.

Note:-If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const deletedDoc  = await client.deleteDocument("some-collection", "some_key", { some: "data" });
```

## client.deleteDocumentMany

`async client.deleteDocumentMany(collectionName, Array<string> | Array<documentHandle>, [opts]): Array<Object>`

Deletes documents in collection

*Arguments**

- **collectionName**: `string`

  Name of the collection

* **documentHandle**: `string`

  The handle of the document to delete. This can be either the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

  It must include `_key`.

* **opts**: `Object` (optional)

  If `opts` is set, it must be an object with any of the following properties:

  * **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  * **rev**: `string` (optional)

    Only update the document if it matches this revision.

  * **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.

Note:-If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const deletedDocs = await client.deleteDocumentMany("some-collection", [{ _key: "some_key", some: "data" }]);
```

Advanced User

## collection.replace

`async collection.replace(documentHandle, newValue, [opts]): Object`

Replaces the content of the document with the given `documentHandle` with the
given `newValue` and returns an object containing the document's metadata.

Note:-The `policy` option is not available when using the driver with C8 3.0 as it is redundant when specifying the `rev`option.

**Arguments**

* **documentHandle**: `string`

  The handle of the document to replace. This can either be the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

* **newValue**: `Object`

  The new data of the document.

* **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  * **waitForSync**: `boolean` (Default: `false`)

    Wait until the document has been synced to disk. Default: `false`.

  * **rev**: `string` (optional)

    Only replace the document if it matches this revision.

  * **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.
      
Note:-If a string is passed instead of an options object, it will be interpreted as the `rev` option.


**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
const collection = client.collection('some-collection');
const data = {number: 1, hello: 'world'};
const info1 = await collection.save(data);
const info2 = await collection.replace(info1, {number: 2});
assert.equal(info2._id, info1._id);
assert.notEqual(info2._rev, info1._rev);
const doc = await collection.document(info1);
assert.equal(doc._id, info1._id);
assert.equal(doc._rev, info2._rev);
assert.equal(doc.number, 2);
assert.equal(doc.hello, undefined);
```

## collection.update

`async collection.update(documentHandle, newValue, [opts]): Object`

Updates (merges) the content of the document with the given _documentHandle_
with the given _newValue_ and returns an object containing the document's
metadata.

Note:-The _policy_ option is not available when using the driver with C8 3.0 as it is redundant when specifying the `rev`option.

**Arguments**

* **documentHandle**: `string`

  Handle of the document to update. This can be either the `_id` or the `_key`
  of a document in the collection, or a document (i.e. an object with an `_id`
  or `_key` property).

* **newValue**: `Object`

  The new data of the document.

* **opts**: `Object` (optional)

  If _opts_ is set, it must be an object with any of the following properties:

  * **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  * **keepNull**: `boolean` (Default: `true`)

    If set to `false`, properties with a value of `null` indicate that a
    property should be deleted.

  * **mergeObjects**: `boolean` (Default: `true`)

    If set to `false`, object properties that already exist in the old document
    will be overwritten rather than merged. This does not affect arrays.

  * **returnOld**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete previous revision of the
    changed documents under the attribute `old` in the result.

  * **returnNew**: `boolean` (Default: `false`)

    If set to `true`, return additionally the complete new documents under the
    attribute `new` in the result.

  * **ignoreRevs**: `boolean` (Default: `true`)

    By default, or if this is set to true, the _rev attributes in the given
    documents are ignored. If this is set to false, then any _rev attribute
    given in a body document is taken as a precondition. The document is only
    updated if the current revision is the one specified.

  * **rev**: `string` (optional)

    Only update the document if it matches this revision.

  * **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.

Note:- If a string is passed instead of an options object, it will be interpreted as the `rev` option.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
const collection = client.collection('some-collection');
const doc = {number: 1, hello: 'world'};
const doc1 = await collection.save(doc);
const doc2 = await collection.update(doc1, {number: 2});
assert.equal(doc2._id, doc1._id);
assert.notEqual(doc2._rev, doc1._rev);
const doc3 = await collection.document(doc2);
assert.equal(doc3._id, doc2._id);
assert.equal(doc3._rev, doc2._rev);
assert.equal(doc3.number, 2);
assert.equal(doc3.hello, doc.hello);
```


## collection.remove

`async collection.remove(documentHandle, [opts]): Object`

Deletes the document with the given `documentHandle` from the collection.

Note:- The `policy` option is not available when using the driver with C8 3.0 as it is redundant when specifying the `rev`option.

**Arguments**

* **documentHandle**: `string`

  The handle of the document to delete. This can be either the `_id` or the
  `_key` of a document in the collection, or a document (i.e. an object with an
  `_id` or `_key` property).

* **opts**: `Object` (optional)

  If `opts` is set, it must be an object with any of the following properties:

  * **waitForSync**: `boolean` (Default: `false`)

    Wait until document has been synced to disk.

  * **rev**: `string` (optional)

    Only update the document if it matches this revision.

  * **policy**: `string` (optional)

    Determines the behaviour when the revision is not matched:

    * if _policy_ is set to `"last"`, the document will be replaced regardless
      of the revision.
    * if _policy_ is set to `"error"` or not set, the replacement will fail with
      an error.

Note:-If a string is passed instead of an options object, it will be interpreted as the `rev` option.

For more information on the `opts` object, see [the HTTP API documentation for working with documents](https://developer.document360.io/docs/documents).

**Examples**

```js
const client = new jsc8();
const collection = client.collection('some-collection');

await collection.remove('some-doc');
// document 'some-collection/some-doc' no longer exists

// -- or --

await collection.remove('some-collection/some-doc');
// document 'some-collection/some-doc' no longer exists
```