## stream Apps

## client.createStreamApp

`client.createStreamApp(dcList, appDefinition): Object`

Returns an `Object` with the information of the created Stream Application.

**Arguments**

- **dcList**: `list`

    List of regions.

- **appDefinition**: `string`

    App Definition in string format.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);

let appDefinition = 
            `@App:name('Sample-Cargo-App')
                -- Stream
                define stream srcCargoStream (weight int);
                -- Table
                define table destCargoTable (weight int, totalWeight long);
                -- Data Processing
                @info(name='Query')
                select weight, sum(weight) as totalWeight
                from srcCargoStream
                insert into destCargoTable;`

const streamApp = await client.createStreamApp(["qa1-blr1", "qa1-lon1"], appDefinition );
```

## client.getAllStreamApps

`async client.getAllStreamApps(): Object`

Get list of all stream applictions under given database.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const streamapps = await client.getAllStreamApps();
// To change the fabric and tenant, client.useFabric and client.useTenant respectively
```

## client.validateStreamappDefinition

`async client.validateStreamappDefinition(appDefinition): Object`

Validates the given application definition and returns an object containing a message if the definition is valid or not.

**Arguments**

- **appDefinition**: `string`

  Application Definition in string format

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
let appDefinition = 
            `@App:name('Sample-Cargo-App')
                -- Stream
                define stream srcCargoStream (weight int);
                -- Table
                define table destCargoTable (weight int, totalWeight long);
                -- Data Processing
                @info(name='Query')
                select weight, sum(weight) as totalWeight
                from srcCargoStream
                insert into destCargoTable;`

const validity = await client.validateStreamappDefinition(appDefinition);
// To change the fabric and tenant, client.useFabric and client.useTenant respectively
```

## client.getSampleStreamApps

`client.getSampleStreamApps(): Object`

Returns samples for Application Definition.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
let samples = await fabric.getSampleStreamApps()
```

