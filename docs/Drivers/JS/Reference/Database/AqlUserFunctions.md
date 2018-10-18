# Managing C8QL user functions

These functions implement the
[HTTP API for managing C8QL user functions](https://docs.macrometa.io/jsC8/latest/HTTP/C8QLUserFunctions/index.html).

## database.listFunctions

`async database.listFunctions(): Array<Object>`

Fetches a list of all C8QL user functions registered with the database.

**Examples**

```js
const db = new Database();
const functions = db.listFunctions();
// functions is a list of function descriptions
```

## database.createFunction

`async database.createFunction(name, code): Object`

Creates an C8QL user function with the given _name_ and _code_ if it does not
already exist or replaces it if a function with the same name already existed.

**Arguments**

* **name**: `string`

  A valid C8QL function name, e.g.: `"myfuncs::accounting::calculate_vat"`.

* **code**: `string`

  A string evaluating to a JavaScript function (not a JavaScript function
  object).

**Examples**

```js
const db = new Database();
await db.createFunction(
  'ACME::ACCOUNTING::CALCULATE_VAT',
  String(function (price) {
    return price * 0.19;
  })
);
// Use the new function in an C8QL query with template handler:
const cursor = await db.query(c8ql`
  FOR product IN products
  RETURN MERGE(
    {vat: ACME::ACCOUNTING::CALCULATE_VAT(product.price)},
    product
  )
`);
// cursor is a cursor for the query result
```

## database.dropFunction

`async database.dropFunction(name, [group]): Object`

Deletes the C8QL user function with the given name from the database.

**Arguments**

* **name**: `string`

  The name of the user function to drop.

* **group**: `boolean` (Default: `false`)

  If set to `true`, all functions with a name starting with _name_ will be
  deleted; otherwise only the function with the exact name will be deleted.

**Examples**

```js
const db = new Database();
await db.dropFunction('ACME::ACCOUNTING::CALCULATE_VAT');
// the function no longer exists
```
