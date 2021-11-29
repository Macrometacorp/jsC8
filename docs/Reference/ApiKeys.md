## Api Keys

## client.validateApiKey

`async client.validateApiKey(data)`

Validate apikey or jwt.

**Arguments**

- **data**: `Object`

    - **apikey**: The api key as a string.
    You can validate api keys only if you have admin permissions.

    - **jwt**: The JWT token as a string.
    You can validate jwt token only if you have admin permissions.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const jwtResult = await client.validateApiKey({ jwt: "XXX" });
const apikeyResult = await client.validateApiKey({ apikey: "XXX" });
```

## client.createApiKey

`async client.createApiKey(keyid)`

Creates apikey

Note:- You can create api keys only for yourself.

**Arguments**

- **keyid**: `string`

    The id of the api key.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.createApiKey("some-key");
```

## client.getAvailableApiKeys

`async client.getAvailableApiKeys()`

Fetches data about all api keys. You can list aonly yours api keys.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getAvailableApiKeys();
```

## client.getAvailableApiKey

`async client.getAvailableApiKey(keyid)`

Fetches an existing api key, identified by keyid. You can get only yours api keys.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getAvailableApiKey("some-key");
```

## client.removeApiKey

`async client.removeApiKey(keyid)`

Removes an existing api key, identified by keyid. You can remove only yours api keys.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.removeApiKey("some-key");
```

## client.listAccessibleDatabases

`async client.listAccessibleDatabases(keyid, full)`

Fetch the list of databases available to the specified keyid. You need Administrate for the server access level in order to execute this call.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **full**: `boolean`
    
    Return the full set of access levels for all databases and all collections if set to true. Default is false.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.listAccessibleDatabases("some-key", true);
```

## client.getDatabaseAccessLevel

`async client.getDatabaseAccessLevel(keyid, dbName)`

Fetch the list of databases available to the specified keyid. You need Administrate for the server access level in order to execute this call.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **dbname**: `string`
    
    The name of the database.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getDatabaseAccessLevel("some-key", "some-database");
```

## client.clearDatabaseAccessLevel

`async client.clearDatabaseAccessLevel(keyid, dbName)`

Clears the database access level for the database dbname of api key with keyid. As consequence the default database access level is used. If there is no defined default database access level, it defaults to No access. You need permission to the _system database in order to execute this call.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **dbname**: `string`
   
    The name of the database.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.clearDatabaseAccessLevel("some-key", "some-database");
```

## client.setDatabaseAccessLevel

`async client.setDatabaseAccessLevel(keyid, dbName, permission)`

Sets the database access levels for the database dbname of api key with keyid. You need the Administrate server access level in order to execute this call.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **dbname**: `string`
    
    The name of the database.

- **permission**: `string`
   
    - Use "rw" to set the database access level to Administrate .
    - Use "ro" to set the database access level to Access.
    - Use "none" to set the database access level to No access.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.setDatabaseAccessLevel("some-key", "some-database", "rw");
```

## client.listAccessibleCollections

`async client.listAccessibleCollections(keyid, dbName, full)`

Fetch the list of collections access level for a specific user

If access level for collection is not set then default("*") access level will be use. If default("*") access level is also not set then database access level will be use.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

- **dbname**: `string`
    
    The name of the database.
    
- **full**: `boolean`
    
    Return the full set of access levels for all collections if set to true. Default is false.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.listAccessibleCollections("some-key", "some-database", true);
```

## client.getCollectionAccessLevel

`async client.getCollectionAccessLevel(keyid, dbName, collectionName)`

Returns the collection access level for a specific collection

If access level for collection is not set then default("*") access level will be use. If default("*") access level is also not set then database access level will be use.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **dbname**: `string`
   
    The name of the database.

- **collectionName**: `string`
   
    The name of the collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getCollectionAccessLevel("some-key", "some-database", "some-collection");
```

## client.clearCollectionAccessLevel

`async client.clearCollectionAccessLevel(keyid, dbName, collectionName)`

Clears the collection access level for the collection collection in the database dbname of api key with keyid. As consequence the default collection access level is used. If there is no defined default collection access level, it defaults to No access. You need permissions to the _system database in order to execute.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **dbname**: `string`
    
    The name of the database.

- **collectionName**: `string`
    
    The name of the collection.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.clearCollectionAccessLevel("some-key", "some-database", "some-collection");
```

## client.setCollectionAccessLevel

