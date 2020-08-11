## Manipulating streams

## client.createStream

`async client.createStream(streamName, [local], [isCollectionStream])`

Create asynchronously a stream for a given database.

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

- **isCollectionStream**: `boolean`

  If the stream is a collection stream or not. The default is `false`.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

await client.createStream("my-stream", true);
```

## client.hasStream

`async client.hasStream(streamName, [local])`

Returns true if stream is available

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const hasStream = await client.hasStream("my-stream", true);
```

## client.getStream

`async client.getStream(streamName, [local], [isCollectionStream])`

Returns stream instance for given stream

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

- **isCollectionStream**: `boolean`

  If the stream is a collection stream or not. The default is `false`.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = await client.getStream("my-stream", true);
```

## client.getStreamStats

`async client.getStreamStats(streamName, [local], [isCollectionStream])`

Returns statistics for given stream

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

- **isCollectionStream**: `boolean`

  If the stream is a collection stream or not. The default is `false`.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const streamStats = await client.getStreamStats("my-stream", true);
```

## client.getStreamSubscriptions

`async client.getStreamSubscriptions(streamName, [local], [isCollectionStream])`

Get the list of persistent subscriptions for a given stream

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

- **isCollectionStream**: `boolean`

  If the stream is a collection stream or not. The default is `false`.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const streamSubscriptions = await client.getStreamSubscriptions(
  "my-stream",
  true
);
```

## client.getStreamBacklog

`async client.getStreamBacklog(streamName, [local], [isCollectionStream])`

Get estimated backlog for offline stream

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

- **isCollectionStream**: `boolean`

  If the stream is a collection stream or not. The default is `false`.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const streamBacklog = await client.getStreamBacklog("my-stream", true);
```

## client.deleteStreamSubscription

`async client.deleteStreamSubscription(streamName, subscription, [local], [isCollectionStream])`

Delete a subscription.

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **subscription**: `string`

  The name of the subscription.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

- **isCollectionStream**: `boolean`

  If the stream is a collection stream or not. The default is `false`.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

await client.deleteStreamSubscription("my-stream", "my-subscription");
```

## client.clearStreamBacklog

`async client.clearStreamBacklog(subscription)`

Clear backlog for all streams for given subscription

**Arguments**

- **subscription**: `string`

  The name of the subscription.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

await client.clearStreamBacklog("my-subscription");
```

## client.clearStreamsBacklog

`async client.clearStreamsBacklog()`

Clear backlog for all streams

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

await client.clearStreamsBacklog();
```

## client.createStreamProducer

`async client.createStreamProducer(streamName, [local], [isCollectionStream], [dcName], [params])`

Returns producer access for given stream

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

- **isCollectionStream**: `boolean`

  If the stream is a collection stream or not. The default is `false`.

- **dcName**: `string`

  The dcName for the producer.

- **params**: `Object`

|         Option          |                         Description                         | Default |
| :---------------------: | :---------------------------------------------------------: | :-----: |
|    sendTimeoutMillis    |                        Send timeout                         | 30 secs |
|     batchingEnabled     |                 Enable batching of messages                 |  false  |
|   batchingMaxMessages   |       Maximum number of messages permitted in a batch       |  1000   |
|   maxPendingMessages    | Set the max size of the internal-queue holding the messages |  1000   |
| batchingMaxPublishDelay |    Time period within which the messages will be batched    |  10ms   |

**Methods**

`producer.on('open', callback )`

`producer.on('message', callback )`

`producer.on('close', callback )`

`producer.on('error', callback )`

`producer.send(message)`

`producer.close()`

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const producer = await client.createStreamProducer("my-stream", true);
```

## client.createStreamReader

`async client.createStreamReader(streamName, [subscriptionName], [local], [isCollectionStream], [dcName], [params])`

Returns consumer access for given stream

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

- **subscriptionName**: `string`

  The name of the subscription.

- **dcName**: `string`

  The dcName for the consumer.

- **params**: `Object`

|      Option       |                  Description                   |  Default  |
| :---------------: | :--------------------------------------------: | :-------: |
| ackTimeoutMillis  |                  Send timeout                  |     0     |
| subscriptionType  | Subscription type: Exclusive, Failover, Shared | Exclusive |
| receiverQueueSize |       Size of the consumer receive queue       |   1000    |
|   priorityLevel   |       Define a priority for the consumer       |     -     |

**Methods**

`consumer.on('open', callback )`

`consumer.on('message', callback )`

`consumer.on('close', callback )`

`consumer.on('error', callback )`

`consumer.close()`

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const consumer = await client.createStreamReader("my-stream", "my-sub");
```

## client.getStreams

`async client.getStreams(): Object`

Get list of all streams under given database.

To change the fabric and tenant, `client.useFabric` and `client.useTenant` respectively.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const streams = await client.getStreams();
```

