# Manipulating fabrics

These functions implement the [HTTP API for manipulating fabrics](https://developer.document360.io/docs/geo-fabrics)

## client.getLocalDc

`async client.getLocalDc(): Array<object>`

Returns local edge locations

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const data = await client.getLocalDc();
```

## Advanced User

## client.useFabric

`client.useFabric(fabricName): this`

Updates the `Fabric` instance and its connection string to use the given `fabricName`, then returns itself.

Note:-This method can not be used when the jsC8 instance was created with `isAbsolute: true`.

**Arguments**

- **fabricName**: `string`

  The name of the fabric to use.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
client.useFabric("test");
// The fabric instance now uses the fabric "test".
```

## client.version

`async client.version(detail)`

Returns the server name and version number.

**Arguments**

- **detail**: `boolean` (Default: `false`)

  If set to true, the response will contain a details attribute with additional information about included components and their versions.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const response = await client.version(true);
```

## client.useBasicAuth

`client.useBasicAuth([username, [password]]): this`

Updates the `Fabric` instance's `authorization` header to use Basic authentication with the given `username` and `password`, then returns itself.

**Arguments**

- **username**: `string`

  The username to authenticate with.

- **password**: `string`

  The password to authenticate with.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
client.useBasicAuth("admin", "hunter2");
// with the username "admin" and password "hunter2".
```

## client.useBearerAuth

`client.useBearerAuth(token): this`

Updates the `Fabric` instance's `authorization` header to use Bearer authentication with the given authentication token, then returns itself.

**Arguments**

- **token**: `string`

  The token to authenticate with.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
client.useBearerAuth("keyboardcat");
// The fabric instance now uses Bearer authentication.
```

## client.login

`async client.login(email, password): object`

Validates the given fabric credentials and exchanges them for an authentication token, then uses the authentication token for future requests and uses the tenant returned by the auth to be used in the URLs.

**Arguments**

- **email**: `string`

  The email to authenticate with.

- **password**: `string`

  The password to authenticate with.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
await client.login("hunter@test.com", "hunter2");
client.useFabric("hunter_test.com");
// The fabric instance now uses the fabric "test"
// with an authentication token for the "admin" user.
```

## client.version

`async client.version(): Object`

Fetches the C8 version information for the active fabric from the server.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const version = await client.version();
// the version object contains the C8 version information.
```

## client.createFabric

`async client.createFabric(fabricName, options, [users]): Object`

Creates a new Fabric with the given `fabricName`.

**Arguments**

- **fabricName**: `string`

  Name of the fabric to create.

- **options**: `Object`

  - **dcList**: `string`
    A comma separated list of data centers. It is a mandatory field, but if not specified (due to user error), it defaults
to the local Edge Location.

  - **spotDc**: `string` (optional)
    The data center to be made as spot data center for this client. It has three different behaviour depending upon the value.

      `AUTOMATIC` -  The spot DC is chosen automatically if this key is not present in the `options` object.

      `NONE` - No spot Dc is made for this fabric if empty string is passed. E.g. `spotDc:''`

      `DC name` - If passed a valid DC name as the value, then that DC will be made the spot DC for this client.

- **users**: `Array<Object>` (optional)

  If specified, the array must contain objects with the following properties:

  - **username**: `string`

    The username of the user to create for the client.

  - **passwd**: `string` (Default: empty)

    The password of the user.

  - **active**: `boolean` (Default: `true`)

    Whether the user is active.

  - **extra**: `Object` (optional)

    An object containing additional user data.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const info = await client.createFabric('mydb', [{username: 'root'}]);
// the fabric has been created
```

## client.updateFabricSpotRegion

`async client.updateFabricSpotRegion(tenantName, fabricName, datacenter = ""): Object`

Updates the spot primary region of a client.

**Examples**

```js
await client.updateFabricSpotRegion("guestTenant", "guestDB", "myfederation-ap-south-1");
```

The above code changes the spot DC for `guestDB` in `guestTenant` to `myfederation-ap-south-1`.

## client.exists

`async client.exists(): boolean`

Checks whether the fabric exists.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const result = await client.exists();
// result indicates whether the fabric exists
```

## client.get

`async client.get(): Object`

Fetches the fabric description for the active fabric from the server.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const info = await client.get();
// the fabric exists
```

## client.listFabrics

`async client.listFabrics(): Array<string>`

Fetches all fabrics from the server and returns an array of their names.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const names = await client.listFabrics();
// fabrics is an array of fabric names
```

## client.listUserFabrics

`async client.listUserFabrics(): Array<string>`

Fetches all fabrics accessible to the active user from the server and returns an array of their names.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const names = await client.listUserFabrics();
// fabrics is an array of fabric names
```

## client.dropFabric

`async client.dropFabric(fabricName): Object`

Deletes the fabric with the given `fabricName` from the server.

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
await client.dropFabric('mydb');
// fabric "mydb" no longer exists
```

## client.truncate

`async client.truncate([excludeSystem]): Object`

Deletes **all documents in all collections** in the active client.

**Arguments**

- **excludeSystem**: `boolean` (Default: `true`)

  Whether system collections should be excluded. Note that this option will be ignored because truncating system collections is not supported anymore for some system collections.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
await client.truncate();
// all non-system collections in this fabric are now empty
```

## client.getAllEdgeLocations

`async client.getAllEdgeLocations(): Object`

Return a list of all Edge Locations (AKA Datacenters) deployed in the Macrometa client.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
await client.createFabric('mydb', [{username: 'root'}]);
await client.getAllEdgeLocations();
```

## client.getLocalEdgeLocation

`async client.getLocalEdgeLocation(): Object`

Fetches data about the local Edge Location specific to this Datacenter/Location.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
await client.getLocalEdgeLocation();
```

## client.changeEdgeLocationSpotStatus

`async client.changeEdgeLocationSpotStatus(): Object`

Change the spot status of a datacenter.

**Examles**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
await client.changeEdgeLocationSpotStatus('myfederation-us-east-1', true);
```
