# RESTQL 

## client.saveQuery

`client.saveQuery(queryName, parameter, value): this`

Saves the Query with queryName and value.

**Arguments**

- **queryName**: `string`

  The name of the query to save.

- **parameter**: `any`
   
   Parameters to the saved query.

- **value**: `string`

    The query you want to save.



**Examples**

```js
const client = new jsc8();
client.saveQuery("testQuery", {}, "FOR x IN TestCollection RETURN x");
```

## client.listSavedQueries

`client.listSavedQueries()`

Returns a list of all saved queries for a particular tenant and client.


```js
const client = new jsc8();
const tenant = client.listSavedQueries();
```

## client.executeSavedQuery

`  client.executeSavedQuery(queryName: string, bindVars: any)`

Executes a saves query


**Arguments**

- **queryName**: `string`

  The name of the query to be executed.

- **bindVars**: `any`

    The variables you wish to pass to a query.

**Examples**

```js
const client = new jsc8();
client.executeSavedQuery("testQuery", {});
```

## client.updateSavedQuery

` updateSavedQuery(queryName: string, parameter: Object, value: string) `

Updates a query that is already saved.

**Arguments**

- **queryName**: `string`

  The name of the query to be updated.

- **parameter**: `object`

  An optional JSON object which can provide parameters to the query.

**Examples**

```js
const client = new jsc8();

faric.updateSavedQuery("testQuery", {}, "FOR x IN _routing RETURN x" )
```

## client.deleteSavedQuery


`client.deleteSavedQuery(queryName: string) `

Deletes the saved query.


**Arguments**

- **queryName**: `string`

  The name of the query to be deleted.

**Examples**

```js
const client = new jsc8();
client.deleteSavedQuery("testQuery")
```

## client.createRestqlCursor(query: string, bindVars: any)


`  createRestqlCursor(query: string, bindVars: any)`

Creates a restql cursor for running a query.

**Arguments**

- **query**: `string`

  The query to be executed.

- **bindVars**: `any`

    The variables if needed, for the query to execute.

**Examples**

```js
const client = new jsc8();
client.createRestqlCursor(query: "FOR x IN TestCollection RETURN x", bindVars: {})

```
