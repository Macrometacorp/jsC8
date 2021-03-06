# C8 JavaScript Driver - Getting Started

## Compatibility

The yarn/npm distribution of jsc8 is compatible with Node.js versions 9.x (latest), 8.x (LTS) and 6.x (LTS). Node.js version support follows [the official Node.js long-term support schedule](https://github.com/nodejs/LTS).

The included browser build is compatible with Internet Explorer 11 and recent
versions of all modern browsers (Edge, Chrome, Firefox and Safari).

Versions outside this range may be compatible but are not actively supported.

## Versions

The version number of this driver does not indicate supported C8 versions!

This driver uses semantic versioning:

- A change in the bugfix version (e.g. X.Y.0 -> X.Y.1) indicates internal
  changes and should always be safe to upgrade.
- A change in the minor version (e.g. X.1.Z -> X.2.0) indicates additions and
  backwards-compatible changes that should not affect your code.
- A change in the major version (e.g. 1.Y.Z -> 2.0.0) indicates _breaking_
  changes that require changes in your code to upgrade.

If you are getting weird errors or functions seem to be missing, make sure you are using the latest version of the driver and following documentation written for a compatible version. If you are following a tutorial written for an older version of jsC8, you can install that version using the `<name>@<version>` syntax:

```sh
# for version 4.x.x
yarn add jsc8
# - or -
npm install --save jsc8
```

You can find the documentation for each version by clicking on the corresponding
date on the left in
[the list of version tags](https://github.com/macrometacorp/jsC8/tags).

## Install

### With Yarn or NPM

```sh
yarn add jsc8
# - or -
npm install --save jsc8
```

### From source

```sh
git clone https://github.com/macrometacorp/jsC8.git
cd jsC8
npm install
npm run dist
```

### For browsers

For production use jsC8 can be installed with Yarn or NPM like any other dependency. Just use jsC8 like you would in your server code:

```js
import { jsc8 } from "jsc8";
// -- or --
var jsC8 = require("jsc8");
```

Additionally the NPM release comes with a precompiled browser build:

```js
var jsC8 = require("jsc8/lib/web");
```

You can also use [unpkg](https://unpkg.com) during development:

```html
< !-- note the path includes the version number (e.g. 0.10.2) -- >
<script src="https://unpkg.com/jsc8/lib/web.js"></script>
<script>
var client = new jsC8.Fabric();
client.listCollections().then(function (collections) {
  alert("Your collections: " + collections.map(function (collection) {
    return collection.name;
  }).join(", "));
});
</script>
```

If you are targetting browsers older than Internet Explorer 11 you may want to
use [babel](https://babeljs.io) with a
[polyfill](https://babeljs.io/docs/usage/polyfill) to provide missing
functionality needed to use jsC8.

When loading the browser build with a script tag make sure to load the polyfill first:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.js"></script>
<script src="https://unpkg.com/jsc8@0.10.2/lib/web.js"></script>
```

## Basic usage example

This section aims to provide a basic understanding of all the features.

```js
import { jsc8, c8ql } from "jsc8";

const regionURL = "gdn1.macrometa.io";
const region = "try-eu-west-1";
const rootPassword = "root-password";
const tenantEmail = "myTenant@macrometa.io";
const tenantPassword = "myTenant-password";
const fabricName = "myFabric";
const collectionName = "employees";
const streamName = "myStream";

//--------------------------------------------------------------------------------------
// create a fabric handler
const client = new jsc8(`https://${regionURL}`);

// login with root user
await client.login(email, rootPassword);

// login with token
const client = new jsc8({url: `https://${regionURL}`, token:"XXXX"});

// login with apikey
const client = new jsc8({url: `https://${regionURL}`, apiKey: "XXXX"});

//--------------------------------------------------------------------------------------
// create a tenant
const guestTenant = client.tenant(tenantEmail);
await guestTenant.createTenant(tenantPassword, ["region-name"]);
// log in with the newly created tenant
await client.login(tenantEmail, tenantPassword);
client.useTenant(guestTenant.name);

//--------------------------------------------------------------------------------------
// create a new geo fabric in the newly created tenant
await client.createFabric(fabricName, [{ username: "root" }], {
  dcList: region,
});
client.useFabric(fabricName);

//--------------------------------------------------------------------------------------
// create and populate employees collection in the above tenant and geo fabric
const collection = await client.createCollection(collectionName);

//--------------------------------------------------------------------------------------
// See what is happening to your collections in realtime
const listener = await client.onCollectionChange(collectionName);

listener.on('message',(msg) => console.log("message=>", msg));
listener.on('open',async () => {
    console.log("connection open");
    //manipulate the collection here

    // add new documents to the collection
    await collection.save({ firstname: "Jean", lastname: "Picard" });
    await collection.save({ firstname: "Bruce", lastname: "Wayne" });
  });
listener.on('close',() => console.log("connection closed"));

//--------------------------------------------------------------------------------------
// Querying is done by C8QL
// you can directly pass the query
// or use restql to save the query once and call it multiple times
const cursor = await client.query(
  c8ql`FOR employee IN employees RETURN employee`
);
const result = await cursor.next();

// RESTQL
// now we save the same query and will call it later directly by its name
const query = "FOR employee IN employees RETURN employee";
const queryName = "listEmployees";
await client.createRestql(queryName, query, {});
const res = await client.executeRestql(queryName);

//--------------------------------------------------------------------------------------
// Create persistent, global and local streams in demofabric

// Here the second param value tells if the stream is local or global. false means that it is global.(DEFAULT: false)
const persistent_globalStream = await client.createStream(streamName, false);
const persistent_localStream = await client.createStream(streamName, true);


// ADVANCED

// Here the last boolean value tells if the stream is local or global. false means that it is global.(DEFAULT: false)

const persistent_globalStream = client.stream(streamName, false);
await persistent_globalStream.createStream();

const persistent_localStream = client.stream(streamName, true);
await persistent_localStream.createStream();


//--------------------------------------------------------------------------------------

// Subscribe to a stream

await client.createStream(streamName, false);

const consumer = await client.createStreamReader("my-sub", regionURL);
const producer = await client.createStreamProducer(regionURL);

// OR ADVANCED

const stream = client.stream(streamName, false);
await stream.createStream();

const consumerOTP = await stream.getOtp();
const consumer = stream.consumer("my-sub", regionURL, { otp : consumerOTP });

const producerOTP = await stream.getOtp();
const producer = stream.producer(regionURL,  { otp : producerOTP });


consumer.on("message", (msg) => {
  const { payload, messageId } = JSON.parse(msg);
  // logging received message payload(ASCII encoded) to decode use atob()
  console.log(payload);
  // Send message acknowledgement
  consumer.send(JSON.stringify({ messageId }));
});

producer.on("open", () => {
  // If you message is an object, convert the obj to string.
  // e.g. const message = JSON.stringify({message:'Hello World'});
  const message = "Hello World";
  const payloadObj = { payload: Buffer.from(str).toString("base64") };
  producer.send(JSON.stringify(payloadObj));
});

//--------------------------------------------------------------------------------------
// Spot Collections
await client.login(rootEmail, rootPassword);
client.useTenant("_mm");
client.useFabric("_system");
// Make a geo location as spot enabled
await client.changeEdgeLocationSpotStatus(region, true);
// Create a geo-fabric with spot region capabilities.
client.createFabric("spotFabric", [{ username: "root" }], {
  dcList: region,
  spotDc: true,
});
// Then create a collection that is designated as a spot collection.
await client.createCollection(collectionName, { isSpot: true });

//--------------------------------------------------------------------------------------
// Local Collections
await client.login(rootEmail, rootPassword);
client.useTenant("_mm");
client.useFabric("_system");
// Make a geo location as spot enabled
await client.changeEdgeLocationSpotStatus(region, true);
// Create a geo-fabric with spot region capabilities.
client.createFabric("spotFabric", [{ username: "root" }], {
  dcList: region,
  spotDc: true,
});
// Then create a collection that is designated as a local collection.
await client.createCollection(collectionName, { isLocal: true });
```

For C8QL please check out the [c8ql template tag](https://macrometa.gitbook.io/c8/c8ql/fundamentals/bindparameters) for writing parametrized C8QL queries without making your code vulnerable to injection attacks.

## Error responses

If jsC8 encounters an API error, it will throw an _C8Error_ with an [_errorNum_ as defined in the C8 documentation](https://macrometa.gitbook.io/c8/appendix/errorcodes) as well as a _code_ and _statusCode_ property indicating the intended and actual HTTP status code of the response.

For any other error responses (4xx/5xx status code), it will throw an _HttpError_ error with the status code indicated by the _code_ and _statusCode_ properties.

If the server response did not indicate an error but the response body could not be parsed, a _SyntaxError_ may be thrown instead.

In all of these cases the error object will additionally have a _response_ property containing the server response object.

If the request failed at a network level or the connection was closed without receiving a response, the underlying error will be thrown instead.

**Examples**

```js
// Using async/await
try {
  const info = await client.createFabric("mydb", [{ username: "root" }], {
    dcList: "qa1-us-east-1",
  });
  // fabric created
} catch (err) {
  console.error(err.stack);
}

// Using promises with arrow functions
client
  .createFabric("mydb", [{ username: "root" }], { dcList: "qa1-us-east-1" })
  .then(
    (info) => {
      // fabric created
    },
    (err) => console.error(err.stack)
  );
```

**Note**: the examples in the remainder of this documentation use async/await and other modern language features like multi-line strings and template tags. When developing for an environment without support for these language features, just use promises instead as in the above example.
