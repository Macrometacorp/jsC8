# RESTQL

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

- **parameter**: `Object`

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

## client.createRestqlCursor(query: string, bindVars: any)

`createRestqlCursor(query: string, bindVars: any)`

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
