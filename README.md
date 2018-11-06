# C8 JavaScript Driver

The official C8 low-level JavaScript client.

## Install

### With Yarn or NPM

```sh
yarn add jsc8
## - or -
npm install --save jsc8
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
import { Fabric, c8ql } from "jsc8";
const fabric = new Fabric();
(async function() {
  const now = Date.now();
  try {
    const cursor = await fabric.query(c8ql`RETURN ${now}`);
    const result = await cursor.next();
    // ...
  } catch (err) {
    // ...
  }
})();

// or plain old Node-style
var jsC8 = require("jsc8");
var fabric = new jsC8.Fabric();
var now = Date.now();
fabric.query({
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

[Latest Documentation](https://github.com/Macrometacorp/jsC8/tree/master/docs/Drivers/JS)

## Testing

Run the tests using the `yarn test` or `npm test` commands:

```sh
yarn test
# - or -
npm test
```

By default the tests will be run against a server listening on
`https://localhost` (using username `root` with no password). To
override this, you can set the environment variable `TEST_C8_URL` to
something different:

```sh
TEST_C8_URL=https://myfabric.macrometa.io yarn test
# - or -
TEST_C8_URL=https://myfabric.macrometa.io npm test
```

## License

The Apache License, Version 2.0. For more information, see the accompanying
LICENSE file.
