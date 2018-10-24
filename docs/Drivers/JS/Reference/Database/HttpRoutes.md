# Arbitrary HTTP routes

## fabric.route

`fabric.route([path,] [headers]): Route`

Returns a new _Route_ instance for the given path (relative to the fabric)
that can be used to perform arbitrary HTTP requests.

**Arguments**

* **path**: `string` (optional)

  The fabric-relative URL of the route.

* **headers**: `Object` (optional)

  Default headers that should be sent with each request to the route.

If _path_ is missing, the route will refer to the base URL of the fabric.

For more information on _Route_ instances see the
[_Route API_ below](../Route.md).

**Examples**

```js
const fabric = new Fabric();
const myFoxxService = fabric.route('my-foxx-service');
const response = await myFoxxService.post('users', {
  username: 'admin',
  password: 'hunter2'
});
// response.body is the result of
// POST /_fabric_/_system/my-foxx-service/users
// with JSON request body '{"username": "admin", "password": "hunter2"}'
```