`async client.setCollectionAccessLevel(keyid, dbName, collectionName, permission)`

Sets the database access levels for the database dbname of api key with keyid. You need the Administrate server access level in order to execute this call.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **dbname**: `string`
    
    The name of the database.

- **collectionName**: `string`
    
    The name of the collection.

- **permission**: `string`
    
    - Use "rw" to set the database access level to Administrate .
    - Use "ro" to set the database access level to Access.
    - Use "none" to set the database access level to No access.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.setCollectionAccessLevel("some-key", "some-database", "some-collection", "rw");
```

## client.listAccessibleStreams

`async client.listAccessibleStreams(keyid, dbName, full)`

Fetch the list of streams available to the specified keyid. You need Administrate for the server access level in order to execute this call.

If access level for stream is not set then default("*") access level will be use. If default("*") access level is also not set then database access level will be use.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

- **dbname**: `string`
    
    The name of the database.
    
- **full**: `boolean`
    
    Return the full set of access levels for all streamsgetStreamAccessLevel if set to true. Default is false.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.listAccessibleStreams("some-key", "some-database", true);
```

## client.getStreamAccessLevel

`async client.getStreamAccessLevel(keyid, dbName, streamName)`

Fetch the stream access level for a specific stream

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **dbname**: `string`
   
    The name of the database.

- **streamName**: `string`
   
    The name of the stream.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getStreamAccessLevel("some-key", "some-database", "some-stream");
```

## client.clearStreamAccessLevel

`async client.clearStreamAccessLevel(keyid, dbName, streamName)`

Clears the stream access level for the stream of api key with keyid. As consequence the default stream access level is used. If there is no defined default stream access level, it defaults to No access.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **dbname**: `string`
    
    The name of the database.

- **streamName**: `string`
    
    The name of the stream.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.clearStreamAccessLevel("some-key", "some-database", "some-stream");
```

## client.setStreamAccessLevel

`async client.setStreamAccessLevel(keyid, dbName, streamName, permission)`

Sets the stream access levels for the stream of api key with keyid. You need the Administrate server access level in order to execute this call.

If access level for stream is not set then default("*") access level will be use. If default("*") access level is also not set then database access level will be use.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.
    
- **dbname**: `string`
    
    The name of the database.

- **streamName**: `string`
    
    The name of the stream.

- **permission**: `string`
    
    - Use "rw" to set the database access level to Administrate .
    - Use "ro" to set the database access level to Access.
    - Use "none" to set the database access level to No access.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.setStreamAccessLevel("some-key", "some-database", "some-stream", "rw");
```

## client.getBillingAccessLevel

`async client.getBillingAccessLevel(keyid)`

Fetch the billing access level

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getBillingAccessLevel("some-key");
```

## client.clearBillingAccessLevel

`async client.clearBillingAccessLevel(keyid)`

Clears the billing access level of keyid.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.clearBillingAccessLevel("some-key");
```

## client.setBillingAccessLevel

`async client.setBillingAccessLevel(keyid, permission)`

Sets the billing access levels for api key with keyid. You need the Administrate server access level in order to execute this call.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

- **permission**: `string`
    
    - Use "rw" to set the database access level to Administrate .
    - Use "ro" to set the database access level to Access.
    - Use "none" to set the database access level to No access.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.setBillingAccessLevel("some-key", "rw");
```

## client.listApikeyAttributes

`async client.listApikeyAttributes(keyid)`

List the attributes of a specific key-id for an apikey.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.listApikeyAttributes("some-key");
```

## client.createApikeyAttributes

`async client.createApikeyAttributes(keyid, data)`

Sets the attributes of a specific key-id for an apikey.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

- **data**: `object`
    
    - key value pair to be set as attributes for the specific key-id for an apikey.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.createApikeyAttributes("some-key", "{ key: value }");
```
## client.updateApikeyAttributes

`async client.createApikeyAttributes(keyid, data)`

Updates the attributes of a specific key-id for an apikey.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

- **data**: `object`
    
    - key value pair to be updated as attributes for the specific key-id for an apikey.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.updateApikeyAttributes("some-key", { key: "value" });
```

## client.removeApikeyAttributes

`async client.removeApikeyAttributes(keyid)`

Removes the attributes of a specific key-id for an apikey.

**Arguments**

- **keyid**: `string`
    
    The id of the api key.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.removeApikeyAttributes("some-key");
```