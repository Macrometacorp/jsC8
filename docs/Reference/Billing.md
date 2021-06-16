## Billing (Billing)

## client.getAccountDetails

`async client.getAccountDetails(tenantName)`

Get account details of given tenant

**Arguments**

- **tenantName**: `string`

  Name of the tenant

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getAccountDetails('tenantName');
```


## client.updateAccountDetails

`async client.updateAccountDetails(tenantName,accountDetails)`

Update account details of given tenant

**Arguments**

- **tenantName**: `string`

  Name of the tenant

  - **accountDetails**: `object`

    - **firstname**: `string`

    - **lastname**: `string`

    - **email**: `string`

    - **phone**: `string`

    - **line1**: `string`

    - **line2**: `string`

    - **city**: `string`

    - **state**: `string`

    - **country**: `string`

    - **zipcode**: `string`

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.updateAccountDetails('tenantName','accountDetails');
```

## client.updatePaymentSettings

`async client.updatePaymentSettings(tenantName,paymentMethodId)`

Update payment settings of given tenant

**Arguments**

- **tenantName**: `string`

  Name of the tenant

- **paymentMethodId**: `string`

  Payment method id

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.updatePaymentSettings('tenantName','paymentMethodId');
```


## client.getPaymentDetailsOfPreviousMonths

`async client.getPaymentDetailsOfPreviousMonths(tenantName,limit)`

Get payment details of the previous months for the given tenant.

**Arguments**

- **tenantName**: `string`

  Name of the tenant

- **limit**: `string` (optional)

  Number of previous months for which payment details are required.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getPaymentDetailsOfPreviousMonths('tenantName','limit');
```


## client.getInvoices

`async client.getInvoices(tenantName,limit)`

Get invoices of the previous months for the given tenant

**Arguments**

- **tenantName**: `string`

  Name of the tenant

- **limit**: `string` (optional)

  Number of previous months for which invoice details are required.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getInvoices('tenantName','limit');
```



## client.getCurrentInvoices

`async client.getCurrentInvoices(tenantName)`

Get invoice of the current month for the given tenant.

**Arguments**

- **tenantName**: `string`

  Name of the tenant


**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getCurrentInvoices('tenantName');
```



## client.getInvoiceOfSpecificMonthYear

`async client.getInvoiceOfSpecificMonthYear(tenantName,year,month)`

Get invoice of given tenant, month and year

**Arguments**

- **tenantName**: `string`
   
   Name of the tenant
   
- **year**: `string`
    
  Year in 'YYYY' format. Example:2021
   
- **month**: `string`

  Month. Valid values:[1..12]
   

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getInvoiceOfSpecificMonthYear('tenantName','year','month');
```


## client.getUsageOfTenant

`async client.getUsageOfTenant(tenantName,startDate,endDate)`

Get usage of tenant

**Arguments**

- **tenantName**: `string`
   
   Name of the tenant
   
- **startDate**: `string` (optional)
  
  Start date in 'YYYY-MM-DD' format. Example: 2020-12-31
   
- **endDate**: `string` (optional)
  
  End date in 'YYYY-MM-DD' format. Example: 2020-12-31
   

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getUsageOfTenant('tenantName','startDate','endDate');
```


## client.getUsageOfTenantForSpecificRegion

`async client.getUsageOfTenantForSpecificRegion(tenantName,region,startDate,endDate)`

Get usage of tenant

**Arguments**

- **tenantName**: `string`
   
   Name of the tenant

- **region**: `string`
   
   Name of the tenant
   
- **startDate**: `string` (optional)
  
  Start date in 'YYYY-MM-DD' format. Example: 2020-12-31
   
- **endDate**: `string` (optional)
  
  End date in 'YYYY-MM-DD' format. Example: 2020-12-31
   

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getUsageOfTenantForSpecificRegion('tenantName','region','startDate','endDate');
```
