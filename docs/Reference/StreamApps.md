## stream Apps

## client.validateStreamApp

`async client.validateStreamApp(appDefinition): Object`

Validates the given application definition and returns an object containing a message if the definition is valid or not.

**Arguments**

- **appDefinition**: `string`

  Application Definition in string format

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const appDefinition = 
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

const validity = await client.validateStreamApp(appDefinition);
```

## client.retrieveStreamApp

`async client.retrieveStreamApp(): Object`

Get list of all stream applictions under given database.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const streamapps = await client.retrieveStreamApp();
```

## client.deleteStreamApp

`async client.deleteStreamApp(appName): Object`

Deletes Stream App

**Arguments**

- **appName**: `string`

  Application name

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

await client.deleteStreamApp("Sample-Cargo-App");
```

## client.getStreamApp

`streamapps.getStreamApp(appName): Object`

Returns details of a Stream Application.

**Arguments**

- **appName**: `string`

  Application name

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const streamApp = await client.getStreamApp("Sample-Cargo-App");
```

## client.getStreamAppSamples

`client.getStreamAppSamples(appName): Object`

Returns samples for Application Definition.

**Arguments**

- **appName**: `string`

  Application name

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const streamAppSamples = await client.getStreamAppSamples("Sample-Cargo-App");
```

## client.activateStreamApp

`client.activateStreamApp(appName, active): Object`

Activates or deactivates a Stream Application.

**Arguments**

- **appName**: `string`

  Application name

- **active**: `boolean`

    True: Activate
    
    False: Deactivate

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const streamAppSamples = await client.activateStreamApp("Sample-Cargo-App", true);
```

### Advanced User

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
let samples = await client.getSampleStreamApps()
```

## streamapps.retriveApplication

`streamapps.retriveApplication(): Object`

Returns details of a Stream Application.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const app = client.streamApp("Sample-Cargo-App");
let response = await app.retriveApplication();
```

## streamapps.updateApplication

`streamapps.updateApplication(): Object`

Updates the definition of a Stream Application.
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
const app = client.streamApp("Sample-Cargo-App");

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

const streamApp = await app.updateApplication(["qa1-blr1", "qa1-lon1"], appDefinition );
```

## streamapps.activateStreamApplication

`streamapps.activateStreamApplication(): Object`

Activates or deactivates a Stream Application.

**Arguments**

- **active**: `boolean`

    True: Activate
    
    False: Deactivate


**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const app = client.streamApp("Sample-Cargo-App");
const streamApp = await app.activateStreamApplication(true);
```

## streamapps.query

`streamapps.query(): Object`

Runs a query on a Stream Application.

**Arguments**

- **appName**: `string`
    Name of application you want to run the query on

- **query**: `string`
    The query


**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const app = client.streamApp("Sample-Cargo-App");
const streamApp = await app.query("select * from destCargoTable limit 3");
```

## streamapps.deleteApplication

`streamapps.deleteApplication(): Object`

Deletes a Stream Application.


**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const app = client.streamApp("Sample-Cargo-App");
const streamApp = await app.deleteApplication();
```
