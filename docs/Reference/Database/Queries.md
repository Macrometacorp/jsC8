# Queries

This function implements the
[HTTP API for single roundtrip C8QL queries](https://docs.macrometa.io/jsC8/latest/HTTP/C8QLQueryCursor/QueryResults.html).

## fabric.query

`async fabric.query(query, [bindVars,] [opts]): Cursor`

Performs a fabric query using the given _query_ and _bindVars_, then returns a
[new _Cursor_ instance](../Cursor.md) for the result list.

**Arguments**

* **query**: `string`

  An C8QL query string or a [query builder](https://npmjs.org/package/aqb)
  instance.

* **bindVars**: `Object` (optional)

  An object defining the variables to bind the query to.

* **opts**: `Object` (optional)

  Additional parameter object that will be passed to the query API.
  Possible keys are _count_ and _options_ (explained below)

If _opts.count_ is set to `true`, the cursor will have a _count_ property set to
the query result count.
Possible key options in _opts.options_ include: _failOnWarning_, _cache_, profile or _skipInaccessibleCollections_.
For a complete list of query settings please reference the [macrometa.io/jsC8 documentation](https://docs.macrometa.io/jsC8/latest/C8QL/Invocation/WithC8sh.html#setting-options).

If _query_ is an object with _query_ and _bindVars_ properties, those will be
used as the values of the respective arguments instead.

**Examples**

```js
const fabric = new Fabric();
const active = true;

// Using the c8ql template tag
const cursor = await fabric.query(c8ql`
  FOR u IN _users
  FILTER u.authData.active == ${active}
  RETURN u.user
`);
// cursor is a cursor for the query result

// -- or --

// Old-school JS with explicit bindVars:
fabric.query(
  'FOR u IN _users ' +
  'FILTER u.authData.active == @active ' +
  'RETURN u.user',
  {active: true}
).then(function (cursor) {
  // cursor is a cursor for the query result
});
```

## c8ql

`c8ql(strings, ...args): Object`

Template string handler (aka template tag) for C8QL queries. Converts a template
string to an object that can be passed to `fabric.query` by converting
arguments to bind variables.

**Note**: If you want to pass a collection name as a bind variable, you need to
pass a _Collection_ instance (e.g. what you get by passing the collection name
to `fabric.collection`) instead. If you see the error `"array expected as operand to
FOR loop"`, you're likely passing a collection name instead of a collection
instance.

**Examples**

```js
const userCollection = fabric.collection("_users");
const role = "admin";

const query = c8ql`
  FOR user IN ${userCollection}
  FILTER user.role == ${role}
  RETURN user
`;

// -- is equivalent to --
const query = {
  query: "FOR user IN @@value0 FILTER user.role == @value1 RETURN user",
  bindVars: { "@value0": userCollection.name, value1: role }
};
```

Note how the c8ql template tag automatically handles collection references
(`@@value0` instead of `@value0`) for us so you don't have to worry about
counting at-symbols.

Because the c8ql template tag creates actual bindVars instead of inlining values
directly, it also avoids injection attacks via malicious parameters:

```js
// malicious user input
const email = '" || (FOR x IN secrets REMOVE x IN secrets) || "';

// DON'T do this!
const query = `
  FOR user IN users
  FILTER user.email == "${email}"
  RETURN user
`;
// FILTER user.email == "" || (FOR x IN secrets REMOVE x IN secrets) || ""

// instead do this!
const query = c8ql`
  FOR user IN users
  FILTER user.email == ${email}
  RETURN user
`;
// FILTER user.email == @value0
```
