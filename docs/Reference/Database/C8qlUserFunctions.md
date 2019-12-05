## Managing C8QL user functions

These functions implement the HTTP API for managing C8QL user functions

## client.listFunctions

`async client.listFunctions(): Array<Object>`

Fetches a list of all C8QL user functions registered with the client.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
const functions = client.listFunctions();
// functions is a list of function descriptions
```

## client.createFunction

`async client.createFunction(name, code): Object`

Creates an C8QL user function with the given `name` and `code` if it does not already exist or replaces it if a function with the same name already existed.

**Arguments**

* **name**: `string`

  A valid C8QL function name, e.g.: `"myfuncs::accounting::calculate_vat"`.

* **code**: `string`

  A string evaluating to a JavaScript function (not a JavaScript function object).

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
await client.createFunction(
  'ACME::ACCOUNTING::CALCULATE_VAT',
  String(function (price) {
    return price * 0.19;
  })
);
// Use the new function in an C8QL query with template handler:
const cursor = await client.query(c8ql`
  FOR product IN products
  RETURN MERGE(
    {vat: ACME::ACCOUNTING::CALCULATE_VAT(product.price)},
    product
  )
`);
// cursor is a cursor for the query result
```

## client.dropFunction

`async client.dropFunction(name, [group]): Object`

Deletes the C8QL user function with the given name from the client.

**Arguments**

* **name**: `string`

  The name of the user function to drop.

* **group**: `boolean` (Default: `false`)

  If set to `true`, all functions with a name starting with `name` will be  deleted; otherwise only the function with the exact name will be deleted.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name)
await client.dropFunction('ACME::ACCOUNTING::CALCULATE_VAT');
// the function no longer exists
```
