import { expect } from "chai";
import { Fabric } from "../jsC8";
import { Stream } from "../stream";

describe("Manipulating streams", function() {
  // create fabric takes 11s in a standard cluster
  this.timeout(50000);

  let fabric: Fabric;
  const testUrl: string =
    process.env.TEST_C8_URL || "https://test.macrometa.io";

  before(async () => {
    fabric = new Fabric({
      url: testUrl,
      c8Version: Number(process.env.C8_VERSION || 30400)
    });
    await fabric.login("guest@macrometa.io", "guest");
    fabric.useTenant("guest");
  });

  after(() => {
    fabric.close();
  });

  describe("fabric.stream", () => {
    it("returns a new Stream instance", () => {
      expect(fabric.stream("testStream", true)).to.be.instanceof(Stream);
    });
    it("gets all streams", async () => {
      const response = await fabric.getStreams();
      expect(response.error).to.be.false;
    });
    it("clears backlog", async () => {
      const response = await fabric.clearBacklog();
      expect(response.error).to.be.false;
    });
    it("clears subscription backlog");
    it("unsubscribes to a subscription");
  });

  describe("stream.create", () => {
    describe("persistent", () => {
      let stream: Stream | undefined;

      it("creates a persistent local stream", async () => {
        const name = `stream${Date.now()}`;
        stream = fabric.stream(name, true);
        const response = await stream.createStream();
        expect(response.error).to.be.false;
      });
      it("creates a persistent global stream", async () => {
        const name = `stream${Date.now()}`;
        stream = fabric.stream(name, false);
        const response = await stream.createStream();
        expect(response.error).to.be.false;
      });
    });
  });

  describe("stream.manipulate", function() {
    let stream: Stream;
    let consumer:any;
    let producer:any;
    this.beforeAll(async () => {
      stream = fabric.stream(`testStream${Date.now()}`, false);
      await stream.createStream();
    });

    it("stream.expireMessagesOnAllSubscriptions");

    describe("stream.getBacklog", () => {
      it("gets estimated backlog for offline stream", async () => {
        setTimeout(async function() {
          const response = await stream.backlog();
          expect(response.error).to.be.false;
        }, 5000);
      });
    });

    describe("stream.getStreamStatistics", () => {
      it("gets the stream statistics", async () => {
        const response = await stream.getStreamStatistics();
        expect(response.error).to.be.false;
      });
    });
    describe("stream.subscriptions", () => {
      let dcName: string;
      
      this.beforeAll(async () => {
        const response = await fabric.getLocalEdgeLocation();
        dcName = response.tags.url;
      });
      this.afterAll(() => {
        if(consumer) consumer.close();
        if(producer) producer.close();
      });
      it.skip("stream.resetSubscriptionToPosition", done => {
        let numberOfMessages: number = 0;
        function callback(msg: string) {
          const parsedMsg = JSON.parse(msg);
          const { payload } = parsedMsg;
          const array = ["nandha", "abhishek", "rachit", "sulom", "pratik"];
          if (array.includes(payload)) {
            numberOfMessages++;
          }
          if (numberOfMessages === 5) {
            done();
          }
        }
        
         consumer = stream.consumer(
          `streamSubscriptionTest`,
          dcName
        );
        
         producer = stream.producer(dcName);


        consumer.on('open',()=>{
            ["nandha", "abhishek", "rachit", "sulom", "pratik"].map(payload=>{
                producer.send(JSON.stringify({payload}));
            })
        })
        consumer.on('message',callback);

      it("stream.expireMessages", () => {});

      it("stream.resetCursor", () => {});

      it("stream.skipNumberOfMessages", () => {});

      it("stream.skipAllMessages", () => {});

      it("stream.getSubscriptionList", () => {
        it("gets subscription list", async () => {
          const response = await stream.getSubscriptionList();
          expect(response.error).to.be.false;
        });
      });
    });

    describe("stream.terminate", () => {
      describe("persistent", () => {
        describe("local", () => {
          let stream: Stream;
          beforeEach(async () => {
            const streamName = `stream${Date.now()}`;
            stream = fabric.stream(streamName, true);
            await stream.createStream();
          });
          it("terminates persistent local stream", async () => {
            setTimeout(async function() {
              const response = await stream.terminateStream();
              expect(response.error).to.be.false;
            }, 5000);
          });
        });
        describe("global", () => {
          let stream: Stream;
          beforeEach(async () => {
            const streamName = `stream${Date.now()}`;
            stream = fabric.stream(streamName, false);
            await stream.createStream();
          });
          it("terminates persistent global stream", async () => {
            setTimeout(async function() {
              const response = await stream.terminateStream();
              expect(response.error).to.be.false;
            }, 5000);
          });
        });
      });
    });

    describe("stream.websocket", function() {
      let dcName: string;
      let consumer:any;
      let producer:any;
  
      this.beforeAll(async () => {
        const response = await fabric.getLocalEdgeLocation();
        dcName = response.tags.url;
      });
      this.afterAll(() => {
        if(consumer) consumer.close();
        if(producer) producer.close();
      });

      it("gets data in consumer when sent by producer", function(done) {
        function callback(msg: string) {
          const parsedMsg = JSON.parse(msg);
          const { payload } = parsedMsg;
          expect(payload).to.equal("test");
          done();
        }
        consumer = stream.consumer(
            `streamSubscription${Date.now()}`,
            dcName
          );
          
           producer = stream.producer(dcName);
  
  
          consumer.on('open',()=>{
                  producer.send(JSON.stringify({payload:'test'}));
          })
          consumer.on('message',callback);
  
      });
    });
  });
});
});
