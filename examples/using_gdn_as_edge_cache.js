// Repl.it Link: https://repl.it/@durgaMacrometa/HowTo-UsingGDNasEdgeCache-js

Fabric = require('jsc8')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xmlHttp = new XMLHttpRequest();

// Define URLs
const fed_url = "https://gdn1.macrometa.io"
const fed_url_west = "https://gdn1-sfo2.prod.macrometa.io"
const fed_url_eastcoast = "https://gdn1-nyc1.prod.macrometa.io"
const fed_url_europe = "https://gdn1-fra1.prod.macrometa.io"
const fed_url_asia = "https://gdn1-blr1.prod.macrometa.io"

// Variables
const guest_password = "guest1"
const geo_fabric = "guest1"
const guest_email = "guest1@macrometa.io"
const keys = ["dogs", "cats", "birds", "books", "business", "trees", "forests", "lakes"]

//---------------------------------------------------------------
// Cache class to utilize GDN for serving data from edge
//--------------------------------------------------------------
class Cache {
  // Create a collection in GDN (if not exists) to act as Cache
  constructor(fabric) {
    this.fabric = fabric;
    (async () => {
      this.cache =  fabric.collection('cache');
      const result = await this.cache.exists();
      if (!result) {
        await fabric.collection('cache');
      }
    })();

  }
  // Read from cache.
  async get(key) {
    try {
      const handle = await this.cache.document(key);
      return handle
    }
    catch{
      return null

    }
  }
  // Write to cache. The writes are automatically geo replicated.
  async set(key, doc, ttl = 0) {
    let res = await this.cache.documentExists(key)
    if (res) {
      //const docHandle = this.cache.document(key)
      await this.cache.replace(key, doc)
    }
    else {
      await this.cache.save(doc)
    }
    return true;
  }
  // Purge the cache. The purge is automatically geo replicated.
  async purge(keys) {
    try {
      for (let key of keys) {
            await this.cache.remove(key)
        }
    }catch{
      return false;
    }
    return true;
  }
}

//---------------------------------------------------------
// Code to Read & Write from Origin (i.e., from Cloud)
//----------------------------------------------------------
// Read from Origin
function get_from_origin_db(key) {
  let document = {}
  const url = "https://openlibrary.org/subjects/" + key + ".json?limit=0"

  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send()
  r = xmlHttp.responseText;
  document = JSON.parse(r)
  document["_key"] = key
  return document
}
// Write to Origin
function write_to_origin_db(document) {
  // Write to Origin DB
  console.log("writing to origin database..")
  return true;
}

