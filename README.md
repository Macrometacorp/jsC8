# C8 JavaScript Driver

The official C8 low-level JavaScript client.

## Install

### With Yarn or NPM

```sh
yarn add jsC8
## - or -
npm install --save jsC8
```

### From source

```sh
git clone https://github.com/macrometacorp/jsc8.git
cd jsC8
npm install
npm run dist
```

## Basic usage example

```js
// Modern JavaScript
import { Database, c8ql } from "jsC8";
const db = new Database();
(async function() {
  const now = Date.now();
  try {
    const cursor = await db.query(c8ql`RETURN ${now}`);
    const result = await cursor.next();
    // ...
  } catch (err) {
    // ...
  }
})();

// or plain old Node-style
var jsC8 = require("jsC8");
var db = new jsC8.Database();
var now = Date.now();
db.query({
  query: "RETURN @value",
  bindVars: { value: now }
})
  .then(function(cursor) {
    return cursor.next().then(function(result) {
      // ...
    });
  })
  .catch(function(err) {
    // ...
  });
```

## Documentation

[Latest Documentation](https://docs.macrometacorp.com/jsC8)

## Testing

Run the tests using the `yarn test` or `npm test` commands:

```sh
yarn test
# - or -
npm test
```

By default the tests will be run against a server listening on
`http://localhost:8529` (using username `root` with no password). To
override this, you can set the environment variable `TEST_C8DB_URL` to
something different:

```sh
TEST_C8DB_URL=http://myserver.local:8530 yarn test
# - or -
TEST_C8DB_URL=http://myserver.local:8530 npm test
```

To run the resilience/failover tests you need to set the environment variables
`RESILIENCE_C8_BASEPATH` (to use a local build of C8DB) or
`RESILIENCE_DOCKER_IMAGE` (to use a docker image by name):

```sh
RESILIENCE_C8_BASEPATH=../c8db yarn test
# - or -
RESILIENCE_C8_BASEPATH=../c8db npm test
```

This runs only the resilience/failover tests, without running any other tests.

Note that these tests are generally a lot slower than the regular test suite
because they involve shutting down and restarting individual C8DB server
instances.

## License

The Apache License, Version 2.0. For more information, see the accompanying
LICENSE file.
