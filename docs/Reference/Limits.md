## Manipulating tenants limits


## client.getDefaultLimits

`async client.getDefaultLimits(): <object>`

Returns the default limits for tenants.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.getDefaultLimits();
```

## client.setDefaultLimits

`async client.setDefaultLimits(limitsData): <object>`


Sets the default tenant limits.

If data fields are omitted, they will be set to c8db defined default values.

**Arguments**

- **limitsData**: `Object`

    - **database**: `Object`

        - **maxDocumentSize**: `number`;
        - **maxDocumentsReturnedByQuery**: `number`;
        - **maxQueryExecutionTimeInMs**: `number`;
        - **maxQueryMemoryBytes**: `number`;
        - **maxGeoFabricsPerTenant**: `number`;
        - **maxCollectionsPerFabric**: `number`;
        - **maxGraphsPerFabric**: `number`;
        - **maxIndexes**: `number`;
        - **maxViewsPerFabric**: `number`;
        - **maxRequestsPerDay**: `number`;
        - **maxRequestPerMinute**: `number`;
        - **maxStoragePerRegion**: `number`;
        - **maxRestQLUsagePerFabric**: `number`;
        - **maxRestQLUsagePerDay**: `number`;

     - **streamsLocal**: `Object`

        - **maxBacklogMessageTtlMin**: `number`;
        - **maxBacklogStorageSizeMB**: `number`;
        - **maxByteDispatchRatePerMin**: `number`;
        - **maxConsumersCount**: `number`;
        - **maxCount**: `number`;
        - **maxProducersCount**: `number`;
        - **maxSubscriptionsCount**: `number`;

     - **streamsGlobal**: `Object`

        - **maxBacklogMessageTtlMin**: `number`;
        - **maxBacklogStorageSizeMB**: `number`;
        - **maxByteDispatchRatePerMin**: `number`;
        - **maxConsumersCount**: `number`;
        - **maxCount**: `number`;
        - **maxProducersCount**: `number`;
        - **maxSubscriptionsCount**: `number`;

    - **Compute**: `Object`

        - **maxNamespaceConfigmapsCount**: `number`;
        - **maxNamespaceEphimeralStorageMB**: `number`;
        - **maxNamespaceLimitsCpuMi**: `number`;
        - **maxNamespaceLimitsMemoryMB**: `number`;
        - **maxNamespacePodsCount**: `number`;
        - **maxNamespaceRequestsCpuMi**: `number`;
        - **maxNamespaceRequestsMemoryMB**: `number`;
        - **maxNamespaceSecretsCount**: `number`;
        - **maxNamespaceServicesCount**: `number`;
        

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.setDefaultLimits('limitsData');
```



## client.updateDefaultLimits

`async client.updateDefaultLimits(limitsData): <object>`


Updates default tenant limits. Omitted data fields will keep their current value.


**Arguments**

- **limitsData**: `Object`

    - **database**: `Object`

        - **maxDocumentSize**: `number`;
        - **maxDocumentsReturnedByQuery**: `number`;
        - **maxQueryExecutionTimeInMs**: `number`;
        - **maxQueryMemoryBytes**: `number`;
        - **maxGeoFabricsPerTenant**: `number`;
        - **maxCollectionsPerFabric**: `number`;
        - **maxGraphsPerFabric**: `number`;
        - **maxIndexes**: `number`;
        - **maxViewsPerFabric**: `number`;
        - **maxRequestsPerDay**: `number`;
        - **maxRequestPerMinute**: `number`;
        - **maxStoragePerRegion**: `number`;
        - **maxRestQLUsagePerFabric**: `number`;
        - **maxRestQLUsagePerDay**: `number`;

     - **streamsLocal**: `Object`

        - **maxBacklogMessageTtlMin**: `number`;
        - **maxBacklogStorageSizeMB**: `number`;
        - **maxByteDispatchRatePerMin**: `number`;
        - **maxConsumersCount**: `number`;
        - **maxCount**: `number`;
        - **maxProducersCount**: `number`;
        - **maxSubscriptionsCount**: `number`;

     - **streamsGlobal**: `Object`

        - **maxBacklogMessageTtlMin**: `number`;
        - **maxBacklogStorageSizeMB**: `number`;
        - **maxByteDispatchRatePerMin**: `number`;
        - **maxConsumersCount**: `number`;
        - **maxCount**: `number`;
        - **maxProducersCount**: `number`;
        - **maxSubscriptionsCount**: `number`;

    - **Compute**: `Object`

        - **maxNamespaceConfigmapsCount**: `number`;
        - **maxNamespaceEphimeralStorageMB**: `number`;
        - **maxNamespaceLimitsCpuMi**: `number`;
        - **maxNamespaceLimitsMemoryMB**: `number`;
        - **maxNamespacePodsCount**: `number`;
        - **maxNamespaceRequestsCpuMi**: `number`;
        - **maxNamespaceRequestsMemoryMB**: `number`;
        - **maxNamespaceSecretsCount**: `number`;
        - **maxNamespaceServicesCount**: `number`;
        

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.updateDefaultLimits('limitsData');
```

## client.deleteDefaultLimits

`async client.deleteDefaultLimits(): <object>`

Resets default tenant limits.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.deleteDefaultLimits();
```


## client.getDefaultLimitsByServiceName

`async client.getDefaultLimitsByServiceName(serviceName)`

Returns the default service limits for tenants.

This method supports these services: [database, streamsLocal and streamsGlobal]

**Arguments**

- **serviceName**: `string`

    services: [database, streamsLocal and streamsGlobal]


**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.getDefaultLimitsByServiceName('serviceName');
```

## client.getLimitsFlag

`async client.getLimitsFlag()`

The flag indication whether limits are enabled for all tenants. The default value is true. If set to false, the configured limits will not be applicable.


**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.getLimitsFlag();
```

## client.enableLimitsFlag

`async client.enableLimitsFlag(value)`

The flag indication whether limits are enabled for all tenants. The default value is true. If set to false, the configured limits will not be applicable.

**Arguments**

- **value**: `boolean`


**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const data = await client.enableLimitsFlag('value');
```

