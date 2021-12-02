# RESTQL

## client.createRestql

`client.createRestql(restqlName, value, parameter): this`

Creates the restql with restqlName and value.

**Arguments**

- **restqlName**: `string`

  The name of the restql to create.

- **value**: `string`

   The restql you want to create.

- **parameter**: `any`
   
   Parameters to the created restql. Default is `{}`.

**Examples**

```js
const client = new jsc8();
await client.createRestql("testRestql", "FOR x IN TestCollection RETURN x");
```

## client.getRestqls

`client.getRestqls()`

Returns a list of all created restqls for a particular tenant and client.

```js
const client = new jsc8();
const listOfCreatedRestql = await client.getRestqls();
```

## client.executeRestql

`client.executeRestql(restqlName, bindVars)`

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

`updateRestql(restqlName, value, parameter) `

Updates a restql that is already created.

**Arguments**

- **restqlName**: `string`

  The name of the restql to be updated.

- **parameter**: `Object`

  Parameters to the created restql. Default is `{}`.

- **value**: `string`

  The restql you want to create.

**Examples**

```js
const client = new jsc8();
await client.updateRestql("testRestql", "FOR x IN _routing RETURN x" );
```

## client.deleteRestql

`client.deleteRestql(restqlName) `

Deletes the created restql.


**Arguments**

- **restqlName**: `string`

  The name of the restql to be deleted.

**Examples**

```js
const client = new jsc8();
await client.deleteRestql("testRestql");
```

## client.getNextBatchFromCursor(query: string, bindVars: any)

`getNextBatchFromCursor(id: string)`

Read next batch from cursor for restql.

**Arguments**

- **id**: `string`

  Cursor identifier.

**Examples**

```js
const client = new jsc8();
client.getNextBatchFromCursor("291129");
```