//------------------------------------------
// Utilize GDN as edge cache for serving reads & writes. Following is the behavior of the main() method:
// 1. For First time reads, 
//       Gets data from OriginDB. Populates GDN transparently.
// 2. For subsequent reads from same region,
//       Serves data from the GDN directly.
// 3. For subsequent reads from other regions,
//       Serves data from the GDN directly. 
// 4. For writes, 
//       Invalidates the Cache globally in realtime
//       Writes to Origin
//       Updates the Cache globally in realtime.
// 5. For subsequent reads from other regions,
//       Serves data from the GDN directly. 
//------------------------------------------
async function main() {

  // Login to GDN and Create cache (if not exists)
  fabric = new Fabric(fed_url)
  await fabric.login(guest_email, guest_password)
  await fabric.useFabric(geo_fabric)
  const cache = new Cache(fabric)

  //Clean Cache from previous runs
  await cache.purge(keys);

  // Use Macrometa GDN as Cache for Remote Origin Database
  console.log("----------------------\n1. First time access:\n----------------------")

  var before = Date.now();
  for (let key of keys) {
    doc = await cache.get(key)
    if (doc == null) {
      console.log("CACHE_MISS: get from remote origin database...")
      doc = await get_from_origin_db(key)
      cache.set(key, doc)
    }
    else {
      console.log("CACHE_HIT: get from closest region cache...")
    }

  }
  console.log("\n------- Execution Time: " + (Date.now()-before) + "ms  (from Origin) -------\n")

  // 2nd time access served from GDN edge cache.
  console.log("----------------------\n2. Second time access:\n----------------------")
  before = Date.now();
  for (key of keys) {
    doc = await cache.get(key)
    if (doc == null) {
      console.log("CACHE_MISS: get from remote origin database...")
      doc = get_from_origin_db(key)
      cache.set(key, doc)
    }
    else {
      console.log("CACHE_HIT: get from closest region cache...")
    }
  }
   console.log("\n------- Execution Time: " + (Date.now()-before) + "ms  (from Closest Cache)-------\n")

  // GDN Cache Geo replication in action... US West Coast
  console.log("------------------------------\n3a. Access from US_WEST_COAST:\n------------------------------")
  fabric = new Fabric(fed_url_west)
  await fabric.login(guest_email, guest_password)
  await fabric.useFabric(geo_fabric)
  cache3a = new Cache(fabric)

  var before = Date.now();
  for (key of keys) {
    doc = await cache3a.get(key)
    if (doc == null) {
      console.log("CACHE_MISS: get from remote origin database...")
      doc = get_from_origin_db(key)
      cache3a.set(key, doc)
    }
    else {
      console.log("CACHE_HIT: doc_id:" + doc._id)
    }
  }
  console.log("\n------- Execution Time: " + (Date.now()-before) + "ms  (from US_WEST_COAST Cache) -------\n")


  // GDN Cache Geo replication in action... US East Coast
  console.log("------------------------------\n3b. Access from US_EAST_COAST:\n------------------------------")
  fabric = new Fabric(fed_url_eastcoast)
  await fabric.login(guest_email, guest_password)
  await fabric.useFabric(geo_fabric)
  cache3b = new Cache(fabric)

  var before = Date.now();
  for (key of keys) {
    doc = await cache3b.get(key)
    if (doc == null) {
      console.log("CACHE_MISS: get from remote origin database...")
      doc = get_from_origin_db(key)
      cache3b.set(key, doc)
    }
    else {
      console.log("CACHE_HIT: doc_id:" + doc._id)
    }
  }
  console.log("\n------- Execution Time: " + (Date.now()-before) + "ms (from US_EAST_COAST Cache) -------\n")

  // GDN Cache Geo replication in action... Europe
  console.log("------------------------------\n3c. Access from EUROPE:\n------------------------------")
  fabric = new Fabric(fed_url_europe)
  await fabric.login(guest_email, guest_password)
  await fabric.useFabric(geo_fabric)
  cache3c = new Cache(fabric)

  var before = Date.now();
  for (key of keys) {
    doc = await cache3c.get(key)
    if (doc == null) {
      console.log("CACHE_MISS: get from remote origin database...")
      doc = get_from_origin_db(key)
      cache3c.set(key, doc)
    }
    else {
      console.log("CACHE_HIT: doc_id:" + doc._id)
    }
  }
  console.log("\n------- Execution Time: " + (Date.now()-before) + "ms  (from EUROPE Cache)-------\n")

  // GDN Cache Geo replication in action... Asia
  console.log("------------------------------\n3c. Access from ASIA:\n------------------------------")
  fabric = new Fabric(fed_url_asia)
  await fabric.login(guest_email, guest_password)
  await fabric.useFabric(geo_fabric)
  cache3d = new Cache(fabric)

  var before = Date.now();
  for (key of keys) {
    doc = await cache3d.get(key)
    if (doc == null) {
      console.log("CACHE_MISS: get from remote origin database...")
      doc = get_from_origin_db(key)
      cache3d.set(key, doc)
    }
    else {
      console.log("CACHE_HIT: doc_id:" + doc._id)
    }
  }
  console.log("\n------- Execution Time: " + (Date.now()-before) + "ms  (from ASIA Cache)-------\n")

  // Invalidate & update cache globally on writes. 
  console.log("------------------------------\n4. Writes from Edge to origin and global cache update: \n------------------------------")
  for (key of keys) {
    doc = await cache.get(key)
    doc["company"] = "macrometa"
    write_to_origin_db(doc)
    cache.set(key, doc)
  }

  console.log("------------------------------\n5. After writes... Access from EUROPE:\n------------------------------")
  for (key of keys) {
    doc = await cache3b.get(key)
    if (doc == null) {
      console.log("CACHE_MISS: get from remote origin database...")
      doc = get_from_origin_db(key)
      cache3b.set(key, doc)
    }
    else {
      console.log("CACHE_HIT: \ndoc:" + JSON.stringify(doc))
    }

  }
}

// Call main method. Starting point for the program.
main()
