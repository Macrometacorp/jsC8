'use strict'
const jsc8 = require('jsc8')

//Variables
const client = new jsc8("https://gdn1.macrometa.io")
const guest_email = "guest1@macrometa.io"
const guest_password = "guest1"
const geo_fabric = "testfabric"
const collection_name = "addresses" + Math.floor(1000 + Math.random() * 9000).toString()

//Queries
const insert_data = "INSERT {'firstname':@firstname, 'lastname':@lastname, 'email':@email, 'zipcode':@zipcode, '_key': 'abc'} IN " + collection_name

const get_data = "FOR doc IN " + collection_name + " RETURN doc"

const update_data = "UPDATE 'abc' WITH {'lastname': @lastname } IN " + collection_name

const delete_data = "REMOVE 'abc' IN " + collection_name

const get_count = "RETURN COUNT(FOR doc IN " + collection_name + " RETURN 1)"


async function restqldemo() {
  await client.login(guest_email, guest_password);

  client.useFabric(geo_fabric);

  console.log("------- CREATE GEO-REPLICATED COLLECTION  ------")

  const collection = client.collection(collection_name);

  await collection.create()

  console.log("Collection " + collection_name + " created.\n")

  console.log("------- SAVING THE QUERIES  ------")

  await client.saveQuery("insertData", {}, insert_data)
  await client.saveQuery("getData", {}, get_data)
  await client.saveQuery("updateData", {}, update_data)
  await client.saveQuery("deleteData", {}, delete_data)
  await client.saveQuery("getCount", {}, get_count)

  console.log("Saved Queries Successfully\n")

  console.log("------- EXECUTING THE QUERIES  ------")

  const bindVars = {
    "firstname": "john", "lastname": "doe",
    "email": "john.doe@macrometa.io", "zipcode": "511037"
  }

  await client.executeSavedQuery("insertData", bindVars)

  console.log("Data Inserted \n")

  const res = await client.executeSavedQuery("getData")

  console.log("Output of get data query:")
  console.log(res.result)
  console.log("\n")

  await client.executeSavedQuery("updateData", { "lastname": "mathews" })

  console.log("Data updated \n")

  const data = await client.executeSavedQuery("getData")

  console.log("Output of get data query after update:")

  console.log(data.result)

  console.log("\n")

  const count = await client.executeSavedQuery("getCount")

  console.log("Count:")

  console.log(count.result)

  await client.executeSavedQuery("deleteData")
}

restqldemo().then(console.log("Starting Execution"))