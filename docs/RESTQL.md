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

# With Better Naming Conventions

## client.createRestql

`client.createRestql(restqlName, parameter, value): this`

Creates the restql with restqlName and value.

**Arguments**

- **restqlName**: `string`

  The name of the restql to create.

- **parameter**: `any`
   
   Parameters to the created restql.

- **value**: `string`

   The restql you want to create.



**Examples**

```js
const client = new jsc8();
await client.createRestql("testRestql", {}, "FOR x IN TestCollection RETURN x");
```

## client.getRestqls

`client.getRestqls()`

Returns a list of all created restqls for a particular tenant and client.


```js
const client = new jsc8();
const listOfCreatedRestql = await client.getRestqls();
```

## client.executeRestql

`client.executeRestql(restqlName: string, bindVars: any)`

Executes a created restql


**Arguments**

- **restqlName**: `string`

  The name of the restql to be executed.

- **bindVars**: `any`

  The variables you wish to pass to a restql.

**Examples**

```js
const client = new jsc8();
await client.executeRestql("testRestql", {});
```

## client.updateRestql

`updateRestql(restqlName: string, parameter: Object, value: string) `

Updates a restql that is already created.

**Arguments**

- **restqlName**: `string`

  The name of the restql to be updated.

- **parameter**: `object`

  An optional JSON object which can provide parameters to the restql.

**Examples**

```js
const client = new jsc8();

await client.updateRestql("testRestql", {}, "FOR x IN _routing RETURN x" );
```

## client.deleteRestql


`client.deleteRestql(restqlName: string) `

Deletes the created restql.


**Arguments**

- **restqlName**: `string`

  The name of the restql to be deleted.

**Examples**

```js
const client = new jsc8();
await client.deleteRestql("testRestql");
```
