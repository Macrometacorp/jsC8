## Setting User Permissions and related Operations

## client.createUser

`async client.createUser(userName, email, passwd, [active], [extra]): Object`

Creates user with given data

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string`

  The email of the User.

- **passwd**: `string`

  The password of the User.

- **active**: `boolean` [optional]

  An optional flag that specifies whether the user is active. If not specified, this will default to `true`

- **extra**: `Object` [optional]

  An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.createUser("sample_user", "sample_user@macrometa.io");
```

## client.updateUser

`async client.updateUser(userName, email, data): Object`

Partially updates user with given data

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string`

  The email of the User.

- **data**: `Object`

  a JSON object consisting of following properties. Any of the following properties can be omitted if they are not to be updated

  - **passwd**: `string` [optional]

    The password of the User.

  - **active**: `boolean` [optional]

    An optional flag that specifies whether the user is active. If not specified, this will default to `true`

  - **extra**: `Object` [optional]

    An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.updateUser("sample_user", "sample_user@macrometa.io", { active: true });
```

## client.replaceUser

`async client.replaceUser(userName, email, data): Object`

Partially updates user with given data

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string`

  The email of the User.

- **data**: `Object`

  a JSON object consisting of following properties. Any of the following properties can be omitted if they are not to be updated

  - **passwd**: `string`

    The password of the User.

  - **active**: `boolean` [optional]

    An optional flag that specifies whether the user is active. If not specified, this will default to `true`

  - **extra**: `Object` [optional]

    An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.replaceUser("sample_user", "sample_user@macrometa.io", { active: true });
```

## client.deleteUser

`async client.deleteUser(userName, [email]): Object`

Deletes user with given data

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string` (optional)

  The email of the User.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.deleteUser("sample_user", "sample_user@macrometa.io");
```

## client.getUser

`async client.getUser(userName, [email]): Object`

gets user details for given user

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string` (optional)

  The email of the User.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const userDetails = await client.getUser("sample_user", "sample_user@macrometa.io");
```

## client.getUsers

`async client.getUsers(): Array`

Returns the list of all the users

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const users = await client.getUsers();
```

## client.hasUser

`async client.hasUser(userName, [email]): boolean`

Return true if user is available otherwise false.

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string` (optional)

  The email of the User.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const hasUser = await client.hasUser("sample_user", "sample_user@macrometa.io");
```

## client.getPermission

`async client.getPermission(userName, email, databaseName, [collectionName])`

Get the access level of a specific database/collection in a given database

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string`

  The email of the User.

- **databaseName**: `string`

  Name of the database

- **collectionName**: `string` (optional)

  Name of the Collection for which access level is to be fetched. if Collection is given then it gives acces to collection level access otherwise gives database level access.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const databaseAccess = await client.getPermission("sample_user", "sample_user@macrometa.io", 'sample_database');
const collectionAccess = await client.getPermission("sample_user", "sample_user@macrometa.io", 'sample_database', 'sample_collection');
```

## client.updatePermission

`async client.updatePermission(userName, email, fabricName, permission, [collectionName])`

Updates the access level of a specific database/collection in a given database

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string`

  The email of the User.

- **fabricName**: `string`

  The name of the fabric.

- **permission**: `string`

  The permission code, only possible values are `rw`, `ro` or `none`

- **collectionName**: `string` (optional)

  Name of the Collection for which access level is to be fetched. if Collection is given then it gives acces to collection level access otherwise gives database level access.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.updatePermission("sample_user", "sample_user@macrometa.io", 'sample_fabric', 'ro');
await client.updatePermission("sample_user", "sample_user@macrometa.io", 'sample_fabric', 'ro', 'sample_collection');
```

## client.resetPermission

`async client.resetPermission(userName, email, fabricName, [collectionName])`

Reset the access level of a specific database/collection in a given database

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string`

  The email of the User.

- **fabricName**: `string`

  The name of the fabric.

- **collectionName**: `string` (optional)

  Name of the Collection for which access level is to be fetched. if Collection is given then it gives acces to collection level access otherwise gives database level access.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.resetPermission("sample_user", "sample_user@macrometa.io", 'sample_fabric');
await client.resetPermission("sample_user", "sample_user@macrometa.io", 'sample_fabric', 'sample_collection');
```


Advanced User

## client.user

`user(user: string, email: string): User`

Returns a User instance representing the user with the given username.

**Arguments**

- **user**: `string`

  The name of the User for the instance.

- **email**: `string`

  The email of the User.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
```

## client.getAllUsers

