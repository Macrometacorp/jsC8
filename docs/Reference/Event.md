## Manipulating events

## fabric.getEvents

`async fabric.getEvents(): Array<Object>`

Fetches all events from the fabric and returns an array of event descriptions.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const allEvents = fabric.getEvents();
```

## fabric.deleteEvents

`async fabric.deleteEvents(eventIds): Array<Object>`

Deletes the event/events from the fabric.

**Arguments**

- **eventIds**: `Array<String>`

  An array of event ids.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
await fabric.deleteEvents(["215660321","215660322"]);
```

## fabric.event

`fabric.event(entityName, eventId): Event`

Returns a _Event_ instance representing the event with the given entity name or the given eventId.

**Arguments**

- **entityName**: `string | null`

  The name of the entity to use to create the event. It should be null when fetching the details of a particular event

- **eventId**: `number`

  Generated unique identifier for the event. Mandatory while fetching the details of the event and optional while creating the event.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const event = fabric.event("testEvent"); // To create a event
const eventDetails = fabric.event(null, 258849024);
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

  The type of the event can be one of the following: "COLLECTION", "GRAPH", "PIPELINE", "AUTH", "STREAM" or "GEOFABRIC"

- **details**: `string`
  Additional details about the event. Ex: error message.

- **action**: `string`

  The activity of the event can be one of the following: "CREATE", "UPDATE", "DELETE", "EXECUTE" or "LOGIN"

- **attributes**: `object`

  An optional JSON object with arbitrary data about the attributes.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const event = fabric.event("testEvent");
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
const fabric = new Fabric();
await fabric.login(tenant-name, user ,password);
fabric.useTenant(tenant-name);
const event = fabric.event(null, 215602123);
const eventDetails = await pipeline.details();
```