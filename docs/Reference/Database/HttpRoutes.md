## Arbitrary HTTP routes

## client.route

`client.route([path,] [headers]): Route`

Returns a new `Route` instance for the given path (relative to the fabric) that can be used to perform arbitrary HTTP requests.

**Arguments**

* **path**: `string` (optional)

  The fabric-relative URL of the route.

* **headers**: `Object` (optional)

  Default headers that should be sent with each request to the route.

If `path` is missing, the route will refer to the base URL of the client.

For more information on `Route` instances see the [Route API_ below](https://developer.document360.io/docs/route).

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const myFoxxService = client.route('my-foxx-service');
const response = await myFoxxService.post('users', {
  username: 'admin',
  password: 'hunter2'
});
// response.body is the result of
// POST /_fabric_/_system/my-foxx-service/users
// with JSON request body '{"username": "admin", "password": "hunter2"}'
```
