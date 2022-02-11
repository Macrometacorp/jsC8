## Manipulating indexes

## client.listCollectionIndexes

`async client.listCollectionIndexes(collectionName): Array<Object>`

Returns list of indexes for given collection

**Arguments**

- **collectionName**: `string`

  Name of the collection

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collectionIndexes = await client.listCollectionIndexes("some-collection");
```

## client.addHashIndex

`async client.addHashIndex(collectionName, fields, [opts]): Object`

Creates a Hash index on the collection.

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. If the
  value is a string, it will be wrapped in an array automatically.

* **opts**: `Object` (optional)

  An object containing additional properties of the index.

    * **name**: `string` 

      Name of the index. If left blank, a name will be generated automatically.

    * **unique**: `boolean` 

      If true, then create a unique index.

    * **sparse**: `boolean` 

      If true, then create a sparse index.

    * **deduplicate**: `boolean` 

      If false, the deduplication of array values is turned off.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const hashIndex = await client.addHashIndex("some-collection", ['some-field'], { unique: true, sparse: true, deduplicate: true });
```

## client.addGeoIndex

`async client.addGeoIndex(collectionName, fields, [opts]): Object`

Creates a Geo index on the collection.

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. If the
  value is a string, it will be wrapped in an array automatically.

* **opts**: `Object` (optional)

  An object containing additional properties of the index.

    * **name**: `string` 

      Name of the index. If left blank, a name will be generated automatically.

    * **geoJson**: `string` 

      If a geo-spatial index on a location is constructed and geoJson is true, then the order within the array is longitude followed by latitude. This corresponds to the format described in http://geojson.org/geojson-spec.html#positions.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const geoIndex = await client.addGeoIndex("some-collection", ['some-field'], { geoJson: 'some-text' });
```

## client.addSkiplistIndex

`async client.addSkiplistIndex(collectionName, fields, [opts]): Object`

Creates a skiplist index on the collection.

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. If the
  value is a string, it will be wrapped in an array automatically.

* **opts**: `Object` (optional)

  An object containing additional properties of the index.

    * **name**: `string` 

      Name of the index. If left blank, a name will be generated automatically.

    * **unique**: `boolean` 

      If true, then create a unique index.

    * **sparse**: `boolean` 

      If true, then create a sparse index.

    * **deduplicate**: `boolean` 

      If false, the deduplication of array values is turned off.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const skiplistIndex = await client.addSkiplistIndex("some-collection", ['some-field'], { unique: true, sparse: true, deduplicate: true });
```

## client.addPersistentIndex

`async client.addPersistentIndex(collectionName, fields, [opts]): Object`

Creates a Persistent index on the collection.

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. If the
  value is a string, it will be wrapped in an array automatically.

* **opts**: `Object` (optional)

  An object containing additional properties of the index.

    * **name**: `string` 

      Name of the index. If left blank, a name will be generated automatically.

    * **unique**: `boolean` 

      If true, then create a unique index.

    * **sparse**: `boolean` 

      If true, then create a sparse index.

    * **deduplicate**: `boolean` 

      It controls whether inserting duplicate index values from the same document into a unique array index will lead to a unique constraint error or not.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const persistentIndex = await client.addPersistentIndex("some-collection", ['some-field'], { unique: true, sparse: true, deduplicate: true });
```

## client.addFullTextIndex

`async client.addFullTextIndex(collectionName, fields, [opts]): Object`

Creates a FullText index on the collection.

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. If the
  value is a string, it will be wrapped in an array automatically.

  * **opts**: `Object` (optional)

    An object containing additional properties of the index.

    * **name**: `string` 

      Name of the index. If left blank, a name will be generated automatically.

    * **minLength**: `Number` 

      Minimum character length of words to index. Will default to a server-defined value if unspecified. It is thus recommended to set this value explicitly when creating the index.
  
**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const fullTextIndex = await client.addFullTextIndex("some-collection", 'description');
```

## client.addTtlIndex

`async client.addTtlIndex(collectionName, fields, expireAfter, [name]): Object`

Creates a Ttl index on the collection.

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. If the
  value is a string, it will be wrapped in an array automatically.

