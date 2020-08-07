## Manipulating tenants

## client.getDcList

`async client.getDcList(): Array<object>`

Returns tenant edge locations

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const data = await client.getDcList();
```

## client.useTenant

`client.useTenant(tenantName): this`

Updates the `Fabric` instance and its connection string to use the given `tenantName`, then returns itself.

Note:-This method can not be used when the jsC8 instance was created with `isAbsolute: true`.)

**Arguments**

- **tenantName**: `string`

  The name of the tenant to use.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

client.useTenant("testTenant");
// The fabric instance now uses the tenant "testTenant".
```

## client.tenant

`client.tenant(tenantEmail, tenantName): Tenant`

Returns a _Tenant_ instance representing the tenant with the given tenant name.

**Arguments**

- **tenantEmail**: `string`
  The email of the tenant.

- **tenantName**: `string` (optional)

  The name of the tenant to use. The name of the tenant will be automatically assigned if the tenant is created by `tenant.createTenant`.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const tenant = client.tenant(tenant-email);
```

## client.listTenants

`async client.listTenants(): Array<Object>`

Fetches all tenants from the fabric and returns an array of tenant descriptions.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const allTenants = client.listTenants();
```

## tenant.createTenant

`async tenant.createTenant(password, dcList, extra): Object`

Creates a tenant.

**Arguments**

- **dcList**: `string`
    Comma seperated list of the regions that you want the tenant to  access

- **password**: `string`

  The name of the tenant to use.

- **extra**: `Object`

  An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const tenant = client.tenant(tenant-email);
await tenant.createTenant("myPassword", "test-eu-west-1,test-us-west-2");
// creates a new tenant with email as tenant-email with password as "myPassword".
```

## tenant.dropTenant

`async tenant.dropTenant(): Object`

Deletes the tenant.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const tenant = client.tenant("testTenant@macrometa.io");
await tenant.createTenant("myPassword","region-name");
await tenant.dropTenant();
```

## tenant.getTenantEdgeLocations

`async tenant.getTenantEdgeLocations(): Object`

Fetches data about the Edge Locations specific to this tenant.

**Examples**
```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const tenant = client.tenant(tenant-email, tenant-name);
const locations = await tenant.getTenantEdgeLocations();
```


## tenant.tenantDetails

`async tenant.tenantDetails(): Object`

Gets the details of a tenant.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const tenant = client.tenant("testTenant@macrometa.io");
await tenant.createTenant("myPassword", "region-name");
await tenant.tenantDetails();
```

## tenant.modifyTenant

`async tenant.modifyTenant(passwd, extra): Object`

Modifies the given tenant.

**Arguments**

- **password**: `string`

  The name of the tenant to use.

- **extra**: `Object`

  An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const tenant = client.tenant("testTenant@macrometa.io");
await tenant.createTenant("myPassword" "region-name");
await tenant.modifyTenant("myPassword", { info: "string"});
```