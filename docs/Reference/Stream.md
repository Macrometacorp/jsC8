## Manipulating streams

## client.stream

`client.stream(streamName, local, isCollectionStream): Stream`

Returns a `Stream` instance representing the stream with the given stream name.

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global

- **isCollectionStream**: `boolean`

  If the stream is a collection stream or not. The default is `false`.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenantName);
const stream = client.stream("testStream", true, false);
```

## client.getStreams

`async client.getStreams(): Object`

Get list of all streams under given database.

To change the fabric and tenant, `client.useFabric` and `client.useTenant` respectively.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const streams = await client.getStreams();
```

## client.listPersistentStreams

`async client.listPersistentStreams(local)`

Get list of persistent streams under the given stream db. Returns either a list of global or of local streams.

To change the fabric and tenant, `client.useFabric` and `client.useTenant` respectively.

**Arguments**

- **local**: `boolean`

  Should the streams be local or global.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const streams = await client.listPersistentStreams(true);
```

## client.clearBacklog

`async client.clearBacklog()`

Clear backlog for all streams for given subscription.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
await client.clearBacklog();
```

## client.clearSubscriptionBacklog

`async client.clearSubscriptionBacklog(subscription)`

Clear backlog for all streams for given subscription.

**Arguments**

- **subscription**: `string`

  The name of the subscription.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
await client.clearSubscriptionBacklog("my-subscription");
```

## client.unsubscribe

`async client.unsubscribe(subscription)`

Unsubscribes the given subscription on all streams on a stream db.

**Arguments**

- **subscription**: `string`

  The name of the subscription.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
await client.unsubscribe("my-subscription");
```

## stream.createStream

`async stream.createStream()`

Create asynchronously a stream for a given database.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
```

## stream.expireMessagesOnAllSubscriptions

`async stream.expireMessagesOnAllSubscriptions(expireTime)`

Expire messages on all subscriptions of a stream.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.expireMessagesOnAllSubscriptions(5);
```

## stream.backlog

`async stream.backlog()`

Get estimated backlog for offline stream.

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.backlog();
```

## stream.compaction

`async stream.compaction()`

Get the status of a compaction operation for a stream.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.compaction();
```

## stream.triggerCompaction

`async stream.triggerCompaction()`

Trigger a compaction operation on a stream.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.triggerCompaction();
```

## stream.getStreamStatistics

`async stream.getStreamStatistics()`

Get the statistics for the given stream.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.getStreamStatistics();
```

## stream.deleteSubscription

`async stream.deleteSubscription(subscription)`

Delete a subscription.

**Arguments**

- **subscription**: `string`

  The name of the subscription.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.deleteSubscription("my-subscription");
```

## stream.resetSubscriptionToPosition

`async stream.resetSubscriptionToPosition(subscription)`

Reset subscription to message position closest to given position.

**Arguments**

- **subscription**: `string`

  The name of the subscription.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.resetSubscriptionToPosition("my-subscription");
```

## stream.expireMessages

`async stream.expireMessages(subscription, expireTimeInSeconds)`

Expire messages on a stream subscription.

**Arguments**

- **subscription**: `string`

  The name of the subscription.

- **expireTimeInSeconds**: `integer`

  Expiration time in seconds.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.expireMessages("my-subscription", 5);
```

## stream.resetCursor

`async stream.resetCursor(subscription)`

Disconnect all active consumers for a cursor and reset the cursor.

**Arguments**

- **subscription**: `string`

  The name of the subscription.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.resetCursor("my-subscription");
```

## stream.resetSubscriptionToTimestamp

`async stream.resetSubscriptionToTimestamp(subscription, timestamp)`

Reset subscription to message position closest to absolute timestamp (in miliseconds).

**Arguments**

- **subscription**: `string`

  The name of the subscription.

- **timestamp**: `integer`

  Timestamp in miliseconds.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.resetSubscriptionToTimestamp("my-subscription", 2000);
```

## stream.skipNumberOfMessages

`async stream.skipNumberOfMessages(subscription, numMessages)`

Skip num messages on a topic subscription.

**Arguments**

- **subscription**: `string`

  The name of the subscription.

- **numMessages**: `integer`

  Number of messages to skip.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.skipNumberOfMessages("my-subscription", 2);
```

## stream.skipAllMessages

`async stream.skipAllMessages(subscription)`

Skip all messages on a stream subscription.

**Arguments**

- **subscription**: `string`

  The name of the subscription.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.skipAllMessages("my-subscription");
```

## stream.getSubscriptionList

`async stream.getSubscriptionList()`

Get the list of persistent subscriptions for a given stream.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.getSubscriptionList();
```

## stream.terminateStream

`async stream.terminateStream()`

