'use strict'

const jsc8 = require('jsc8')

const client = new jsc8("https://gdn1.macrometa.io")
const guest_password = "guest1"
const geo_fabric = "guest1"
const guest_email = "guest1@macrometa.io"

let collection = null

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const collection_name = "person" + getRandomInt(10000).toString()

async function createCollection() {
  console.log("Logging in...");

  await client.login(guest_email, guest_password);

  console.log("Using the geofabric...");
  client.useFabric(geo_fabric);

  console.log("Creating the collection object to be used...");

  console.log(collection_name)

  collection = client.collection(collection_name);

  console.log("Creating the collection ...");

  let collectionDetails;
  try {
    collectionDetails = await collection.create({ isSpot: false });
    await console.log("The collection details are: ", collectionDetails);

    console.log("Collection " + collectionDetails.name + " created successfully")

    // adding a onChange listner for collection
    collection.onChange({
      onmessage: (msg) => console.log("message =>", msg),
      onopen: () => {
        console.log("Collection " + collectionDetails.name + " opened successfully")
      },
      onclose: () => console.log("connection closed")
    }, "gdn1.macrometa.io");

  } catch (e) {
    await console.log("Collection creation did not succeed due to " + e)
  }

}
const sleep = m => new Promise(r => setTimeout(r, m))

async function insertData(docs) {
  await sleep(3000);
  collection.save(docs[0])

  await sleep(3000);
  collection.save(docs[1])

  await sleep(3000);
  collection.save(docs[2])

  await sleep(3000);
  collection.closeOnChangeConnection()
}

let docs = [
  { "firstname": "Peter", "lastname": "Parker", "City": "NewYork" },
  { "firstname": "Bruce", "lastname": "Wayne", "City": "Gotham" },
  { "firstname": "Clark", "lastname": "Kent", "City": "Manhatten" },
];

(async function() {
  await createCollection();
  await insertData(docs)
})();