* **expireAfter**: `Number`

  The time (in seconds) after a document's creation after which the documents count as "expired".

* **name**: `string` (optional)

  Name of the index. If left blank, a name will be generated automatically.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const ttlIndex = await client.addTtlIndex("some-collection", 'description', 0);
```

## client.deleteIndex

`async client.deleteIndex(collectionName, indexName): Object`

Deletes index with given index name from given collection

**Arguments**

- **collectionName**: `string`

  Name of the collection

* **indexName**: `string`

  The handle of the index to delete. This can either be a fully-qualified identifier or the collection-specific key of the index. If the value is an object, its `name` property will be used instead.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const deletedIndex = await client.deleteIndex("some-collection", 'some-index');
```

## client.getCollectionIndexes

`async client.getCollectionIndexes(collectionName, indexName): Array<Object>`

Returns list of indexes for given collection

**Arguments**

- **collectionName**: `string`

  Name of the collection

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collectionIndexes = await client.getCollectionIndexes("some-collection");
```

# Advanced User

## collection.createIndex

`async collection.createIndex(details): Object`

Creates an arbitrary index on the collection.

**Arguments**

* **details**: `Object`


**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
const index = await collection.createIndex({type: 'hash', fields: ['a', 'a.b']});
// the index has been created with the handle `index.id`
```

## collection.createHashIndex

`async collection.createHashIndex(fields, [opts]): Object`

Creates a hash index on the collection.

**Arguments**

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. If the
  value is a string, it will be wrapped in an array automatically.

* **opts**: `Object` (optional)

  An object containing additional properties of the index.

    * **name**: `string` 

      Name of the index. If left blank, a name will be generated automatically.

    * **unique**: `boolean` 

      If true, then create a unique index.

    * **sparse**: `boolean` 

      If true, then create a sparse index.

    * **deduplicate**: `boolean` 

      If false, the deduplication of array values is turned off.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');

const index = await collection.createHashIndex('some-field', { unique: true, sparse: true, deduplicate: true });
// the index has been created with the handle `index.id`
assert.deepEqual(index.fields, ['some-field']);

// -- or --

const index = await collection.createHashIndex(['some-field'], { unique: true, sparse: true, deduplicate: true });
// the index has been created with the handle `index.id`
assert.deepEqual(index.fields, ['some-field']);
```

## collection.createSkipList

`async collection.createSkipList(fields, [opts]): Object`

Creates a skiplist index on the collection.

**Arguments**

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. If the value is a string, it will be wrapped in an array automatically.

* **opts**: `Object` (optional)

  An object containing additional properties of the index.

    * **name**: `string` 

      Name of the index. If left blank, a name will be generated automatically.

    * **unique**: `boolean` 

      If true, then create a unique index.

    * **sparse**: `boolean` 

      If true, then create a sparse index.

    * **deduplicate**: `boolean` 

      If false, the deduplication of array values is turned off.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');

const index = await collection.createSkipList('some-field')
// the index has been created with the handle `index.id`
assert.deepEqual(index.fields, ['some-field']);

// -- or --

const index = await collection.createSkipList(['some-field'], { unique: true, sparse: true, deduplicate: true })
// the index has been created with the handle `index.id`
assert.deepEqual(index.fields, ['some-field']);
```

## collection.createGeoIndex

`async collection.createGeoIndex(fields, [opts]): Object`

Creates a geo-spatial index on the collection.

**Arguments**

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. Currently, geo indexes must cover exactly one field. If the value is a string, it will be wrapped in an array automatically.

* **opts**: `Object` (optional)

  An object containing additional properties of the index.

    * **name**: `string` 

      Name of the index. If left blank, a name will be generated automatically.

    * **geoJson**: `string` 

      If a geo-spatial index on a location is constructed and geoJson is true, then the order within the array is longitude followed by latitude. This corresponds to the format described in http://geojson.org/geojson-spec.html#positions

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');

const index = await collection.createGeoIndex(['latitude', 'longitude']);
// the index has been created with the handle `index.id`
assert.deepEqual(index.fields, ['longitude', 'latitude']);

// -- or --

