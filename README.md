
# C8 JavaScript Driver

The official C8 JavaScript client.

## Install

### With Yarn or NPM

```sh
yarn add jsc8
## - or -
npm install jsc8
```

If you want to use the driver outside of the current directory, you can also install it globally using the --global  flag:

```js
npm install --global jsc8
```

### From source

```sh
git clone https://github.com/macrometacorp/jsc8.git
cd jsC8
npm install
npm run dist
```


## Documentation

[Latest Documentation](https://github.com/Macrometacorp/jsC8/tree/master/docs)

jsc8 tutorial
=============

This is a short tutorial to get started with jsc8.


### Getting a handle
In order to do anything useful we need a handle to an existing C8 fabric.
Let’s do this by creating a new instance of Fabric using a connection string:

```js
fabric = new Fabric("https://default.dev.macrometa.io"); 
```

or to have failover support

```js
fabric = new Fabric(["https://default1.dev.macrometa.io", "https://default1.dev.macrometa.io"]); 
```

This connection string actually represents the default value( `"https://default.dev.macrometa.io"` ), so you can just omit it:

```js
fabric = new Fabric();
```

If that’s still too verbose for you, you can invoke the driver directly:

```js
fabric = require('jsc8')();
```
The outcome of any of the three calls should be identical.

### Login

To start working, you first have to login. This gets the auth token and automatically puts in each API call.

```js
const fabric = new Fabric();
await fabric.login("_mm", "admin", "hunter2");
```
Now we have acquired the auth token for `_mm` tenant's `admin` user.

### Creating a Geofabric

> A Fabric consists of one or many individual "geofabrics" with which you can do anything. Each geofabric is a cluster of one or more physical locations.

We don’t want to mess with any existing data, so let’s start by creating a new geofabric called “myfabric”:

```js
await fabric.createFabric("myfabric", [{ username: 'root' }], { dcList: "fabric1.ops.aws.macrometa.io" });
```
Because we’re trying to actually do something on the server, this action is asynchronous. All asynchronous methods in the C8 driver return promises but you can also pass a node-style callback instead.

Keep in mind that the new fabric you’ve created is only available once the callback is called or the promise is resolved.

### Switching to the new fabric

We’ve created a new fabric, but we haven’t yet told the driver it should start using it. Let’s change that:

```js
fabric.useFabric("myfabric");
```

You’ll notice this method is executed immediately.
The handle “fabric” now references the “myfabric” geofabric instead of the (default) “_system” geofabric it referenced before.

### Creating a tenant

```js
const guestTenant = fabric.tenant("mytenant");
await guestTenant.createTenant("my-password");
```

Here a tenant named "mytenant" will be created with password as "my-password". As in the case for creating a fabric, this call is also asynchronous.

### Switching to the new tenant

We’ve created a new tenant, but we haven’t yet told the driver it should start using it. Let’s change that:

```js
fabric.useTenant("mytenant");
```
Again like in fabric, this will be executed immediately.
The handle "fabric" now references the "mytenant" tenant instead of the (default) "_mm" tenant it referenced before.

### Another handle

Collections are where you keep your actual data.
There are actually two types of collections but for now we only need one.

Like fabrics, you need a handle before you can do anything to it:
```js
collection = fabric.collection('firstCollection');
```
Again notice that it executes immediately.
Unlike fabrics, the collection doesn’t have to already exist before we can create the handle.

### Creating a collection
We have a handle but in order to put actual data in the collection we need to create it:

```js
await collection.create();
```

### Listening to collection changes in realtime
Collections provide with a `onChange` method, with which you can see all the changes happening to an existing collection in realtime.

```js
    collection.onChange({
      onmessage: (msg) => console.log("message=>", msg),
      onopen: () => {
        console.log("connection open");
        //manipulate the collection here
        this.collectionManipulation(collection);
      },
      onclose: () => console.log("connection closed")
    }, "default.dev.macrometa.io");

    async collectionManipulation(collection) {
        const doc = {
        _key: "1",
        firstname: "Bruce",
        lastname: "Wayne"
        };
        try {
        await collection.save(doc);
        } catch (e) {
        console.log("Could not save document", e);
        }

        try {
        await collection.update("1", { email: 'wayne@gmail.com' });
        } catch (e) {
        console.log("Could not update document", e);
        }

        try {
        await collection.remove('1');
        collection.closeOnChangeConnection();
        } catch (e) {
        console.log(e);
        }
  }
```
Now whenever you manipulate the collection realtime messages can be seen.

> Note: Remember to close the `onChange`'s listeners else you will have have a memory leak. Use  `closeOnChangeConnection` for this purpose.

### Creating a document
What good is a collection without any collectibles? Let’s start out by defining a piece of data we want to store:

```js
doc = {
  _key: '1',
  firstname: 'Bruce',
  lastname: 'Wayne'
};
```
Collection entries (called documents in C8) are plain JavaScript objects and can contain anything you could store in a JSON string.
You may be wondering about the `_key` property: some property names that start with underscores are special in C8 and the key is used to identify the document later.
If you don’t specify a key yourself, C8 will generate one for you.

### Saving and updating the document

C8 also adds a `_rev` property which changes every time the document is written to, and an `_id` which consists of the collection name and document key.
These “meta” properties are returned every time you create, update, replace or fetch a document directly.

Let’s see this in action by fist saving the document:

```js
await collection.save(doc);
```
… and then updating it in place:

```js
await collection.update('1', { email: 'wayne@gmail.com' });
```

### Removing the document

We’ve played around enough with this document, so let’s get rid of it:

```js
try {
    await collection.remove('1');
} catch (e) {
    console.log(e);
}
```
Once the promise has resolved, the document has ceased to exist.
We can verify this by trying to fetch it again (which should result in an error).

If you see the error message `"document not found"`, we were successful.

### Streams
The time has come now to give you a super power. In C8 you don't need to continuously make API calls to see what has changed and when. We have realtime capabilities built in C8.
Streams can be `local/global`.

### Stream handle

```js
stream = fabric.stream(streamName, false);
```
Here the last boolean value tells if the stream is local or global. `false` means that it is global

### Create a stream

```js
await stream.createStream();
```

### Subscribing to a stream
Streams have the capability to both consume and produce messages.
To create a consumer:
```js
stream.consumer("my-sub", { onmessage:(msg)=>{ console.log(msg) } }, "default.dev.macrometa.io");
```
This will create a consumer with a callback of your choice to listen to a stream in realtime.

### Publishing to a stream
To publish a message to a stream simply use:
```js
stream.producer("hello world", "default.dev.macrometa.io");
```
The first time a producer is created it requires the datacenter name, but not later on.

So now you can simply do:
```js
stream.producer("hey hey hey world");
```
>Note: Remember to close the connections to the stream if you make a consumer or a producer.

```js
stream.closeConnections();
```
Above method will close all the active connection to the stream.

### C8QL Queries
```js
const cursor = await fabric.query(c8ql`FOR employee IN employees RETURN employee`);
const result = await cursor.next();
```

> Note that most queries return a cursor object representing the result set instead of returning an array of all of the results directly.

This helps avoiding unnecessarily cluttering up memory when working with very large result sets.

All interactions with the cursor object are asynchronous as the driver will automatically fetch additional data from the server as necessary.
Keep in mind that unlike arrays, cursors are depleted when you use them.
They’re single-use items, not permanent data structures.

### Template strings

When writing complex queries you don’t want to have to hardcode everything in a giant string.
The driver provides the same c8qlQuery template handler you can also use within C8 itself:

```js
c8ql = require('jsc8').c8ql;
```

You can use it to write c8ql templates.
Any variables referenced in c8ql templates will be added to the query’s bind values automatically.
It even knows how to treat collection handles.

```js
const cursor = await fabric.query(c8ql`FOR employee IN employees RETURN employee`);
const result = await cursor.next();
```

### Removing all the documents

Enough fooling around. Let’s end with a clean slate.
The method for completely emptying a collection is called “truncate”:

```js
try {
    await collection.truncate();
} catch (e) {
    console.log(e);
}
```
When you truncate a collection, you discard all of its contents.
There’s no way back.

Keep in mind that you can also truncate fabrics.
Don’t worry about your collections though, truncating only deletes the documents.
Although it’s still probably not something you want to take lightly.














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
// Log in with valid credentials
fabric.login("_mm", "root", "hunter2");
//-----------------------------------------------------------------
// Create a guest tenant, guest fabric
const guesttenant = fabric.tenant(tenantName);
await guesttenant.createTenant("my-password");
//Login with the newly created tenant
fabric.login(tenantName, "root", "hunter3");
fabric.useTenant(tenantName);
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
  collection.onChange({
    onmessage: (msg) => console.log("message=>", msg),
    onopen: () => {
      console.log("connection open");
      //manipulate the collection here
      this.collectionManipulation(collection);
    },
    onclose: () => console.log("connection closed")
  }, "default.dev.macrometa.io");

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
  stream.closeConnections();
```

```js
// or plain old Node-style
var jsC8 = require("jsc8");
var fabric = new jsC8.Fabric();
fabric.login("_mm", "root", "hunter2");
var stream = fabric.stream("my-stream", true);
stream.createStream().then(()=>{
  stream.consumer("my-sub", { onmessage:(msg)=>{ console.log(msg) } }, "fabric1.aws.macrometa.io");
  stream.producer("hello world", "test-eu-west-1.dev.aws.macrometa.io");
  stream.closeConnections();
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