## client.stream

`client.stream(streamName, local, isCollectionStream): Stream`

Returns a `Stream` instance representing the stream with the given stream name.

**Arguments**

- **streamName**: `string`

  The name of the stream to use.

- **local**: `boolean`

  Is the stream local or global (DEFAULT: false)

- **isCollectionStream**: `boolean`

  If the stream is a collection stream or not. The default is `false`.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("testStream", true, false);
```

# Advanced User

## stream.createStream

`async stream.createStream()`

Create asynchronously a stream for a given database.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();
```

## stream.publishMessage

`async stream.publishMessage(message)`

To publish a message on a stream.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();
const msg = "Hello World!";
await stream.publishMessage(msg);
```

## stream.deleteStream

`async stream.deleteStream()`

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.deleteStream();
```

## stream.backlog

`async stream.backlog()`

Get estimated backlog for offline stream.

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.backlog();
```

## stream.clearSubscriptionBacklog

`async stream.clearSubscriptionBacklog(subscription)`

Clear backlog for a stream for given subscription.

**Arguments**

- **subscription**: `string`

  The name of the subscription.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.clearSubscriptionBacklog("subscription-name");
```

## stream.clearBacklog

`async stream.clearBacklog()`

Clear backlog for all streams.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.clearBacklog();
```

## stream.getStreamStatistics

`async stream.getStreamStatistics()`

Get the statistics for the given stream.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

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
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.deleteSubscription("my-subscription");
```

## stream.expireMessages

`async stream.expireMessages(expireTimeInSeconds)`

Expire messages on a stream

**Arguments**

- **expireTimeInSeconds**: `integer`

  Expiration time in seconds.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.expireMessages(5);
```

## stream.getSubscriptionList

`async stream.getSubscriptionList()`

Get the list of persistent subscriptions for a given stream.

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();
await stream.getSubscriptionList();
```

## stream.consumer

`stream.consumer(subscriptionName, dcName, params)`

Creates a consumer for a stream.

**Arguments**

- **subscriptionName**: `string`

  The name of the subscription.

- **dcName**: `string`

  The dcName for the consumer.

- **params**: `Object`

|      Option       |                  Description                   |  Default  |
| :---------------: | :--------------------------------------------: | :-------: |
| ackTimeoutMillis  |                  Send timeout                  |     0     |
| subscriptionType  | Subscription type: Exclusive, Failover, Shared | Exclusive |
| receiverQueueSize |       Size of the consumer receive queue       |   1000    |
|   priorityLevel   |       Define a priority for the consumer       |     -     |
|        otp        |               Authorization OTP                |     -     |

**Methods**

`consumer.on('open', callback )`

`consumer.on('message', callback )`

`consumer.on('close', callback )`

`consumer.on('error', callback )`

`consumer.close()`

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();

const consumerOTP = await stream.getOtp();
const consumer = stream.consumer("my-subscription", "test.macrometa.io", {
  otp: consumerOTP,
});

consumer.on("message", (msg) => {
  const { payload, messageId } = JSON.parse(msg);
  // logging received message payload(ASCII encoded) to decode use atob()
  console.log(payload);
  // Send message acknowledgement
  consumer.send(JSON.stringify({ messageId }));
});
```

## stream.producer

`stream.producer(dcName, params)`

Creates a producer for a stream and returns producer object.

**Arguments**

- **dcName**: `string`

  The dcName for the producer.

- **params**: `Object`

|         Option          |                         Description                         | Default |
| :---------------------: | :---------------------------------------------------------: | :-----: |
|    sendTimeoutMillis    |                        Send timeout                         | 30 secs |
|     batchingEnabled     |                 Enable batching of messages                 |  false  |
|   batchingMaxMessages   |       Maximum number of messages permitted in a batch       |  1000   |
|   maxPendingMessages    | Set the max size of the internal-queue holding the messages |  1000   |
| batchingMaxPublishDelay |    Time period within which the messages will be batched    |  10ms   |
|           otp           |                      Authorization OTP                      |    -    |

**Methods**

`producer.on('open', callback )`

`producer.on('message', callback )`

`producer.on('close', callback )`

`producer.on('error', callback )`

`producer.send(message)`

`producer.close()`

**Examples**

```js
const client = new jsc8({ url: "https://gdn1.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://gdn1.macrometa.io", apikey: "XXXX" });

const stream = client.stream("my-stream", true);
await stream.createStream();

const producerOTP = await stream.getOtp();
const producer = stream.producer("test.macrometa.io", { otp: producerOTP });

producer.on("open", () => {
  // If you message is an object, convert the obj to string.
  // e.g. const message = JSON.stringify({message:'Hello World'});
  const message = "Hello World";
  const payloadObj = { payload: Buffer.from(str).toString("base64") };
  producer.send(JSON.stringify(payloadObj));
});
```
