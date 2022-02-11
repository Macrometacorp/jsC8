## Manipulating tenants

## client.getDcList

`async client.getDcList(): Array<object>`

Returns tenant edge locations

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

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
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

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
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const tenant = client.tenant(tenant-email);
```

## client.listTenants

`async client.listTenants(): Array<Object>`

Fetches all tenants from the fabric and returns an array of tenant descriptions.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const allTenants = client.listTenants();
```

# Admin User Only

## client.createTenant

`async client.createTenant(email, password, plan, attribution, dcList, [extra]): Object`

Creates a tenant.

**Arguments**

- **email**: `string`
    Email address of the tenant 

- **password**: `string`

    Password of the tenant.

- **attribution**: `string`
    Attribution of the tenant 

- **plan**: `string`
     Name of the tenant plans

- **dcList**: `string`
    Comma separated list of the regions that you want the tenant to  access

- **extra**: `Object` (optional)

    - **metadata**: `Object` (optional)
    The metadata of the tenant as a JSON object

    - **contact**: `Object` (optional)
    Contact details of the user account. An optional JSON object with detailed contact information of the user.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.createTenant("tenant@test.com", "myPassword", "macrometa", "free" "test-eu-west-1,test-us-west-2");
```

## client.dropTenant

`async client.dropTenant(tenantEmail): Object`

Deletes the tenant.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.dropTenant("tenant@test.com");
```

## client.getDCListByTenantName

`async client.getDCListByTenantName(tenantEmail): Object`

Fetches data about the Edge Locations specific to this tenant.

**Examples**
```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const locations = await client.getDCListByTenantName("tenant@test.com");
```


## client.tenantDetails

`async client.tenantDetails(tenantEmail): Object`

Gets the details of a tenant.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.tenantDetails("tenant@test.com");
```

## client.updateTenant

`async client.updateTenant(tenantEmail, data): Object`

Modifies the given tenant.

**Arguments**

- **email**: `string`
    Email address of the tenant 

- **data**: `Object`

    - **active**: `boolean` (optional)
      Boolean flag for active status of object. This is non mandatory

    - **status**: `boolean` (optional)
      Status of tenant. This value ias added for future reference. This is non mandatory. Valid values: `active`, `expired`, `delinquent`, `inactive`

    - **metadata**: `Object` (optional)

      An optional JSON object with arbitrary extra data about the user.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

await client.updateTenant("tenant@test.com", { active: true, status: 'active', metadata: {"key": "value"} });
```
