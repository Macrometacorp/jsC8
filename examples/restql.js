//REPL link: https://repl.it/@durgaMacrometa/HowTo-UsingRestQLJS

Fabric = require('jsc8')

//Variables
fed_url = "gdn1.macrometa.io"
guest_email = "guest2@macrometa.io"
guest_password = "guest2"
geo_fabric = "guest2"
collection_name = "addresses" + Math.floor(1000 + Math.random() * 9000).toString()

//Queries
insert_data = "INSERT {'firstname':@firstname, 'lastname':@lastname, 'email':@email, 'zipcode':@zipcode, '_key': 'abc'} IN " + collection_name

get_data = "FOR doc IN " + collection_name + " RETURN doc"

update_data = "UPDATE 'abc' WITH {'lastname': @lastname } IN " + collection_name

delete_data = "REMOVE 'abc' IN " + collection_name

get_count = "RETURN COUNT(FOR doc IN " + collection_name + " RETURN 1)"

fabric = new Fabric("https://gdn1.macrometa.io")


async function restqldemo() {
  await fabric.login(guest_email, guest_password);
  fabric.useFabric(geo_fabric);
  console.log("------- CREATE GEO-REPLICATED COLLECTION  ------")
  const collection = fabric.collection(collection_name);
  await collection.create()
  console.log("Collection " + collection_name + " created.\n")

  console.log("------- SAVING THE QUERIES  ------")

  await fabric.saveQuery("insertData", {}, insert_data)

  await fabric.saveQuery("getData", {}, get_data)
  await fabric.saveQuery("updateData", {}, update_data)

  await fabric.saveQuery("deleteData", {}, delete_data)

  await fabric.saveQuery("getCount", {}, get_count)

  console.log("Saved Queries Successfully\n")

  console.log("------- EXECUTING THE QUERIES  ------")

  bindVars = {
    "firstname": "john", "lastname": "doe",
    "email": "john.doe@macrometa.io", "zipcode": "511037"
  }

  await fabric.executeSavedQuery("insertData", bindVars)
  console.log("Data Inserted \n")

  const res = await fabric.executeSavedQuery("getData")
  console.log("Output of get data query:")
  console.log(res.result)
  console.log("\n")

  await fabric.executeSavedQuery("updateData", { "lastname": "mathews" })
  console.log("Data updated \n")

  const data = await fabric.executeSavedQuery("getData")
  console.log("Output of get data query after update:")
  console.log(data.result)
  console.log("\n")

  const count = await fabric.executeSavedQuery("getCount")
  console.log("Count:")
  console.log(count.result)
  await fabric.executeSavedQuery("deleteData")

}

restqldemo().then(console.log("Starting Execution"))
