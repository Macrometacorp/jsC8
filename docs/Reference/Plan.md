## Plan (Plan)

## client.getListOfPlans

`async client.getListOfPlans()`

 Return list of plans

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getListOfPlans();
```

## client.createPlan

`async client.createPlan(planDetails)`

Get account details of given tenant

**Arguments**

- **planDetails**: `Object`

  - **name**: `string`

        Plan name

    - **planId**: `string`

        Plan id

    - **description**: `string`

        Description of given plan

    - **featureGates**: `Array<string>`

        A list of string containing the enabled feature gates for this plan

    - **attribution**: `string`

        Plan attribution

    - **label**: `string`

        Display label

    - **isBundle**: `boolean`

        The bundle true/false

    - **metadata**: `object`

        Metadata of the plan, having set of key-value pairs.

    - **metrics**: `Array<object>`

        List of metrics applicable for this plan.

        Object consists of below params.

        - **name**: `string`

        - **value**: `string`

        - **metricType**: `string`

    - **active**: `boolean`

         A mandatory flag that specifies whether the plan is active.

    - **demo**: `boolean`

        An optional flag that specifies whether the plan is a demo plan or not.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.createPlan('planDetails');
```

## client.updatePlan

`async client.updatePlan(name,planDetails)`

Get account details of given tenant

**Arguments**

- **name**: `string`

    Name of the plan to modify

- **planDetails**: `Object`

  - **name**: `string`

        Plan name

    - **planId**: `string`

        Plan id

    - **description**: `string`

        Description of given plan

    - **featureGates**: `Array<string>`

        A list of string containing the enabled feature gates for this plan

    - **attribution**: `string`

        Plan attribution

    - **label**: `string`

        Display label

    - **isBundle**: `boolean`

        The bundle true/false

    - **metadata**: `object`

        Metadata of the plan, having set of key-value pairs.

    - **metrics**: `Array<object>`

        List of metrics applicable for this plan.

        Object consists of below params.

        - **name**: `string`

        - **value**: `string`

        - **metricType**: `string`

    - **active**: `boolean`

         A mandatory flag that specifies whether the plan is active.

    - **demo**: `boolean`

        An optional flag that specifies whether the plan is a demo plan or not.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.updatePlan('name','planDetails');
```

## client.deletePlan

`async client.deletePlan(name)`

Removes an existing plan

**Arguments**

- **name**: `string`

    Plan name to delete

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.deletePlan('name');
```


## client.getPlanDetails

`async client.getPlanDetails(name)`

Fetches data about the given plan

**Arguments**

- **name**: `string`

    Plan name to get details

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.getPlanDetails('name');
```

## client.updateTenantPlan

`async client.updateTenantPlan(updateTenantPlan)`

Update the plan for specified tenant.

**Arguments**

- **updateTenantPlan**: `object`

   - **attribution**: `string`

      Attribution of the plan.

   - **plan**: `string`

      Name of the plan.

   - **tenant**: `string`

      Name of the tenant.

   - **payment_method_id**: `string`

     Stripe payment method ID which should be associated account.


    

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const result = await client.updateTenantPlan('updateTenantPlan');
```



