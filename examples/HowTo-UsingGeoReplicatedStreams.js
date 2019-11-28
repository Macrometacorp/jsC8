const jsc8 = require('jsc8')

const fed_url = "https://gdn1.macrometa.io"
const guest_email = "guest1@macrometa.io"
const guest_password = "guest1"
const geo_fabric = "guest1"
const client = new jsc8(fed_url)

const msgs = ["message 1", "message 2", "message 3"]
let numberOfMessages = 0

async function setup() {
  await console.log("Logging in...");
  await client.login(guest_email, guest_password);
  await console.log("Using the fabric: " + geo_fabric);
  client.useFabric(geo_fabric);
}

async function getDCList() {
  let dcListAll = await client.listUserFabrics()
  let dcListObject = await dcListAll.find(function(o) { return o.name === geo_fabric; });
  return dcListObject.options.dcList.split(",")
}


async function publish(stream) {
  console.log("\n ------- PUBLISH MESSAGES  ------")

  await stream.producer(msgs, "gdn1.macrometa.io");
}

async function receive(stream) {
  return new Promise(resolve =>
    stream.consumer("my-sub", {
      onmessage: (msg) => {
        const parsedMsg = JSON.parse(msg);
        const { payload } = parsedMsg;


        if (msgs.includes(Buffer.from(payload, 'base64').toString())) {
          numberOfMessages++;
        };

        if (numberOfMessages === msgs.length) {
          stream.closeConnections();
        }
      },
      onopen: () => {
        console.log('consumer connection is open');
        resolve();
      }
    }, "gdn1.macrometa.io")
  );
}

(async function() {
  await setup();
  const dcList = await getDCList()
  await console.log("dcList: ", dcList)
  const stream = client.stream("testStream", false);
  //Here the last boolean value tells if the stream is local or global. false means that it is global.


  await stream.createStream();

  // publishing streams
  await receive(stream)

  await publish(stream)

})();