`async client.getAllUsers()`

Returns the list of all the users for this fabric

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
await client.getAllUsers();
```

## user.getUserDetails

`async client.getUserDetails()`

Returns the details of a user

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.getUserDetails();
```

## user.createUser

`async createUser(passwd, active, extra)`

Asynchronously creates a user

**Arguments**

- **passwd**: `string`

  password that you want to set for the user.

- **active**: `boolean` [optional]

  An optional flag that specifies whether the user is active. If not specified, this will default to `true`

- **extra**: `Object` [optional]

  An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.createUser("sample_password", active, extra);
```

## user.deleteUser

`async user.deleteUser()`

deletes a user

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.deleteUser();
```

## user.modifyUser

`async modifyUser(data)`

Partially updates the data of an existing user.

**Arguments**

- **data**: `Object`

  a JSON object consisting of following properties. Any of the following properties can be omitted if they are not to be updated

  - **passwd** : The user password as a string.
  - **active** : An optional flag that specifies whether the user is active. If not
    specified, this will default to true
  - **extra** : An optional JSON object with arbitrary extra data about the user. This object
    can be used to save a C8QL query for this user, by specifying it in the following
    format within this object:
    "queries": [ {"name":"query_name", "value":"query_command"},…]

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
const config = {
  active: false // only updating active status
};
await user.modifyUser(config);
```

## user.replaceUser

`async replaceUser(data)`

Partially updates the data of an existing user.

**Arguments**

- **data**: `Object`

  an JSON object consisting with following properties. Any of the following properties can be omitted if they are not to be updated, expect `passwd`

  - **passwd** : The user password as a string.
  - **active** : An optional flag that specifies whether the user is active. If not
    specified, this will default to true
  - **extra** : An optional JSON object with arbitrary extra data about the user. This object
    can be used to save a C8QL query for this user, by specifying it in the following
    format within this object:
    "queries": [ {"name":"query_name", "value":"query_command"},…]

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
const config = {
  passwd: "sample_password",
  active: false
};
await user.replaceUser(config);
```

## user.getAllDatabases

`async getAllDatabases(full)`

Lists all the databases' access levels associated with the user

**Arguments**

- **full**: `boolean`[optional]

  if true is supplied, it returns the full set of access levels for all databases and all collections. default is false.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.getAllDatabases();
```

## user.getDatabaseAccessLevel

`async user.getDatabaseAccessLevel(databaseName)`

gets access level of the given database associated with the user

**Arguments**

- **databaseName**: `string`

  Name of the database for access level is to be retrived

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.getDatabaseAccessLevel("sample_database");
```

## user.getCollectionAccessLevel

`async user.getCollectionAccessLevel(databaseName, collectionName)`

Get the access level of a specific collection in a given database

**Arguments**

- **databaseName**: `string`

  Name of the database

- **collectionName**: `string`

  Name of the Collection for which access level is to be fetched

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.getCollectionAccessLevel(
  "sample_databaseName",
  "sample_collectionName"
);
```

## user.clearDatabaseAccessLevel

`async clearDatabaseAccessLevel(databaseName)`

clear access level for the database

**Arguments**

- **databaseName**: `string`

  The name of the database.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.clearDatabaseAccessLevel("sample_database");
```

## user.clearCollectionAccessLevel

`async user.clearCollectionAccessLevel(databaseName, collectionName)`

clears the access level of a specific collection in a given database

**Arguments**

- **databaseName**: `string`

  Name of the database

- **collectionName**: `string`

  Name of the Collection for which access level is to be cleared

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.clearCollectionAccessLevel(
  "sample_databaseName",
  "sample_collectionName"
);
```

## user.setDatabaseAccessLevel

`async user.setDatabaseAccessLevel(databaseName, permission)`

Sets the database access level

**Arguments**

- **databaseName**: `string`

  The name of the database.

- **permission**: `string`

  The permission code, only possible values are `rw`, `ro` or `none`

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.setDatabaseAccessLevel(databaseName, permission);
```

## user.setCollectionAccessLevel

`async setCollectionAccessLevel(databaseName,collectionName,permission)`

Sets Access level of a collection in a database

**Arguments**

- **databaseName**: `string`

  The name of the database.

- **collectionName**: `string`

  The name of the collectionName.

- **permission**: `string`

  The permission code, only possible values are `rw`, `ro` or `none`

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const user = client.user("sample_user", "sample_user@macrometa.io");
await user.setCollectionAccessLevel(databaseName, collectionName, permission);
```
