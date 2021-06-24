## ImportAndExport


## client.getDataByQuery

`async client.getDataByQuery(query)`

Execute the query and return list of result documents. query cannot contains the following keywords: INSERT, UPDATE, REPLACE and REMOVE. Offset, limit and order are not applied. You must specify them in the query.

 **Arguments**

- **query**: `string`

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getDataByQuery('FOR x in some-collection LIMIT 0, 1000 RETURN x');
```

## client.getDataByCollectionName

`async client.getDataByCollectionName(collectionName, [params])`

 Return a list of documents in the specified collection. If offset, limit and order are not specified their default values will be applied.


 **Arguments**

- **collectionName**: `string`

- **params**: `object` (optional)
   
    - **offset**: `string`

        This option can be used to simulate paging. Default 0

    - **limit**: `string`

        This option can be used to simulate paging. Limit the result. Default 20, max 100

    - **order**: `string`

        Order the results asc or desc. Default asc

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getDataByCollectionName('collection-name', {});
```

## client.createDocuments

`async client.createDocuments(collectionName, data, details, primaryKey, replace)`

 Create documents in the collection identified by collection parameter.

 **Arguments**

- **collectionName**: `string`

- **data**: `Array<object>`

    data should be an array of json documents. Each document is interpreted separately.

- **details**: `string`

    details if true extra information for errors and unprocessed documents will be returned in the result.

- **primaryKey**: `string`

     if specified, this attribure will be used as _key of the new document. It must follow https://macrometa.dev/documents/naming-conventions/#document-keys . If document already contains _key then it will be renamed as old_key.

- **replace**: `boolean`

      if true existing document having same _key in the collection, shall be replaced

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.createDocuments('collection-name', [{key:value}], true, 'key', true);
```
