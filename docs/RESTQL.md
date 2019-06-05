# RESTQL 

## fabric.saveQuery

`fabric.saveQuery(queryName, parameter, value): this`

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
const fabric = new Fabric();
fabric.saveQuery("testQuery", {}, "FOR x IN TestCollection RETURN x");
```

## fabric.listSavedQueries

`fabric.listSavedQueries()`

Returns a list of all saved queries for a particular tenant and fabric.


```js
const fabric = new Fabric();
const tenant = fabric.listSavedQueries();
```

## fabric.executeSavedQuery

`  fabric.executeSavedQuery(queryName: string, bindVars: any)`

Executes a saves query


**Arguments**

- **queryName**: `string`

  The name of the query to be executed.

- **bindVars**: `any`

    The variables you wish to pass to a query.

**Examples**

```js
const fabric = new Fabric();
fabric.executeSavedQuery("testQuery", {});
```

## fabric.updateSavedQuery

` updateSavedQuery(queryName: string, parameter: Object, value: string) `

Updates a query that is already saved.

**Arguments**

- **queryName**: `string`

  The name of the query to be updated.

- **parameter**: `object`

  An optional JSON object which can provide parameters to the query.

**Examples**

```js
const fabric = new Fabric();

faric.updateSavedQuery("testQuery", {}, "FOR x IN _routing RETURN x" )
```

## fabric.deleteSavedQuery


`fabric.deleteSavedQuery(queryName: string) `

Deletes the saved query.


**Arguments**

- **queryName**: `string`

  The name of the query to be deleted.

**Examples**

```js
const fabric = new Fabric();
fabric.deleteSavedQuery("testQuery")
```

## fabric.createRestqlCursor(query: string, bindVars: any)


`  createRestqlCursor(query: string, bindVars: any)`

Creates a restql cursor for running a query.

**Arguments**

- **query**: `string`

  The query to be executed.

- **bindVars**: `any`

    The variables if needed, for the query to execute.

**Examples**

```js
const fabric = new Fabric();
fabric.createRestqlCursor(query: "FOR x IN TestCollection RETURN x", bindVars: {})

```
