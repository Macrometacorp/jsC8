## Manipulating events

## client.getEvents

`async client.getEvents(): Array<Object>`

Fetches all events from the fabric and returns an array of event descriptions.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const allEvents = client.getEvents();
```

## client.deleteEvents

`async client.deleteEvents(eventIds): Array<Object>`

Deletes the event/events from the client.

**Arguments**

- **eventIds**: `Array<String>`

  An array of event ids.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
await client.deleteEvents(["215660321","215660322"]);
```

## client.event

`client.event(entityName, eventId): Event`

Returns a _Event_ instance representing the event with the given entity name or the given eventId.

**Arguments**

- **entityName**: `string`

  The name of the entity to use to create the event. If the entity name is not known pass an empty string.

- **eventId**: `number` (optional)

  Generated unique identifier for the event in case when the event already exists. The `eventId` will automatically get assigned while creating an event.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const event = client.event("testEvent"); // To create a event
const eventDetails = client.event(null, 258849024);
```

## event.create

`async event.create(requestObject): Object`

Creates an event. The request object contains the below properties.

**Properties**

- **status**: `string`
  The status of the event can be one of the following: "OK", "WARN" or "ERROR"

- **description**: `string`

  Description of the event

- **entityType**: `string`

  The type of the event can be one of the following: "COLLECTION", "GRAPH", "AUTH", "STREAM" or "GEOFABRIC"

- **details**: `string`
  Additional details about the event. Ex: error message.

- **action**: `string`

  The activity of the event can be one of the following: "CREATE", "UPDATE", "DELETE", "EXECUTE" or "LOGIN"

- **attributes**: `object`

  An optional JSON object with arbitrary data about the attributes.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const event = client.event("testEvent");
await event.create({
    status: "OK",
    description: "description about the event",
    entityType: "GEOFABRIC",
    details: "additional details about the event",
    action: "CREATE",
    attributes: {},
});
```

## event.details

`async event.details(): Object`

Fetches the details of a particular event.

**Examples**

```js
const client = new jsc8();
await client.login(email, password);
client.useTenant(tenant-name);
const event = client.event(null, 215602123);
const eventDetails = await event.details();
```