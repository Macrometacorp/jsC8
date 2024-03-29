# Getting Started

## 🆘 Macrometa Support

If you have any trouble or need help while using SDK please contact
[support@macrometa.com](mailto:support@macrometa.com).

---

## 📃 Macrometa Document Explained

One of the datastore's that Macrometa supports is **document**, a **document**
is an object that is a JSON serializable object with the following properties:

- Contains the `_key` field, which identifies the document uniquely within a
  specific collection.
- Contains the `_id` field (also called the _handle_), which identifies the
  document uniquely across all collections within a fabric. This ID is a
  combination of the collection name and the document key using the format
  `{collection}/{key}` (see example below).
- Contains the `_rev` field. GDN supports MVCC (Multiple Version Concurrency
  Control) and is capable of storing each document in multiple revisions. Latest
  revision of a document is indicated by this field. The field is populated by
  GDN and is not required as input unless you want to validate a document
  against its current revision.

Here is an example of a valid document:

```
    {
        '_id': 'students/bruce',
        '_key': 'bruce',
        '_rev': '_Wm3dzEi--_',
        'first_name': 'Bruce',
        'last_name': 'Wayne',
        'address': {
            'street' : '1007 Mountain Dr.',
            'city': 'Gotham',
            'state': 'NJ'
        },
        'is_rich': True,
        'friends': ['robin', 'gordon']
    }
```

**Edge documents (edges)** are similar to standard documents but with two
additional required fields `_from` and `_to`. Values of these fields must be the
handles of "from" and "to" vertex documents linked by the edge document in
question (see [Graph](docs/Reference/Graph/README.md) for details).

Here is an example of a valid edge document:

```
    {
        '_id': 'friends/001',
        '_key': '001',
        '_rev': '_Wm3dyle--_',
        '_from': 'students/john',
        '_to': 'students/jane',
        'closeness': 9.5
    }
```

---

## 🔐 Auth - Connect to GDN

