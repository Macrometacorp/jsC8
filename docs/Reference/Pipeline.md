## Manipulating pipelines

## fabric.getPipelines

`async fabric.getPipelines(): Array<Object>`

Fetches all pipelines from the fabric and returns an array of pipeline descriptions.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name);
const allPipelines = fabric.getPipelines();
```

## fabric.pipeline

`fabric.pipeline(pipelineName): Pipeline`

Returns a _Pipeline_ instance representing the pipeline with the given pipeline name.

**Arguments**

- **pipelineName**: `string`

  The name of the pipeline to use.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name);
const pipeline = fabric.pipeline("testPipeline");
```

## pipeline.create

`async pipeline.create(regions, enabled, config): Object`

Creates a pipeline.

**Arguments**

- **regions**: `Array<string>`
    list of the regions where you want the pipelines to be deployed

- **enabled**: `boolean`

  Flag to enable/disable the pipeline at the given location

- **config**: `object`

  An optional JSON object with arbitrary extra data about the configuration.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name);
const pipeline = fabric.pipeline("testPipeline");
await pipeline.create(["test-eu-west-1", "test-us-west-2"], true , {});
```

## pipeline.drop

`async pipeline.drop: Object`

Deletes the pipeline.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name);
const pipeline = fabric.pipeline("testPipeline");
await pipeline.create(["test-eu-west-1", "test-us-west-2"], true , {});
await pipeline.drop();
```

## pipeline.details

`async pipeline.details(): Object`

Gets the details of a particular pipeline.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name);
const pipeline = fabric.pipeline("testPipeline");
await pipeline.create(["test-eu-west-1", "test-us-west-2"], true , {});
await pipeline.details();
```

## pipeline.update

`async pipeline.update(regions, enabled, config): Object`

Modifies the given pipeline.

**Arguments**

- **regions**: `Array<string>`
    Comma seperated list of the regions where you want the pipelines to be deployed

- **enabled**: `boolean`

  Flag to enable/disable the pipeline at the given location

- **config**: `object`

  An optional JSON object with arbitrary extra data about the configuration.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name);
const pipeline = fabric.pipeline("testPipeline");
await pipeline.create(["test-eu-west-1", "test-us-west-2"], true , {});
await pipeline.update(["test-eu-west-1"], false , {});
```
