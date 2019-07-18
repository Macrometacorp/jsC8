//REPL link: https://repl.it/repls/FortunateSardonicComputer


_ = require('lodash')
Fabric = require('jsc8')
fabric = new Fabric("https://try.macrometa.io")

const fed_url = "https://try.macrometa.io"
const guest_tenant = "guest2"
const guest_password = "guest2"
const guest_user = "guest2"
const geo_fabric = "guest2"

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const collection_name = "person" + getRandomInt(10000).toString()

let docs = [
        {"firstname": "Peter", "lastname": "Parker", "City": "NewYork"},
        {"firstname": "Bruce", "lastname": "Wayne", "City": "Gotham"},
        {"firstname": "Clark", "lastname": "Kent", "City": "Manhatten"},
        {"firstname": "Ned", "lastname": "Stark", "City": "Winterfell"},
        {"firstname": "Tywin", "lastname": "Lannister", "City": "Kings Landing"},
        {"firstname": "Al", "lastname": "Simmons", "City": "SanJose"},
        {"firstname": "Wade", "lastname": "Wilson", "City": "NewYork"},
        {"firstname": "Jenny", "lastname": "Sparks", "City": "SanFrancisco"}
    ];


async function createCollection() {
  await console.log("Logging in...");
  await fabric.login(guest_tenant, guest_user, guest_password);

  await console.log("Using the demotenant");
  fabric.useTenant(guest_tenant)

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

async function insertData(regions, docs){
  let fabrics = []
  for (let i=0; i<regions.length ; i++){
    fabrics[i] = new Fabric("https://"+ regions[i] +".macrometa.io")
  }
  
  for (let doc of docs) {
    
    let randomIdx = getRandomInt(regions.length - 1);
    await fabrics[randomIdx].login(guest_tenant, guest_user, guest_password);

    fabrics[randomIdx].useTenant(guest_tenant)
    fabrics[randomIdx].useFabric(geo_fabric);
    const collection = await fabrics[randomIdx].collection(collection_name);
    collection.save(doc)
  }
}

async function readData(regions){
  let c8ql = Fabric.c8ql
  for (let region of regions){
    const newFabric = new Fabric("https://"+ region +".macrometa.io")
    await newFabric.login(guest_tenant, guest_user, guest_password);

    newFabric.useTenant(guest_tenant)
    newFabric.useFabric(geo_fabric);

    const cursor = await newFabric.query(c8ql(["FOR doc in "+ collection_name + " RETURN doc"]));
    const result = await cursor.all();
    await console.log(result)
  }
  
}

(async function() {
  await createCollection();
  const dcList = await getDCList()
  await console.log("dcList: ", dcList)
  
  await insertData(dcList, docs)

  await readData(dcList)
  
})();
