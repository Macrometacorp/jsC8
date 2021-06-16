## ImportAndExport (ImportAndExport)


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

const result = await client.getDataByQuery();
```

## client.getDataByCollectionName

`async client.getDataByCollectionName(collectionName,param)`

 Return a list of documents in the specified collection. If offset, limit and order are not specified their default values will be applied.


 **Arguments**

- **collectionName**: `string`

- **param**: `object` (optional)
   
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

const result = await client.getDataByCollectionName('collectionName','param');
```


## client.createDocuments

`async client.createDocuments(collectionName,data,details)`

 Create documents in the collection identified by collection parameter.

 **Arguments**

- **collectionName**: `string`

- **data**: `Array<object>`

    data should be an array of json documents. Each document is interpreted separately.

- **details**: `string`

    details if true extra information for errors and unprocessed documents will be returned in the result.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.createDocuments('collectionName','data','details');
```