const index = await collection.createGeoIndex('location', {geoJson: true});
// the index has been created with the handle `index.id`
assert.deepEqual(index.fields, ['location']);
```

## collection.createFulltextIndex

`async collection.createFulltextIndex(fields, [opts]): Object`

Creates a fulltext index on the collection.

**Arguments**

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index. Currently, fulltext indexes must cover exactly one field. If the value is a string, it will be wrapped in an array automatically.

* **opts**: `Object` (optional)

  An object containing additional properties of the index.

  * **name**: `string` 

    Name of the index. If left blank, a name will be generated automatically.

  * **minLength**: `Number` 

    Minimum character length of words to index. Will default to a server-defined value if unspecified. It is thus recommended to set this value explicitly when creating the index.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');

const index = await collection.createFulltextIndex('description');
// the index has been created with the handle `index.id`
assert.deepEqual(index.fields, ['description']);

// -- or --

const index = await collection.createFulltextIndex(['description']);
// the index has been created with the handle `index.id`
assert.deepEqual(index.fields, ['description']);
```

## collection.createPersistentIndex

`async collection.createPersistentIndex(fields, [opts]): Object`

Creates a Persistent index on the collection. Persistent indexes are similarly in operation to skiplist indexes, only that these indexes are in disk as opposed to in memory. This reduces memory usage and DB startup time, with the trade-off being that it will always be orders of magnitude slower than in-memory indexes.

**Arguments**

* **fields**: `Array<string>`

  An array of names of document fields on which to create the index.

* **opts**: `Object` (optional)

  An object containing additional properties of the index.

    * **name**: `string` 

      Name of the index. If left blank, a name will be generated automatically.

    * **unique**: `boolean` 

      If true, then create a unique index.

    * **sparse**: `boolean` 

      If true, then create a sparse index.

    * **deduplicate**: `boolean` 

      It controls whether inserting duplicate index values from the same document into a unique array index will lead to a unique constraint error or not.
    

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');

const index = await collection.createPersistentIndex(['name', 'email'], { unique: true, sparse: true, deduplicate: true });
// the index has been created with the handle `index.id`
assert.deepEqual(index.fields, ['name', 'email']);
```

## collection.index

`async collection.index(indexHandle): Object`

Fetches information about the index with the given `indexHandle` and returns it.

**Arguments**

* **indexHandle**: `string`

  The handle of the index to look up. This can either be a fully-qualified identifier or the collection-specific key of the index. If the value is an object, its `id` property will be used instead.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
const index = await collection.createFulltextIndex('description');
const result = await collection.index(index.name);
assert.equal(result.name, index.name);
// result contains the properties of the index
```

## collection.indexes

`async collection.indexes(): Array<Object>`

Fetches a list of all indexes on this collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
await collection.createFulltextIndex('description')
const indexes = await collection.indexes();
assert.equal(indexes.length, 1);
// indexes contains information about the index
```

## collection.dropIndex

`async collection.dropIndex(indexHandle): Object`

Deletes the index with the given `indexHandle` from the collection.

**Arguments**

* **indexHandle**: `string`

  The handle of the index to delete. This can either be a fully-qualified identifier or the collection-specific key of the index. If the value is an object, its `id` property will be used instead.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');
const index = await collection.createFulltextIndex('description');
await collection.dropIndex(index.name);
// the index has been removed from the collection
```

## collection.createCapConstraint

`async collection.createCapConstraint(size): Object`

Creates a cap constraint index on the collection.

Note:-This method is not available when using the driver with C8 3.0 and higher as cap constraints are no longer supported.

**Arguments**

* **size**: `Object`

  An object with any of the following properties:

  * **size**: `number` (optional)

    The maximum number of documents in the collection.

  * **byteSize**: `number` (optional)

    The maximum size of active document data in the collection (in bytes).

If `size` is a number, it will be interpreted as `size.size`.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const collection = client.collection('some-collection');

const index = await collection.createCapConstraint(20)
// the index has been created with the handle `index.id`
assert.equal(index.size, 20);

// -- or --

const index = await collection.createCapConstraint({size: 20})
// the index has been created with the handle `index.id`
assert.equal(index.size, 20);
```