The first step to start using GDN is establishing a connection to
[play.paas.macrometa.io](https://play.paas.macrometa.io/). When this code executes, it
initializes the server connection to your nearest region. You can access your
Macrometa GDN account using several methods, such as
[API keys](https://macrometa.com/docs/account-management/api-keys/),
[User authentication](https://macrometa.com/docs/account-management/auth/user-auth),
[Token-based authentication (JWT)](https://macrometa.com/docs/account-management/auth/jwts).

### How to create and instance of jsc8?

```js
const jsc8 = require("jsc8");
const client = new jsc8("https://play.paas.macrometa.io");
```

or to have fail-over support:

```js
const jsc8 = require("jsc8");
const client = new jsc8([
  "https://play1.paas.macrometa.io",
  "https://play2.paas.macrometa.io",
]);
```

This connection string actually represents the default value(
`"https://play.paas.macrometa.io"` ), so if this is the value you want, you can omit
url while invocation:

```js
const jsc8 = require("jsc8");
const client = new jsc8();
```

If that’s still too verbose for you, you can invoke the driver directly using
the require statement itself.

```js
const client = require("jsc8")();
```

The outcome of the three calls should be identical.

### Auth with email and password

To start working, you first have to log in. This gets the auth token and is
added in each API call. Continuing from the previous snippet, the following
statement will log you into the c8 using the provided credentials.

```js
async function login() {
  return await client.login(email, password);
}
```

Below line should print the jwt token. However, this is just for demonstrative
purposes as this token will be added to further requests. Simple client.login
should suffice for most cases.

```js
login().then(console.log);
```

To use the demotenant, we need to use client.useTenant as below:

```js
client.useTenant(tenant_name);
```

### Auth with token

If you want to log in with token then you just need to pass the token wrapping
in Object with your region URL with specific fabric.

**Note**

> Default value for fabric is `_system`

```js
const jsc8 = require("jsc8");
client = new jsc8({
  url: "https://play.paas.macrometa.io",
  token: "XXXX",
  fabricName: "_system",
});
```

or to have fail-over support:

```js
const jsc8 = require("jsc8");
client = new jsc8({
  url: ["https://play1.paas.macrometa.io", "https://play2.paas.macrometa.io"],
  token: "XXXX",
  fabricName: "_system",
});
```

### Auth with apikey

If you want to log in with apikey then you just need to pass the apikey wrapping
in Object with your region URL with specific fabric.

**Note**

> Default value for fabric is `_system`

```js
const jsc8 = require("jsc8");
client = new jsc8({
  url: "https://play.paas.macrometa.io",
  apiKey: "XXXX",
  fabricName: "_system",
});
```

or to have fail-over support:

```js
const jsc8 = require("jsc8");
client = new jsc8({
  url: ["https://play1.paas.macrometa.io", "https://play2.paas.macrometa.io"],
  apiKey: "XXXX",
  fabricName: "_system",
});
```

---

## Create Collection

We can now create collection in the client. To do this, first you connect to
`demofabric` under `demotenant` with user as `root` and password `demouserpwd`.
Then create a collection called `employees`.

The below example shows the steps.

```js
const jsc8 = require("jsc8");

const client = new jsc8({ url: "https://play.paas.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://play.paas.macrometa.io", apiKey: "XXXX" });

async function createCollection() {
  let collectionDetails;
  try {
    collectionDetails = await client.createCollection("employees");
    await console.log("The collection details are: ", collectionDetails);
  } catch (e) {
    return "Collection creation did not succeed due to " + e;
  }

  return "Collection " + collectionDetails.name + " created successfully";
}

createCollection().then(console.log);
```

### Advanced User

```js
const jsc8 = require("jsc8");
const client = new jsc8("https://play.paas.macrometa.io");

async function createCollection() {
  await console.log("Logging in...");
  await client.login(email, password);

  await console.log("Using the demotenant");
  client.useTenant(tenant_name);

  await console.log("Using the demoFabric...");
  client.useFabric("demoFabric");

  await console.log("Creating the collection object to be used...");
  let collection = client.collection("employees");

  await console.log("Creating the collection employees under demoFabric...");
  let collectionDetails;
  try {
    collectionDetails = await collection.create();
    await console.log("The collection details are: ", collectionDetails);
  } catch (e) {
    return "Collection creation did not succeed due to " + e;
  }

  return "Collection " + collectionDetails.name + " created successfully";
}

createCollection().then(console.log);
```

---

## Create Index

Let's add a hash_index called `emails` to our collection `employees`. Please
refer to user guide for details on other available index types.

```js
const jsc8 = require("jsc8");

const client = new jsc8({ url: "https://play.paas.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://play.paas.macrometa.io", apiKey: "XXXX" });

async function createIndex() {
  let index;
  try {
    index = await client.addHashIndex("employees", ["email", "_key"]);
    await console.log("The index details are: ", index);
  } catch (e) {
    return "Index creation did not succeed due to " + e;
  }

  return "Index created successfully";
}

createIndex();
```

Note:- Just like above example user can create
`addTtlIndex, addFullTextIndex, addPersistentIndex, addSkiplistIndex addGeoIndex`.
Checkout more for - [Indexes](docs/Reference/Collection/Indexes.md)

### Advanced User

```js
const jsc8 = require("jsc8");
const client = new jsc8("https://play.paas.macrometa.io");

async function createIndex() {
  await console.log("Logging in...");
  await client.login(email, password);

  await console.log("Using the demotenant");
  client.useTenant(tenant_name);

  await console.log("Using the demoFabric...");
  client.useFabric("demoFabric");

  await console.log("Creating the collection object to be used...");
  let collection = client.collection("employees");

  await console.log(
    "Creating the index on collection employees under demoFabric..."
  );
  let index;
  try {
    index = await collection.createIndex({
      type: "hash",
      fields: ["email", "_key"],
    });
    await console.log("The index details are: ", index);
  } catch (e) {
    return "Index creation did not succeed due to " + e;
  }

  return "Index created successfully";
}

createIndex().then(console.log);
```

---

## Populate Collection

Let's insert documents to the `employees` collection as shown below.

```js
const docJean = {
  _key: "Jean",
  firstname: "Jean",
  lastname: "Picard",
  email: "jean.picard@macrometa.io",
};

const docJames = {
  _key: "James",
  firstname: "James",
  lastname: "Kirk",
  email: "james.kirk@macrometa.io",
};

const docHan = {
  _key: "Han",
  firstname: "Han",
  lastname: "Solo",
  email: "han.solo@macrometa.io",
};

const docBruce = {
  _key: "Bruce",
  firstname: "Bruce",
  lastname: "Wayne",
  email: "bruce.wayne@macrometa.io",
};

const docs = [docJean, docJames, docHan, docBruce];
```

```js
const jsc8 = require("jsc8");

const client = new jsc8({ url: "https://play.paas.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://play.paas.macrometa.io", apiKey: "XXXX" });

async function populate() {
  await console.log("Creating the collection object to be used...");
  await client.insertDocumentMany("employees", docs);
  await console.log("collection populated with documents");
}

populate();
```

### Advanced User

```js
const jsc8 = require("jsc8");
const client = new jsc8("https://play.paas.macrometa.io");

async function populate() {
  await console.log("Logging in...");
  await client.login(email, password);

  await console.log("Using the demotenant");
  client.useTenant(tenant_name);

  await console.log("Using the demoFabric...");
  client.useFabric("demoFabric");

  await console.log("Creating the collection object to be used...");
  let collection = client.collection("employees");

  for (let doc of docs) {
    await collection.save(doc);
  }
  await console.log("collection populated with documents");
}

populate();
```

---

## Retrieve documents using C8QL

C8QL is C8's query language. You can execute C8QL query on our newly created
collection `employees` to get its contents.

> The query `FOR employee IN employees RETURN employee` is equivalent to SQL`s
> SELECT query.

```js
const jsc8 = require("jsc8");

const client = new jsc8({ url: "https://play.paas.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://play.paas.macrometa.io", apiKey: "XXXX" });

async function c8Queries() {
  const result = await client.executeQuery(
    "FOR employee IN employees RETURN employee"
  );
  await console.log(result);
}

c8Queries();
```

### Advanced User

```js
const jsc8 = require("jsc8");
const c8ql = jsc8.c8ql;
const client = new jsc8("https://play.paas.macrometa.io");

async function c8Queries() {
  await console.log("Logging in...");
  await client.login(email, password);

  await console.log("Using the demotenant");
  client.useTenant(tenant_name);

  await console.log("Using the demoFabric...");
  client.useFabric("demoFabric");

  await console.log("Creating the collection object to be used...");
  let collection = client.collection("employees");

  const cursor = await client.query(
    c8ql`FOR employee IN employees RETURN employee`
  );
  const result = await cursor.all();
  await console.log(result);
}

c8Queries();
```

---

## Real-time Database

Example for real-time updates from a collection in fabric:

```js
const jsc8 = require("jsc8");

const client = new jsc8({ url: "https://play.paas.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://play.paas.macrometa.io", apiKey: "XXXX" });

async function callback_fn(collectionName) {
  await console.log("Connection open on ", collectionName);
}

async function realTimeListener() {
  const collectionName = "employees";
  const listener = await client.onCollectionChange(collectionName);

  listener.on("message", msg => console.log("message=>", msg));
  listener.on("open", () => {
    callback_fn(collectionName);
  });
  listener.on("close", () => console.log("connection closed"));
}

realTimeListener();
```

---

### Advanced User

```js
const jsc8 = require("jsc8");
const client = new jsc8("https://play.paas.macrometa.io");

async function callback_fn(collection) {
  await console.log("Connection open on ", collection.name);
}

async function realTimeListener() {
  await console.log("Logging in...");
  await client.login(email, password);

  await console.log("Using the demotenant");
  client.useTenant(tenant - name);

  await console.log("Using the demoFabric...");
  client.useFabric("demoFabric");

  await console.log("Creating the collection object to be used...");
  let collection = client.collection("employees");

  const listener = await collection.onChange("play.paas.macrometa.io");

  listener.on("message", msg => console.log("message=>", msg));
  listener.on("open", () => {
    callback_fn(collection);
  });
  listener.on("close", () => console.log("connection closed"));
}

realTimeListener();
```

---

## Create Streams, Publish and Subscribe

Creating streams in C8 is a 1-step operation. The stream can be either a `local`
stream or could be a `geo-replicated` stream.

```js
const jsc8 = require("jsc8");

const client = new jsc8({ url: "https://play.paas.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://play.paas.macrometa.io", apiKey: "XXXX" });

async function streamDemo() {
  await client.createStream("newStreamFromJSC8", false);
  //Here the last boolean value tells if the stream is global or local. false means that it is global.

  const consumer = await client.createStreamReader(
    "newStreamFromJSC8",
    "my-sub"
  );
  const producer = await client.createStreamProducer("newStreamFromJSC8");

  consumer.on("message", msg => {
    const { payload, messageId } = JSON.parse(msg);
    // logging received message payload(ASCII encoded) to decode use atob()
    console.log(payload);
    // Send message acknowledgement
    consumer.send(JSON.stringify({ messageId }));
  });

  producer.on("open", () => {
    // If you message is an object, convert the obj to string.
    // e.g. const message = JSON.stringify({message:'Hello World'});
    const message = "Hello World";
    const payloadObj = { payload: Buffer.from(str).toString("base64") };
    producer.send(JSON.stringify(payloadObj));
  });
}

streamDemo();
```

### Advanced User

```js
const jsc8 = require("jsc8");
const client = new jsc8("https://play.paas.macrometa.io");

async function streamDemo() {
  await console.log("Logging in...");
  await client.login(email, password);

  await console.log("Using the demotenant");
  client.useTenant("tenant-name");

  stream = client.stream("newStreamFromJSC8", false);
  //Here the last boolean value tells if the stream is local or global. false means that it is global.(DEFAULT: false)

  await stream.createStream();

  const consumerOTP = await stream.getOtp(); // OTP expiry 10s
  const consumer = stream.consumer("my-sub", "play.paas.macrometa.io", {
    otp: consumerOTP,
  });

  const producerOTP = await stream.getOtp(); // OTP expiry 10s
  const producer = stream.producer("play.paas.macrometa.io", { otp: producerOTP });

  consumer.on("message", msg => {
    const { payload, messageId } = JSON.parse(msg);
    // logging received message payload(ASCII encoded) to decode use atob()
    console.log(payload);
    // Send message acknowledgement
    consumer.send(JSON.stringify({ messageId }));
  });

  producer.on("open", () => {
    // If you message is an object, convert the obj to string.
    // e.g. const message = JSON.stringify({message:'Hello World'});
    const message = "Hello World";
    const payloadObj = { payload: Buffer.from(str).toString("base64") };
    producer.send(JSON.stringify(payloadObj));
  });
}

streamDemo();
```

---

## RESTQL Example

On using a geo-distributed database as backend as service eliminating the need
for separate backend servers & containers.

```js
const jsc8 = require("jsc8");

//Variables
const fed_url = "https://play.paas.macrometa.io";
const collection_name =
  "addresses" + Math.floor(1000 + Math.random() * 9000).toString();

//Queries
const insert_data =
  "INSERT {'firstname':@firstname, 'lastname':@lastname, 'email':@email, 'zipcode':@zipcode, '_key': 'abc'} IN " +
  collection_name;

const get_data = "FOR doc IN " + collection_name + " RETURN doc";

const update_data =
  "UPDATE 'abc' WITH {'lastname': @lastname } IN " + collection_name;

const delete_data = "REMOVE 'abc' IN " + collection_name;

const get_count = "RETURN COUNT(FOR doc IN " + collection_name + " RETURN 1)";

const client = new jsc8({ url: "https://play.paas.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://play.paas.macrometa.io", apiKey: "XXXX" });

async function restqldemo() {
  console.log("------- CREATE GEO-REPLICATED COLLECTION  ------");
  await client.createCollection(collection_name);
  console.log("Collection " + collection_name + " created.\n");

  console.log("------- CREATE THE QUERIES  ------");

  await client.createRestql("insertData", insert_data, {});

  await client.createRestql("getData", get_data, {});
  await client.createRestql("updateData", update_data, {});

  await client.createRestql("deleteData", delete_data, {});

  await client.createRestql("getCount", get_count, {});

  console.log("Queries CREATED Successfully\n");

  console.log("------- EXECUTING THE QUERIES  ------");

  bindVars = {
    firstname: "john",
    lastname: "doe",
    email: "john.doe@macrometa.io",
    zipcode: "511037",
  };

  await client.executeRestql("insertData", bindVars);
  console.log("Data Inserted \n");

  const res = await client.executeRestql("getData");
  console.log("Output of get data query:");
  console.log(res.result);
  console.log("\n");

  await client.executeRestql("updateData", { lastname: "mathews" });
  console.log("Data updated \n");

  const data = await client.executeRestql("getData");
  console.log("Output of get data query after update:");
  console.log(data.result);
  console.log("\n");

  const count = await client.executeRestql("getCount");
  console.log("Count:");
  console.log(count.result);
  await client.executeRestql("deleteData");
}

restqldemo().then(console.log("Starting Execution"));
```

### Advanced User

```js
const jsc8 = require("jsc8");

//Variables
const fed_url = "https://play.paas.macrometa.io";
const guest_tenant_email = "guest@macrometa.io";
const guest_tenant = "guest";
const guest_password = "guest5";
const guest_user = "guest5";
const geo_fabric = "guest5";
const collection_name =
  "addresses" + Math.floor(1000 + Math.random() * 9000).toString();

//Queries
const insert_data =
  "INSERT {'firstname':@firstname, 'lastname':@lastname, 'email':@email, 'zipcode':@zipcode, '_key': 'abc'} IN " +
  collection_name;

const get_data = "FOR doc IN " + collection_name + " RETURN doc";

const update_data =
  "UPDATE 'abc' WITH {'lastname': @lastname } IN " + collection_name;

const delete_data = "REMOVE 'abc' IN " + collection_name;

const get_count = "RETURN COUNT(FOR doc IN " + collection_name + " RETURN 1)";

const client = new jsc8(fed_url);

async function restqldemo() {
  await client.login(guest_tenant_email, guest_password);
  client.useTenant(guest_tenant);
  client.useFabric(geo_fabric);
  console.log("------- CREATE GEO-REPLICATED COLLECTION  ------");
  const collection = client.collection(collection_name);
  await collection.create();
  console.log("Collection " + collection_name + " created.\n");

  console.log("------- SAVING THE QUERIES  ------");

  await client.saveQuery("insertData", {}, insert_data);

  await client.saveQuery("getData", {}, get_data);
  await client.saveQuery("updateData", {}, update_data);

  await client.saveQuery("deleteData", {}, delete_data);

  await client.saveQuery("getCount", {}, get_count);

  console.log("Saved Queries Successfully\n");

  console.log("------- EXECUTING THE QUERIES  ------");

  bindVars = {
    firstname: "john",
    lastname: "doe",
    email: "john.doe@macrometa.io",
    zipcode: "511037",
  };

  await client.executeSavedQuery("insertData", bindVars);
  console.log("Data Inserted \n");

  const res = await client.executeSavedQuery("getData");
  console.log("Output of get data query:");
  console.log(res.result);
  console.log("\n");

  await client.executeSavedQuery("updateData", { lastname: "mathews" });
  console.log("Data updated \n");

  const data = await client.executeSavedQuery("getData");
  console.log("Output of get data query after update:");
  console.log(data.result);
  console.log("\n");

  const count = await client.executeSavedQuery("getCount");
  console.log("Count:");
  console.log(count.result);
  await client.executeSavedQuery("deleteData");
}

restqldemo().then(console.log("Starting Execution"));
```

---

## Create Geo-Fabric

Let's create geo-fabric called `demofabric` by passing a parameter called
`dclist`. The fabric `demofabric` is created in all the regions specified in the
`dclist`.

```js
const jsc8 = require("jsc8");

const client = new jsc8({ url: "https://play.paas.macrometa.io", token: "XXXX" });
//---- OR ----
const client = new jsc8({ url: "https://play.paas.macrometa.io", apiKey: "XXXX" });

async function createFabric() {
  try {
    await console.log("Creating the client...");
    let result = await client.createFabric(
      "demoFabric",
      [{ username: "root" }],
      { dcList: "try-asia-south1,try-us-east4,try-us-west2" }
    );

    await console.log("result is: ", result);

    await console.log(
      "Listing the fabrics to verify that demoFabric has been created"
    );
    const res = await client.listFabrics();

    await console.log(res);
  } catch (e) {
    await console.log("Fabric could not be created due to " + e);
  }
}

createFabric();
```

---

## Get GeoFabric Details

To get details of `fabric` geo-fabric

```js
const jsc8 = require("jsc8");

const client = new jsc8({
  url: "https://play.paas.macrometa.io",
  token: "XXXX",
  fabricName: "_system",
});
//---- OR ----
const client = new jsc8({
  url: "https://play.paas.macrometa.io",
  apiKey: "XXXX",
  fabricName: "_system",
});

async function getFabric() {
  try {
    await console.log("Getting the fabric details...");
    let result = await client.get();

    await console.log("result is: ", result);
  } catch (e) {
    await console.log("Fabric details could not be fetched because " + e);
  }
}

getFabric();
```
