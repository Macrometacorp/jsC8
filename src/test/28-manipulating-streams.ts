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
    await fabric.login("demo", "root", "demo");
    fabric.useTenant("demo");
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
    this.beforeAll(async () => {
      stream = fabric.stream(`testStream${Date.now()}`, false);
      await stream.createStream();
    });

    

    it("stream.expireMessagesOnAllSubscriptions");

    describe("stream.getBacklog", () => {
      it("gets estimated backlog for offline stream", async () => {
        const response = await stream.backlog();
        console.log(response.error);
        expect(response.error).to.be.false;
      });
    });

    describe("stream.getStreamStatistics", () => {
      it("gets the stream statistics", async () => {
        const response = await stream.getStreamStatistics();
        expect(response.error).to.be.false;
      });
    });
    // TODO: Add the below one later
    // it("stream.deleteSubscription", async (done) => {

    //   let dcName: string;
    //   function callback(msg: string) {
    //     const parsedMsg = JSON.parse(msg);
    //     const { payload } = parsedMsg;
    //     expect(payload).to.equal("dGVzdA==");
    //     done();
    //   }
    //   stream.consumer(
    //     `streamSubscription${Date.now()}`,
    //     {
    //       onmessage: callback,
    //       onopen: () => stream.producer("test", dcName)
    //     },
    //     ''
    //   );
    // expect(response.error).to.be.false;
    //present in swagger
    //});
    describe("stream.subscriptions", () => {
      let dcName: string;
      this.beforeAll(async () => {
        const response = await fabric.getLocalEdgeLocation();
        dcName = response.tags.url;
      });
      this.afterAll(() => {
        stream.closeConnections();
      });
      it("stream.resetSubscriptionToPosition", (done) => {
        let numberOfMessages:number = 0;
        function callback(msg: string) {
          const parsedMsg = JSON.parse(msg);
          const { payload } = parsedMsg;
          const array = ["bmFuZGhh","YWJoaXNoZWs=","dmlwdWw=","c3Vsb20=","cHJhdGlr"];
            if(array.includes(payload)){
              numberOfMessages++;
            };
          if(numberOfMessages === 5){
            done();
          }
        }
        stream.consumer(
          `streamSubscriptionTest`,
          {
            onmessage: callback,
            onopen: () => {
              stream.producer(["nandha","abhishek","vipul","sulom","pratik"], dcName);
            }
          },
          dcName
        );
      });

      it("stream.expireMessages", () => {
      });

      it("stream.resetCursor", () => {
      });

      it("stream.skipNumberOfMessages", () => {
      });

      it("stream.skipAllMessages", () => {
      });

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
            const response = await stream.terminateStream();
            expect(response.error).to.be.false;
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
            const response = await stream.terminateStream();
            expect(response.error).to.be.false;
          });
        });
      });
    });

    describe("stream.websocket", function() {
      let dcName: string;
      this.beforeAll(async () => {
        const response = await fabric.getLocalEdgeLocation();
        dcName = response.tags.url;
      });
      this.afterAll(() => {
        stream.closeConnections();
      });

      it("gets data in consumer when sent by producer", function(done) {
        function callback(msg: string) {
          const parsedMsg = JSON.parse(msg);
          const { payload } = parsedMsg;
          expect(payload).to.equal("dGVzdA==");
          done();
        }
        stream.consumer(
          `streamSubscription${Date.now()}`,
          {
            onmessage: callback,
            onopen: () => stream.producer("test", dcName)
          },
          dcName
        );
      });
    });
  });
});
