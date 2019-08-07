## Manipulating tenants

## fabric.useTenant

`fabric.useTenant(tenantName): this`

Updates the `Fabric` instance and its connection string to use the given `tenantName`, then returns itself.

Note:-This method can not be used when the jsC8 instance was created with `isAbsolute: true`.)

**Arguments**

- **tenantName**: `string`

  The name of the tenant to use.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
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
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const tenant = fabric.tenant("testTenant");
```

## fabric.listTenants

`async fabric.listTenants(): Array<Object>`

Fetches all tenants from the fabric and returns an array of tenant descriptions.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const allTenants = fabric.listTenants();
```

## tenant.createTenant

`async tenant.createTenant(dcList, password, extra): Object`

Creates a tenant.

**Arguments**

- **dcList**: `string`
    Comma seperated list of the regions that you want the tenant to  access

- **password**: `string`

  The name of the tenant to use.

- **extra**: `object`

  An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const tenant = fabric.tenant("testTenant");
await tenant.createTenant("test-eu-west-1, test-us-west-2","myPassword", {});
// creates a new tenant "testTenant" with password as "myPassword".
```

## tenant.dropTenant

`async tenant.dropTenant(): Object`

Deletes the tenant.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
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
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
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
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const tenant = fabric.tenant("testTenant");
await tenant.createTenant("myPassword", {});
await tenant.modifyTenant("myPassword", { info: "string"});
```
