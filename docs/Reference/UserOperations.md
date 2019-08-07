## Setting User Permissions and related Operations

## fabric.user

`user(user: string): User`

Returns a User instance representing the user with the given username.

**Arguments**

- **user**: `string`

  The name of the User for the instance.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
```

## fabric.getAllUsers

`async fabric.getAllUsers()`

Returns the list of all the users for this fabric

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
await fabric.getAllUsers();
```

## user.getUserDetails

`async fabric.getUserDetails()`

Returns the details of a user

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
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

- **extra**: `object` [optional]

  An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
await user.createUser("sample_password", active, extra);
```

## user.deleteUser

`async user.deleteUser()`

deletes a user

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
await user.deleteUser();
```

## user.modifyUser

`async modifyUser(data)`

Partially updates the data of an existing user.

**Arguments**

- **data**: `object`

  a JSON object consisting of following properties. Any of the following properties can be omitted if they are not to be updated

  - **passwd** : The user password as a string.
  - **active** : An optional flag that specifies whether the user is active. If not
    specified, this will default to true
  - **extra** : An optional JSON object with arbitrary extra data about the user. This object
    can be used to save a C8QL query for this user, by specifying it in the following
    format within this object:
    "queries": [ {"name":"query_name", "value":"query_command"},…]

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
const config = {
  active: false // only updating active status
};
await user.modifyUser(config);
```

## user.replaceUser

`async replaceUser(data)`

Partially updates the data of an existing user.

**Arguments**

- **data**: `object`

  an JSON object consisting with following properties. Any of the following properties can be omitted if they are not to be updated, expect `passwd`

  - **passwd** : The user password as a string.
  - **active** : An optional flag that specifies whether the user is active. If not
    specified, this will default to true
  - **extra** : An optional JSON object with arbitrary extra data about the user. This object
    can be used to save a C8QL query for this user, by specifying it in the following
    format within this object:
    "queries": [ {"name":"query_name", "value":"query_command"},…]

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
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
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
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
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
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
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
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
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
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
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
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
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
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
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const user = fabric.user("sample_user");
await user.setCollectionAccessLevel(databaseName, collectionName, permission);
```
