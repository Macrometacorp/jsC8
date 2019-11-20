//REPL Link: https://repl.it/repls/TrueJadedCurrencies
_ = require('lodash')
Fabric = require('jsc8')
fabric = new Fabric("https://gdn1.macrometa.io")

const fed_url = "https://gdn1.macrometa.io"
const guest_password = "guest2"
const geo_fabric = "guest2"
const guest_email = "guest2@macrometa.io"

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const collection_name = "person" + getRandomInt(10000).toString()


async function createCollection() {
  await console.log("Logging in...");
  await fabric.login(guest_email, guest_password);

  await console.log("Using the demoFabric...");
  fabric.useFabric(geo_fabric);

  await console.log("Creating the collection object to be used...");
  await console.log(collection_name)
  let collection = fabric.collection(collection_name);

  await console.log("Creating the collection under demoFabric...");
  let collectionDetails;
  try{
    collectionDetails = await collection.create({isSpot: false}); 
    await console.log("The collection details are: ", collectionDetails);
  } catch(e){
    await console.log("Collection creation did not succeed due to " + e)
  }

  await console.log("Collection " + collectionDetails.name + " created successfully")
}

async function getDCList(){
  let dcListAll = await fabric.listUserFabrics()
  let dcListObject = await _.find(dcListAll, function(o) { return o.name === geo_fabric; });
  return dcListObject.options.dcList.split(",")
}

async function insertData(docs){
  
  const collection = fabric.collection(collection_name);
  for (let doc of docs) {
    collection.save(doc)
  }
}

async function readData(regions){
  let c8ql = Fabric.c8ql
  for (let region of regions){
    const newFabric = new Fabric("https://"+ region +".macrometa.io")
    await newFabric.login(guest_email, guest_password);
    newFabric.useFabric(geo_fabric);

    const cursor = await newFabric.query(c8ql(["FOR doc in "+ collection_name + " RETURN doc"]));
    const result = await cursor.all();
    await console.log(result)
  }
  
}

let docs = [
        {"firstname": "Peter", "lastname": "Parker", "City": "NewYork"},
        {"firstname": "Bruce", "lastname": "Wayne", "City": "Gotham"},
        {"firstname": "Clark", "lastname": "Kent", "City": "Manhatten"},
        {"firstname": "Ned", "lastname": "Stark", "City": "Winterfell"},
        {"firstname": "Tywin", "lastname": "Lannister", "City": "Kings Landing"}
    ];

(async function() {
  await createCollection();
  const dcList = await getDCList()
  await console.log("dcList: ", dcList)
  await insertData(docs)
  await readData(dcList)
})();