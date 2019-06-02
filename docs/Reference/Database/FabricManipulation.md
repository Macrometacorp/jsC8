# Manipulating fabrics

These functions implement the
[HTTP API for manipulating fabrics](https://docs.macrometa.io/jsC8/latest/HTTP/Fabric/index.html).

## fabric.acquireHostList

`async fabric.acquireHostList(): this`

Updates the URL list by requesting a list of all coordinators in the cluster and adding any endpoints not initially specified in the _url_ configuration.

For long-running processes communicating with an C8 cluster it is recommended to run this method repeatedly (e.g. once per hour) to make sure new coordinators are picked up correctly and can be used for fail-over or load balancing.

**Note**: This method can not be used when the jsC8 instance was created with `isAbsolute: true`.

## fabric.useFabric

`fabric.useFabric(fabricName): this`

Updates the _Fabric_ instance and its connection string to use the given
_fabricName_, then returns itself.

**Note**: This method can not be used when the jsC8 instance was created with `isAbsolute: true`.

**Arguments**

- **fabricName**: `string`

  The name of the fabric to use.

**Examples**

```js
const fabric = new Fabric();
fabric.useFabric("test");
// The fabric instance now uses the fabric "test".
```

## fabric.version

`async fabric.version(detail)`

Returns the server name and version number.

**Arguments**

- **detail**: `boolean` (Default: `false`)

  If set to true, the response will contain a details attribute with additional information about included components and their versions.

**Examples**

```js
const fabric = new Fabric();
const response = await fabric.version(true);
```

## fabric.useBasicAuth

`fabric.useBasicAuth([username, [password]]): this`

Updates the _Fabric_ instance's `authorization` header to use Basic
authentication with the given _username_ and _password_, then returns itself.

**Arguments**

- **username**: `string`

  The username to authenticate with.

- **password**: `string`

  The password to authenticate with.

**Examples**

```js
const fabric = new Fabric();
fabric.useBasicAuth("admin", "hunter2");
// with the username "admin" and password "hunter2".
```

## fabric.useBearerAuth

`fabric.useBearerAuth(token): this`

Updates the _Fabric_ instance's `authorization` header to use Bearer
authentication with the given authentication token, then returns itself.

**Arguments**

- **token**: `string`

  The token to authenticate with.

**Examples**

```js
const fabric = new Fabric();
fabric.useBearerAuth("keyboardcat");
// The fabric instance now uses Bearer authentication.
```

## fabric.login

`async fabric.login(tenant, [username, [password]]): string`

Validates the given fabric credentials and exchanges them for an
authentication token, then uses the authentication token for future
requests and returns it.

**Arguments**

- **username**: `string` (Default: `"root"`)

  The username to authenticate with.

- **password**: `string` (Default: `""`)

  The password to authenticate with.

**Examples**

```js
const fabric = new Fabric();
await fabric.login("_mm", "admin", "hunter2");
fabric.useFabric("test");
// The fabric instance now uses the fabric "test"
// with an authentication token for the "admin" user.
```

## fabric.version

`async fabric.version(): Object`

Fetches the C8 version information for the active fabric from the server.

**Examples**

```js
const fabric = new Fabric();
const version = await fabric.version();
// the version object contains the C8 version information.
```

## fabric.createFabric

`async fabric.createFabric(fabricName, options, [users]): Object`

Creates a new Fabric with the given _fabricName_.

**Arguments**

- **fabricName**: `string`

  Name of the fabric to create.

- **options**: `Object`

  - **dcList**: `String`
    A comma separated list of data centers. It is a mandatory field, but if not specified (due to user error), it defaults
to the local Edge Location.

  - **spotDc**: `String` (optional)
    The data center to be made as spot data center for this fabric. It has three different behaviour depending upon the value.

      `AUTOMATIC` -  The spot DC is chosen automatically if this key is not present in the `options` object.

      `NONE` - No spot Dc is made for this fabric if empty string is passed. E.g. `spotDc:''`

      `DC name` - If passed a valid DC name as the value, then that DC will be made the spot DC for this fabric.

- **users**: `Array<Object>` (optional)

  If specified, the array must contain objects with the following properties:

  - **username**: `string`

    The username of the user to create for the fabric.

  - **passwd**: `string` (Default: empty)

    The password of the user.

  - **active**: `boolean` (Default: `true`)

    Whether the user is active.

  - **extra**: `Object` (optional)

    An object containing additional user data.

**Examples**

```js
const fabric = new Fabric();
const info = await fabric.createFabric('mydb', [{username: 'root'}]);
// the fabric has been created
```

## fabric.updateFabricSpotRegion

`async fabric.updateFabricSpotRegion(tenantName, fabricName, datacenter = ""): Object`

Updates the spot primary region of a fabric.

**Examples**

```js
await fabric.updateFabricSpotRegion("guestTenant", "guestDB", "myfederation-ap-south-1");
```

The above code changes the spot DC for `guestDB` in `guestTenant` to `myfederation-ap-south-1`.

## fabric.exists

`async fabric.exists(): boolean`

Checks whether the fabric exists.

**Examples**

```js
const fabric = new Fabric();
const result = await fabric.exists();
// result indicates whether the fabric exists
```

## fabric.get

`async fabric.get(): Object`

Fetches the fabric description for the active fabric from the server.

**Examples**

```js
const fabric = new Fabric();
const info = await fabric.get();
// the fabric exists
```

## fabric.listFabrics

`async fabric.listFabrics(): Array<string>`

Fetches all fabrics from the server and returns an array of their names.

**Examples**

```js
const fabric = new Fabric();
const names = await fabric.listFabrics();
// fabrics is an array of fabric names
```

## fabric.listUserFabrics

`async fabric.listUserFabrics(): Array<string>`

Fetches all fabrics accessible to the active user from the server and returns
an array of their names.

**Examples**

```js
const fabric = new Fabric();
const names = await fabric.listUserFabrics();
// fabrics is an array of fabric names
```

## fabric.dropFabric

`async fabric.dropFabric(fabricName): Object`

Deletes the fabric with the given _fabricName_ from the server.

```js
const fabric = new Fabric();
await fabric.dropFabric('mydb');
// fabric "mydb" no longer exists
```

## fabric.truncate

`async fabric.truncate([excludeSystem]): Object`

Deletes **all documents in all collections** in the active fabric.

**Arguments**

- **excludeSystem**: `boolean` (Default: `true`)

  Whether system collections should be excluded. Note that this option will be
  ignored because truncating system collections is not supported anymore for
  some system collections.

**Examples**

```js
const fabric = new Fabric();

await fabric.truncate();
// all non-system collections in this fabric are now empty
```

## fabric.getAllEdgeLocations

`async fabric.getAllEdgeLocations(): Object`

Return a list of all Edge Locations (AKA Datacenters) deployed in the Macrometa Fabric.

**Examples**

```js
const fabric = new Fabric();
await fabric.createFabric('mydb', [{username: 'root'}]);
await fabric.getAllEdgeLocations();
```

## fabric.getLocalEdgeLocation

`async fabric.getLocalEdgeLocation(): Object`

Fetches data about the local Edge Location specific to this Datacenter/Location.

**Examples**

```js
const fabric = new Fabric();
await fabric.getLocalEdgeLocation();
```

## fabric.changeEdgeLocationSpotStatus

`async fabric.changeEdgeLocationSpotStatus(): Object`

Change the spot status of a datacenter.

**Examles**

```js
const fabric = new Fabric();
await fabric.changeEdgeLocationSpotStatus('myfederation-us-east-1', true);
```