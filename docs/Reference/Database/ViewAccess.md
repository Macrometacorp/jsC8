# Accessing views

These functions implement the HTTP API for accessing views.

## fabric.c8SearchView

`fabric.c8SearchView(viewName): c8SearchView`

Returns a `c8SearchView`  instance for the given view name.

**Arguments**

- **viewName**: `string`

  Name of the c8Search view.

**Examples**

```js
const fabric = new Fabric();
const view = fabric.c8SearchView("potatoes");
```

## fabric.listViews

`async fabric.listViews(): Array<Object>`

Fetches all views from the fabric and returns an array of view
descriptions.

**Examples**

```js
const fabric = new Fabric();

const views = await fabric.listViews();
// views is an array of view descriptions
```

## fabric.views

`async fabric.views([excludeSystem]): Array<View>`

Fetches all views from the fabric and returns an array of
`c8SearchView` instances for the views.

**Examples**

```js
const fabric = new Fabric();
await fabric.login(email, password);
fabric.useTenant(tenant-name);

const views = await fabric.views()
// views is an array of c8SearchView instances
```
