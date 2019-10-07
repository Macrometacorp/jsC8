// REPL link https://repl.it/repls/IckyDefenselessAutomatedinformationsystem

_ = require('lodash')
Fabric = require('jsc8')
fabric = new Fabric("https://try.macrometa.io")

const fed_url = "https://try.macrometa.io"
const guest_email = "guest2@macrometa.io"
const guest_password = "guest2"
const geo_fabric = "guest2"

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const collection_name = "employees" + getRandomInt(10000).toString()

async function createCollection() {
  await console.log("Logging in...");
  await fabric.login(guest_email, guest_password);

  await console.log("Using the geo fabric: ", geo_fabric);
  fabric.useFabric(geo_fabric);

  await console.log("Creating the collection object to be used...");
  await console.log(collection_name)
  let collection = fabric.collection(collection_name);

  await console.log("Creating the collection: ");
  let collectionDetails;
  try{
    collectionDetails = await collection.create({isSpot: false}); 
    //await console.log("The collection details are: ", collectionDetails);
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
    await console.log("doc: ", doc)
    collection.save(doc)
  }
}

async function registerCallbackFn(){
  let collection = fabric.collection(collection_name);

  collection.onChange({
      onmessage: (msg) => console.log("message=>", msg),
      onclose: () => console.log("connection closed")
    }, "try.macrometa.io");
}

let docs = [
        {'_key':'John', 'firstname': 'John', 'lastname':'Wayne', 'email':'john.wayne@macrometa.io'},
        {'_key':'Clark', 'firstname': 'Clark', 'lastname':'Kent', 'email':'clark.kent@macrometa.io'},
        {'_key': 'Bruce', 'firstname': 'Bruce', 'lastname':'Wayne', 'email':'bruce.wayne@macrometa.io'}
    ];

(async function() {
  await createCollection();
  const dcList = await getDCList()
  await console.log("dcList: ", dcList)
  
  await registerCallbackFn()
  await insertData(docs)
})();