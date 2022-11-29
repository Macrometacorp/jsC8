## ImportAndExport


## client.exportDataByQuery

`async client.exportDataByQuery(query, [bindVars])`

Execute the query and return list of result documents. query cannot contains the following keywords: INSERT, UPDATE, REPLACE and REMOVE. Offset, limit and order are not applied. You must specify them in the query.

 **Arguments**

- **query**: `string`

- **bindVars**: `Object` (optional)

  An object defining the variables to bind the query to.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.exportDataByQuery('FOR x in some-collection LIMIT 0, 1000 RETURN x');
```

## client.exportDataByCollectionName

`async client.exportDataByCollectionName(collectionName, [params])`

 Return a list of documents in the specified collection. If offset, limit and order are not specified their default values will be applied.


 **Arguments**

- **collectionName**: `string`

- **params**: `object` (optional)
   
    - **offset**: `string`

        This option can be used to simulate paging. Default 0

    - **limit**: `string`

        This option can be used to simulate paging. Limit the result. Default 20, max 1000

    - **order**: `string`

        Order the results asc or desc. Default asc

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.exportDataByCollectionName('collection-name', {});
```

## client.importDocuments

`async client.importDocuments(collectionName, data, details, primaryKey, replace)`

 Create documents in the collection identified by collection parameter.

 **Arguments**

- **collectionName**: `string`

- **data**: `Array<object>`

    data should be an array of json documents. Each document is interpreted separately.

- **details**: `string`

    details if true extra information for errors and unprocessed documents will be returned in the result.

- **primaryKey**: `string`

     if specified, this attribute will be used as _key of the new document. It must follow https://macrometa.dev/documents/naming-conventions/#document-keys . If document already contains _key then it will be renamed as old_key.

- **replace**: `boolean`

      if true existing document having same _key in the collection, shall be replaced

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.importDocuments('collection-name', [{key:value}], true, 'key', true);
```
