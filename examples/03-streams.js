//REPL link: https://repl.it/repls/GiganticScalyGlobalarrays
_ = require('lodash')
Fabric = require('jsc8')
fabric = new Fabric("https://try.macrometa.io")

const fed_url = "https://try.macrometa.io"
const guest_email = "guest2@macrometa.io"
const guest_password = "guest2"
const geo_fabric = "guest2"
let collection

async function setup(){
  await console.log("Logging in...");
  await fabric.login(guest_email, guest_password);

  await console.log("Using the fabric: " + geo_fabric);
  fabric.useFabric(geo_fabric);

}

async function getDCList(){
  let dcListAll = await fabric.listUserFabrics()
  let dcListObject = await _.find(dcListAll, function(o) { return o.name === geo_fabric; });
  return dcListObject.options.dcList.split(",")
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function publish(stream, msg){
  await stream.producer(msg, "try.macrometa.io");
}


async function publishAll(stream){
  await console.log("\n ------- PUBLISH MESSAGES  ------")
  await console.log("Publish 10 messages to stream")
  for (let i=0; i<10; i++){
    let msg = "Hello from  user--" + "(" + i + ")"
    await publish(stream, msg)
  }
}

async function receive(stream){
    await stream.consumer("my-sub", { 
      onmessage:(msg)=>{ 
        console.log(msg) 
      },
      onopen: () => publishAll(stream)
    }, "try.macrometa.io");
  
}

(async function() {
  await setup();
  const dcList = await getDCList()
  await console.log("dcList: ", dcList)
  const stream = fabric.stream("testStream", false);
  //Here the last boolean value tells if the stream is local or global. false means that it is global.

  await stream.createStream();

  await receive(stream)

})();