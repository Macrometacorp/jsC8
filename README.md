# C8 JavaScript Driver

The official C8 low-level JavaScript client.

## Install

### With Yarn or NPM

```sh
yarn add jsc8
## - or -
npm install --save jsc8
```

### From source

```sh
git clone https://github.com/macrometacorp/jsc8.git
cd jsC8
npm install
npm run dist
```

## Basic usage example

```js
import { Fabric, STREAM_TYPE, c8ql } from "jsc8";

const region = "qa1-us-east-1.ops.aws.macrometa.io";
const tenantName = "demotenant";
const fabricName = "demofabric";
const collectionName = "employees";
const streamName = "demostream";

//-----------------------------------------------------------------
// Create a fabric object
const fabric = new Fabric(region);

//-----------------------------------------------------------------
// Create a demotenant, demofabric
const demotenant = fabric.tenant(tenantName);
await demotenant.createTenant("my-password");
fabric.useTenant(tenantName);
fabric.useBasicAuth();
await fabric.createFabric(fabricName, [{ username: 'root' }], { dcList: region, realTime: true });

//-----------------------------------------------------------------
// Create and populate employees collection in demofabric
fabric.useFabric(fabricName);
const collection = fabric.collection(collectionName);
await collection.create();
await collection.createHashIndex(['firstname'], true);//Add a hash index to the collection.
await collection.save({firstname: 'Jean', lastname: 'Picard'});
await collection.save({firstname: 'Bruce', lastname: 'Wayne'});

//-----------------------------------------------------------------
// Query employees collection
  const cursor = await fabric.query(c8ql`FOR employee IN employees RETURN employee`);
  const result = await cursor.next();

//-----------------------------------------------------------------
// Real-time updates from a collection in fabric
  const callback = evt => console.log(evt);
  fabric.onChange(collectionName, callback);

//-----------------------------------------------------------------
// Create persistent, global and local streams in demofabric
  const persistent_globalStream = fabric.stream(streamName, STREAM_TYPE.PERSISTENT_STREAM, false);
  await persistent_globalStream.createStream();

  const persistent_localStream = fabric.stream(streamName, STREAM_TYPE.PERSISTENT_STREAM, true);
  await persistent_localStream.createStream();

// Create non-persistent, global and local streams in demofabric
  const non_persistent_globalStream = fabric.stream(streamName, STREAM_TYPE.NON_PERSISTENT_STREAM, false);
  await non_persistent_globalStream.createStream();

  const non_persistent_localStream = fabric.stream(streamName, STREAM_TYPE.NON_PERSISTENT_STREAM, true);
  await non_persistent_localStream.createStream();

  const streams = await fabric.getStreams();

// Subscribe to a stream
  const stream = fabric.stream(streamName, STREAM_TYPE.PERSISTENT_STREAM, false);
  await stream.createStream();
  stream.consumer("my-sub", { onmessage:(msg)=>{ console.log(msg) } }, region);

// Publish to a stream
  stream.producer("hello world", region);
  stream.producer("hey hey hey world");

// Close all connections to a stream
  stream.closeWSConnections();
```

```js
// or plain old Node-style
var jsC8 = require("jsc8");
var fabric = new jsC8.Fabric();
var stream = fabric.stream("my-stream", jsC8.STREAM_TYPE.PERSISTENT_STREAM, true);
stream.createStream().then(()=>{
  stream.consumer("my-sub", { onmessage:(msg)=>{ console.log(msg) } }, "test-eu-west-1.dev.aws.macrometa.io");
  stream.producer("hello world", "test-eu-west-1.dev.aws.macrometa.io");
  stream.closeWSConnections();
});
var now = Date.now();
fabric.query({
  query: "RETURN @value",
  bindVars: { value: now }
})
  .then(function(cursor) {
    return cursor.next().then(function(result) {
      // ...
    });
  })
  .catch(function(err) {
    // ...
  });
```

## Documentation

[Latest Documentation](https://github.com/Macrometacorp/jsC8/tree/master/docs/Drivers/JS)

## Testing

Run the tests using the `yarn test` or `npm test` commands:

```sh
yarn test
# - or -
npm test
```

To set the environment variable `TEST_C8_URL` to
something different:

```sh
TEST_C8_URL=https://myfabric.macrometa.io yarn test
# - or -
TEST_C8_URL=https://myfabric.macrometa.io npm test
```

## License

The Apache License, Version 2.0. For more information, see the accompanying
LICENSE file.
