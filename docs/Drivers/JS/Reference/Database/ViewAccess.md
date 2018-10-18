# Accessing views

These functions implement the
[HTTP API for accessing views](https://docs.macrometa.io/jsC8/latest/HTTP/Views/Getting.html).

## database.c8SearchView

`database.c8SearchView(viewName): c8SearchView`

Returns a _c8SearchView_ instance for the given view name.

**Arguments**

- **viewName**: `string`

  Name of the c8Search view.

**Examples**

```js
const db = new Database();
const view = db.c8SearchView("potatoes");
```

## database.listViews

`async database.listViews(): Array<Object>`

Fetches all views from the database and returns an array of view
descriptions.

**Examples**

```js
const db = new Database();

const views = await db.listViews();
// views is an array of view descriptions
```

## database.views

`async database.views([excludeSystem]): Array<View>`

Fetches all views from the database and returns an array of
_c8SearchView_ instances for the views.

**Examples**

```js
const db = new Database();

const views = await db.views()
// views is an array of c8SearchView instances
```