Terminate a stream. A stream that is terminated will not accept any more messages to be published and will let consumer to drain existing messages in backlog.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.terminateStream();
```

## stream.consumer

`stream.consumer(subscriptionName, dcName, params)`

Creates a consumer for a stream.

**Arguments**

- **subscriptionName**: `string`

  The name of the subscription.

- **dcName**: `string`

  The dcName for the consumer.

- **params**: `object`

|       Option      	|                   Description                  	|  Default  	|
|:-----------------:	|:----------------------------------------------:	|:---------:	|
| ackTimeoutMillis  	| Send timeout                                   	| 0         	|
| subscriptionType  	| Subscription type: Exclusive, Failover, Shared 	| Exclusive 	|
| receiverQueueSize 	| Size of the consumer receive queue             	| 1000      	|
| priorityLevel     	| Define a priority for the consumer             	| -         	|

**Methods**

`consumer.on('open', callback )`

`consumer.on('message', callback )`

`consumer.on('close', callback )`

`consumer.on('error', callback )`

`consumer.close()`


**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenantName);
const stream = client.stream("my-stream", true);
await stream.createStream();

const consumer = stream.consumer("my-subscription", "test.macrometa.io");

consumer.on("message", (msg) => {
  console.log(msg);
});
```

## stream.producer

`stream.producer(dcName, params)`

Creates a producer for a stream and returns producer object.

**Arguments**

- **dcName**: `string`

  The dcName for the producer.
- **params**: `object`

|          Option         	|                         Description                         	| Default 	|
|:-----------------------:	|:-----------------------------------------------------------:	|:-------:	|
| sendTimeoutMillis       	| Send timeout                                                	| 30 secs 	|
| batchingEnabled         	| Enable batching of messages                                 	| false   	|
| batchingMaxMessages     	| Maximum number of messages permitted in a batch             	| 1000    	|
| maxPendingMessages      	| Set the max size of the internal-queue holding the messages 	| 1000    	|
| batchingMaxPublishDelay 	| Time period within which the messages will be batched       	| 10ms    	|

**Methods**

`producer.on('open', callback )`

`producer.on('message', callback )`

`producer.on('close', callback )`

`producer.on('error', callback )`

`producer.send(message)`

`producer.close()`

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant - name);
const stream = client.stream("my-stream", true);
await stream.createStream();

const publisher = stream.producer("test.macrometa.io");

// Publish to a stream
function publish(payload) {
  return publisher.send({ payload });
}

publisher.on("open", () => {
  publish("Hello World!");
});

publisher.on("message", (msg) => {
  console.log(msg, "Sent Successfully");
});
```

The Simple Way

**Examples**

```js
//Instance with login
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"}); //OR with apikey
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});
```

## client.createStream

`async stream.createStream(streamName, [local], [isCollectionStream])`

Create asynchronously a stream for a given database.

```js
await client.createStream("my-stream", true);
```

## client.hasStream

`async stream.hasStream(streamName, [local])`

Returns true if stream is available

```js
const hasStream = await client.hasStream("my-stream", true);
```

## client.getStream

`async stream.getStream(streamName, [local], [isCollectionStream])`

Returns stream instance for given stream

```js
const stream = await client.getStream("my-stream", true);
```

## client.getStreamStats

`async stream.getStreamStats(streamName, [local], [isCollectionStream])`

Returns statistics for given stream

```js
const streamStats = await client.getStreamStats("my-stream", true);
```

## client.getStreamSubscriptions

`async stream.getStreamSubscriptions(streamName, [local], [isCollectionStream])`

Get the list of persistent subscriptions for a given stream

```js
const streamSubscriptions = await client.getStreamSubscriptions("my-stream", true);
```

## client.getStreamBacklog

`async stream.getStreamBacklog(streamName, [local], [isCollectionStream])`

Get estimated backlog for offline stream

```js
const streamBacklog = await client.getStreamBacklog("my-stream", true);
```

## client.deleteStreamSubscription

`async stream.deleteStreamSubscription(streamName, subscription, [local], [isCollectionStream])`

Delete a subscription.

```js
await client.deleteStreamSubscription("my-stream", "my-subscription");
```

## client.clearStreamBacklog

`async stream.clearStreamBacklog(subscription)`

Clear backlog for all streams for given subscription

```js
await client.clearStreamBacklog("my-subscription");
```

## client.clearStreamsBacklog

`async stream.clearStreamsBacklog()`

Clear backlog for all streams

```js
await client.clearStreamsBacklog();
```

## client.createStreamProducer

`async stream.createStreamProducer(streamName, [[local]], [isCollectionStream], [dcName], [params])`

Returns producer access for given stream

```js
const producer = await client.createStreamProducer("my-stream", true);
```

## client.createStreamReader

`async stream.createStreamReader(streamName, [subscriptionName], [local], [isCollectionStream], [dcName], [params])`

Returns consumer access for given stream

```js
const consumer = await client.createStreamReader("my-stream", "my-sub");
```
