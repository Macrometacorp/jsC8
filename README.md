# C8 JavaScript Driver

The official C8 JavaScript client.

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
import { Fabric, c8ql } from "jsc8";

const region = "fabric1.ops.aws.macrometa.io";
const tenantName = "guest";
const fabricName = "fabric1";
const collectionName = "employees";
const streamName = "guest_stream";

//-----------------------------------------------------------------
// Create a fabric object
const fabric = new Fabric(region);

//-----------------------------------------------------------------
// Create a guest tenant, guest fabric
const guesttenant = fabric.tenant(tenantName);
await guesttenant.createTenant("my-password");
fabric.useTenant(tenantName);
fabric.useBasicAuth();
await fabric.createFabric(fabricName, [{ username: 'root' }], { dcList: region });

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
  const persistent_globalStream = fabric.stream(streamName, false);
  await persistent_globalStream.createStream();

  const persistent_localStream = fabric.stream(streamName, true);
  await persistent_localStream.createStream();

  const streams = await fabric.getStreams();

// Subscribe to a stream
  const stream = fabric.stream(streamName, false);
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
var stream = fabric.stream("my-stream", true);
stream.createStream().then(()=>{
  stream.consumer("my-sub", { onmessage:(msg)=>{ console.log(msg) } }, "fabric1.aws.macrometa.io");
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

[Latest Documentation](https://github.com/Macrometacorp/jsC8/tree/master/docs)

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
