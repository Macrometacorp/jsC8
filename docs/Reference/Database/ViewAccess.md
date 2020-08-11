# Accessing views

These functions implement the HTTP API for accessing views.

## client.c8SearchView

`client.c8SearchView(viewName): c8SearchView`

Returns a `c8SearchView`  instance for the given view name.

**Arguments**

- **viewName**: `string`

  Name of the c8Search view.

**Examples**

```js
const client = new jsc8();
const view = client.c8SearchView("potatoes");
```

## client.listViews

`async client.listViews(): Array<Object>`

Fetches all views from the fabric and returns an array of view
descriptions.

**Examples**

```js
const client = new jsc8();

const views = await client.listViews();
// views is an array of view descriptions
```

## client.views

`async client.views([excludeSystem]): Array<View>`

Fetches all views from the fabric and returns an array of
`c8SearchView` instances for the views.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apikey: "XXXX"});

const views = await client.views();
// views is an array of c8SearchView instances
```
