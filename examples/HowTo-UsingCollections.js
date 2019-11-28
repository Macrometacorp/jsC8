'use strict'
const jsc8 = require('jsc8')

// Variables
const client = new jsc8("https://gdn1.macrometa.io")
const guest_password = "guest1"
const geo_fabric = "guest1"
const guest_email = "guest1@macrometa.io"

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const collection_name = "person" + getRandomInt(10000).toString()

async function createCollection() {
  console.log("Logging in...");

  await client.login(guest_email, guest_password);

  console.log("Using the demoFabric...");

  client.useFabric(geo_fabric);

  console.log("Creating the collection object to be used...");

  console.log(collection_name)

  let collection = client.collection(collection_name);

  console.log("Creating the collection ...");

  let collectionDetails;
  try {

    collectionDetails = await collection.create({ isSpot: false });
    console.log("The collection details are: ", collectionDetails);

  } catch (e) {
    console.log("Collection creation did not succeed due to " + e)
  }

  console.log("Collection " + collectionDetails.name + " created successfully")
}

async function getDCList() {
  let dcListAll = await client.listUserFabrics()
  let dcListObject = await dcListAll.find(function(o) { return o.name === geo_fabric; });
  return dcListObject.options.dcList.split(",")
}

async function insertData(docs) {
  const collection = client.collection(collection_name);
  for (let doc of docs) {
    collection.save(doc)
  }
}

async function readData(regions) {
  const c8ql = jsc8.c8ql
  for (let region of regions) {
    try {
      const newFabric = new jsc8("https://" + region + ".prod.macrometa.io")
      await newFabric.login(guest_email, guest_password);
      newFabric.useFabric(geo_fabric);

      const cursor = await newFabric.query(c8ql(["FOR doc in " + collection_name + " RETURN doc"]));
      const result = await cursor.all();
      await console.log(result)
    } catch (e) {
      console.log(`!!! Something went wrong while fetching data for region: ${region}`)
    }
  }

}

const docs = [
  { "firstname": "Peter", "lastname": "Parker", "City": "NewYork" },
  { "firstname": "Bruce", "lastname": "Wayne", "City": "Gotham" },
  { "firstname": "Clark", "lastname": "Kent", "City": "Manhatten" },
  { "firstname": "Ned", "lastname": "Stark", "City": "Winterfell" },
  { "firstname": "Tywin", "lastname": "Lannister", "City": "Kings Landing" }
];

(async function() {
  await createCollection();
  const dcList = await getDCList()
  await console.log("dcList: ", dcList)
  await insertData(docs)
  await readData(dcList)
})();