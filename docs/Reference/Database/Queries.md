## Queries

This function implements the [HTTP API for single roundtrip C8QL queries](https://developer.document360.io/docs/queries).

## client.executeQuery

`async client.executeQuery(query, [bindVars,] [opts])`

Executes given query and returns the data

**Arguments**

* **query**: `string`

  An C8QL query string or a [query builder](https://npmjs.org/package/aqb)  instance.

* **bindVars**: `Object` (optional)

  An object defining the variables to bind the query to.

* **opts**: `Object` (optional)

  Additional parameter object that will be passed to the query API.
  Possible keys are `count` and `options` (explained below)

If  `opts.count` is set to `true`, the cursor will have a `count`  property set to the query result count.
Possible key options in `opts.options` include: `failOnWarning`, `cache`, `profile` or `skipInaccessibleCollections`.
For a complete list of query settings please reference the [macrometa.io/jsC8 documentation](https://developer.document360.io/docs/overview-3).

If `query` is an object with `query` and `bindVars` properties, those will be used as the values of the respective arguments instead.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const data = await client.executeQuery("FOR doc IN some-collection RETURN doc._id");
```

## client.getRunningQueries

`async client.getRunningQueries()`

returns all running queries

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const runningQueries = await client.getRunningQueries();
```

## client.killQuery

`async client.killQuery(queryId)`

terminates query

**Arguments**

- **queryId**: `string`

  The id of the query.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.killQuery("query-id");
```

## client.query

`async client.query(query, [bindVars,] [opts]): Cursor`

Performs a fabric query using the given `query` and `bindVars`, then returns a [new _Cursor_ instance](https://developer.document360.io/docs/cursor) for the result list.

**Arguments**

* **query**: `string`

  An C8QL query string or a [query builder](https://npmjs.org/package/aqb)  instance.

* **bindVars**: `Object` (optional)

  An object defining the variables to bind the query to.

* **opts**: `Object` (optional)

  Additional parameter object that will be passed to the query API.
  Possible keys are `count` and `options` (explained below)

If  `opts.count` is set to `true`, the cursor will have a `count`  property set to the query result count.
Possible key options in `opts.options` include: `failOnWarning`, `cache`, `profile` or `skipInaccessibleCollections`.
For a complete list of query settings please reference the [macrometa.io/jsC8 documentation](https://developer.document360.io/docs/overview-3).

If `query` is an object with `query` and `bindVars` properties, those will be used as the values of the respective arguments instead.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const active = true;

// Using the c8ql template tag
const cursor = await client.query(c8ql`
  FOR u IN _users
  FILTER u.authData.active == ${active}
  RETURN u.user
`);
// cursor is a cursor for the query result

// -- or --

// Old-school JS with explicit bindVars:
client.query(
  'FOR u IN _users ' +
  'FILTER u.authData.active == @active ' +
  'RETURN u.user',
  {active: true}
).then(function (cursor) {
  // cursor is a cursor for the query result
});
```

## client.validateQuery

`async client.validateQuery(query)`

Checks if the query is a valid C8QL query without executing it.

**Arguments**

* **query**: `string`

  An C8QL query string.

  **Examples**

```js
const client = new jsc8();
const query = "FOR doc in docs return doc";
const cursor = await client.validateQuery(query);
});
```

## client.explainQuery

`async client.explainQuery(Object)`

Explain a C8QL query

**Arguments**
 An object withh the following key.
 
* **query**: `string`

  An C8QL query string or a [query builder](https://npmjs.org/package/aqb)
  instance.

* **bindVars**: `Object` (optional)

  An object defining the variables to bind the query to.

* **opts**: `Object` (optional)

  Additional parameter object that will be passed to the query API.
  Possible keys are `maxNumberOfPlans` and `allPlans` (explained below)

`maxNumberOfPlans`: an optional maximum number of plans that the optimizer is allowed to generate. Setting this attribute to a low value allows to put a cap on the amount of work the optimizer does.

`allPlans`: if set to true, all possible execution plans will be returned. The default is false, meaning only the optimal plan will be returned.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const collection = await client.createCollection("myColl");

const query = "FOR doc in myColl return doc";
const cursor = await client.explainQuery({query});
});
```


## client.getCurrentQueries

`async client.getCurrentQueries()`

Returns an array containing the C8QL queries currently running in the selected database.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const cursor = await client.getCurrentQueries();
});
```

## client.clearSlowQueries

`async client.clearSlowQueries()`

Clears the list of slow C8QL queries

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const cursor = await client.clearSlowQueries();
});
```

## client.getSlowQueries

`async client.getSlowQueries()`

Returns the list of slow C8QL queries

Returns an array containing the last C8QL queries that are finished and have exceeded the slow query threshold in the selected database. The maximum amount of queries in the list can be controlled by setting the query tracking property maxSlowQueries. The threshold for treating a query as slow can be adjusted by setting the query tracking property slowQueryThreshold.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const cursor = await client.getSlowQueries();
});
```

## client.terminateRunningQuery

`async client.terminateRunningQuery(queryId)`

**Arguments**
* **queryId**: `string`

  The id of the query.

Kills a running query. The query will be terminated at the next cancelation point.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const cursor = await client.terminateRunningQuery();
});
```

## c8ql

`c8ql(strings, ...args): Object`

Template string handler (aka template tag) for C8QL queries. Converts a template string to an object that can be passed to `client.query` by converting arguments to bind variables.

Note:-If you want to pass a collection name as a bind variable, you need to pass a `Collection` instance (e.g. what you get by passing the collection name to `client.collection` instead). If you see the error `"array expected as operand to FOR loop"`, you're likely passing a collection name instead of a collection instance.

**Examples**

```js
const userCollection = client.collection("_users");
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

Note how the c8ql template tag automatically handles collection references (`@@value0` instead of `@value0`) for us so you don't have to worry about counting at-symbols.

Because the c8ql template tag creates actual bindVars instead of inlining values directly, it also avoids injection attacks via malicious parameters:

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
