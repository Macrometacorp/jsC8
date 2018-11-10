# Transactions

This function implements the
[HTTP API for transactions](https://docs.macrometa.io/jsC8/latest/HTTP/Transaction/index.html).

## fabric.transaction

`async fabric.transaction(collections, action, [params, [options]]):
Object`

Performs a server-side transaction and returns its return value.

**Arguments**

* **collections**: `Object`

  An object with the following properties:

  * **read**: `Array<string>` (optional)

    An array of names (or a single name) of collections that will be read from
    during the transaction.

  * **write**: `Array<string>` (optional)

    An array of names (or a single name) of collections that will be written to
    or read from during the transaction.

* **action**: `string`

  A string evaluating to a JavaScript function to be executed on the server.

  **Note**: For accessing the fabric from within C8, see
  [the documentation for the `@c8` module in C8](https://docs.macrometa.io/jsC8/latest/Manual/Appendix/JavaScriptModules/C8.html).

* **params**: `Object` (optional)

  Available as variable `params` when the _action_ function is being executed on
  server. Check the example below.

* **options**: `Object` (optional)

  An object with any of the following properties:

  * **lockTimeout**: `number` (optional)

    Determines how long the fabric will wait while attempting to gain locks on
    collections used by the transaction before timing out.

  * **waitForSync**: `boolean` (optional)

    Determines whether to force the transaction to write all data to disk before returning.

  * **maxTransactionSize**: `number` (optional)

    Determines the transaction size limit in bytes. Honored by the RocksDB storage engine only.

  * **intermediateCommitCount**: `number` (optional)

    Determines the maximum number of operations after which an intermediate commit is
    performed automatically. Honored by the RocksDB storage engine only.

  * **intermediateCommitSize**: `number` (optional)

    Determine the maximum total size of operations after which an intermediate commit is
    performed automatically. Honored by the RocksDB storage engine only.

If _collections_ is an array or string, it will be treated as
_collections.write_.

Please note that while _action_ should be a string evaluating to a well-formed
JavaScript function, it's not possible to pass in a JavaScript function directly
because the function needs to be evaluated on the server and will be transmitted
in plain text.

For more information on transactions, see
[the HTTP API documentation for transactions](https://docs.macrometa.io/jsC8/latest/HTTP/Transaction/index.html).

**Examples**

```js
const fabric = new Fabric();
const action = String(function (params) {
  // This code will be executed inside C8!
  const fabric = require('@c8').fabric;
  return fabric._query(c8ql`
    FOR user IN _users
    FILTER user.age > ${params.age}
    RETURN u.user
  `).toArray();
});

const result = await fabric.transaction(
  {read: '_users'},
  action,
  {age: 12}
);
// result contains the return value of the action
```
