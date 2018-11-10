# Manipulating tenants

## fabric.useTenant

`fabric.useTenant(tenantName): this`

Updates the _Fabric_ instance and its connection string to use the given
_tenantName_, then returns itself.

**Note**: This method can not be used when the jsC8 instance was created with `isAbsolute: true`.

**Arguments**

- **tenantName**: `string`

  The name of the tenant to use.

**Examples**

```js
const fabric = new Fabric();
fabric.useTenant("testTenant");
// The fabric instance now uses the tenant "testTenant".
```

## fabric.tenant

`fabric.tenant(tenantName): Tenant`

Returns a _Tenant_ instance representing the tenant with the given tenant name.

**Arguments**

- **tenantName**: `string`

  The name of the tenant to use.

**Examples**

```js
const fabric = new Fabric();
const tenant = fabric.tenant("testTenant");
```

## fabric.listTenants

`async fabric.listTenants(): Array<Object>`

Fetches all tenants from the fabric and returns an array of tenant descriptions.

**Examples**

```js
const fabric = new Fabric();
const allTenants = fabric.listTenants();
```

## tenant.createTenant

`async tenant.createTenant(password, extra): Object`

Creates a tenant.

**Arguments**

- **password**: `string`

  The name of the tenant to use.

- **extra**: `object`

  An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const fabric = new Fabric();
const tenant = fabric.tenant("testTenant");
await tenant.createTenant("myPassword", {});
// creates a new tenant "testTenant" with password as "myPassword".
```

## tenant.dropTenant

`async tenant.dropTenant(): Object`

Deletes the tenant.

**Examples**

```js
const fabric = new Fabric();
const tenant = fabric.tenant("testTenant");
await tenant.createTenant("myPassword", {});
await tenant.dropTenant();
```

## tenant.tenantDetails

`async tenant.tenantDetails(): Object`

Gets the details of a tenant.

**Examples**

```js
const fabric = new Fabric();
const tenant = fabric.tenant("testTenant");
await tenant.createTenant("myPassword", {});
await tenant.tenantDetails();
```

## tenant.modifyTenant

`async tenant.modifyTenant(passwd, extra): Object`

Modifies the given tenant.

**Arguments**

- **password**: `string`

  The name of the tenant to use.

- **extra**: `object`

  An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const fabric = new Fabric();
const tenant = fabric.tenant("testTenant");
await tenant.createTenant("myPassword", {});
await tenant.modifyTenant("myPassword", { info: "string"});
```