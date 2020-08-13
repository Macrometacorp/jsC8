## Fabric

## new Fabric

`new Fabric([config]): Fabric`

Creates a new `Fabric` instance.

If `config` is a string, it will be interpreted as `config.url`.

**Arguments**

- **config**: `Object` (optional)

  An object with the following properties:

  - **url**: `string | Array<string>` (Default: `https://test.macrometa.io`)

    Base URL of the C8 server or list of server URLs.

    If you want to use C8 with authentication, see
    `useBasicAuth` or`seBearerAuth` methods.
    
    If you need to support self-signed HTTPS certificates, you may have to add your certificates to the `agentOptions`, e.g.:

    ```js
    agentOptions: {
      ca: [
        fs.readFileSync(".ssl/sub.class1.server.ca.pem"),
        fs.readFileSync(".ssl/ca.pem")
      ];
    }
    ```

  - **isAbsolute**: `boolean` (Default: `false`)

    If this option is explicitly set to `true`, the `url` will be treated as the absolute fabric path. This is an escape hatch to allow using jsC8 with fabric APIs exposed with a reverse proxy and makes it impossible to switch databases.

  - **c8Version**: `number` (Default: `30000`)

    Value of the `x-c8-version` header. This should match the lowest
    version of C8 you expect to be using. The format is defined as
    `XYYZZ` where `X` is the major version, `Y` is the two-digit minor version
    and `Z` is the two-digit bugfix version.

    **Example**: `30102` corresponds to version 3.1.2 of C8.

    
@(Info)(Note:-)( The driver will behave differently when using different major versions of C8 to compensate for API changes. Some functions are not available on every major version of C8 as indicated in their  descriptions below (e.g. `collection.first`, `collection.bulkUpdate`.)

  - **headers**: `Object` (optional)

    An object with additional headers to send with every request.

    Header names should always be lowercase. If an `"authorization"` header is  provided, it will be overridden when using `useBasicAuth` or `useBearerAuth`.

  - **agent**: `Agent` (optional)

    An http Agent instance to use for connections.

   
  - **agentOptions**: `Object` (Default: see below)

    An object with options for the agent. This will be ignored if `agent` is  also provided.
    
    Default: `{maxSockets: 3, keepAlive: true, keepAliveMsecs: 1000}`. Browser default: `{maxSockets: 3, keepAlive: false}`;

    The option `maxSockets` can also be used to limit how many requests
    jsC8 will perform concurrently. The maximum number of requests is
    equal to `maxSockets * 2` with `keepAlive: true` or
    equal to `maxSockets` with `keepAlive: false`.

    In the browser version of jsC8 this option can be used to pass
    additional options to the underlying calls of the
    [`xhr`](https://www.npmjs.com/package/xhr) module.

  - **loadBalancingStrategy**: `string` (Default: `"NONE"`)

    Determines the behavior when multiple URLs are provided:

    - `NONE`: No load balancing. All requests will be handled by the first
      URL in the list until a network error is encountered. On network error,
      jsC8 will advance to using the next URL in the list.

    - `ONE_RANDOM`: Randomly picks one URL from the list initially, then
      behaves like `NONE`.

    - `ROUND_ROBIN`: Every sequential request uses the next URL in the list.

  - **maxRetries**: `number` or `false` (Default: `0`)

    Determines the behavior when a request fails because the underlying
    connection to the server could not be opened
    (i.e. [`ECONNREFUSED` in Node.js](https://nodejs.org/api/errors.html#errors_common_system_errors)):

    - `false`: the request fails immediately.

    - `0`: the request is retried until a server can be reached but only a
      total number of times matching the number of known servers (including
      the initial failed request).

    - any other number: the request is retried until a server can be reached
      the request has been retried a total of `maxRetries` number of times
      (not including the initial failed request).

    When working with a single server without leader/follower failover, the
    retries (if any) will be made to the same server.

    This setting currently has no effect when using jsC8 in a browser.

    **Note**: Requests bound to a specific server (e.g. fetching query results)
    will never be retried automatically and ignore this setting.

## client.close

`client.close(): void`

Closes all active connections of the fabric instance.
Can be used to clean up idling connections during longer periods of inactivity.

**Note**: This method currently has no effect in the browser version of jsC8.

**Examples**

```js
const client = new jsc8({url: "https://gdn1.macrometa.io", token: "XXXX"});
//---- OR ----
const client = new jsc8({url: "https://gdn1.macrometa.io", apiKey: "XXXX"});

const sessions = client.collection("sessions");
// Clean up expired sessions once per hour
setInterval(async () => {
  await client.query(c8ql`
    FOR session IN ${sessions}
    FILTER session.expires < DATE_NOW()
    REMOVE session IN ${sessions}
  `);
  // Make sure to close the connections because they're no longer used
  client.close();
}, 1000 * 60 * 60);
```
