import { expect } from "chai";
import { C8Client } from "../jsC8";
import { Stream } from "../stream";
import * as dotenv from "dotenv";

// TODO : @VIKAS Update Test cases

describe("Manipulating streams", function() {
  dotenv.config();
  // create fabric takes 11s in a standard cluster
  this.timeout(50000);
  let client: C8Client;
  before(async () => {
    client = new C8Client({
      url: process.env.URL,
      apiKey: process.env.API_KEY,
      fabricName: process.env.FABRIC,
    });
  });

  after(() => {
    client.close();
  });

  describe("client.stream", () => {
    it("returns a new Stream instance", () => {
      expect(client.stream("testStream", true)).to.be.instanceof(Stream);
    });
    it("gets all streams", async () => {
      const response = await client.getStreams();
      expect(response.error).to.be.false;
    });
    it("clears backlog", async () => {
      const response = await client.clearBacklog();
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
        stream = client.stream(name, true);
        const response = await stream.createStream();
        expect(response.error).to.be.false;
      });
      it("creates a persistent global stream", async () => {
        const name = `stream${Date.now()}`;
        stream = client.stream(name, false);
        const response = await stream.createStream();
        expect(response.error).to.be.false;
      });
    });
  });

  describe("stream.delete", () => {
    describe("delete stream", () => {
      let stream: Stream | undefined;

      it("deletes global stream", async () => {
        const name = `stream${Date.now()}`;
        stream = client.stream(name, true);
        const response = await stream.createStream();
        expect(response.error).to.be.false;
        stream = client.stream(response.result["stream-id"]);
        const deleteStreamResponse = await stream.deleteStream();
        expect(deleteStreamResponse.error).to.be.false;
      });

      it("deletes global stream", async () => {
        const name = `stream${Date.now()}`;
        stream = client.stream(name, false);
        const response = await stream.createStream();
        expect(response.error).to.be.false;
        stream = client.stream(response.result["stream-id"]);
        const deleteStreamResponse = await stream.deleteStream();
        expect(deleteStreamResponse.error).to.be.false;
      });
    });
  });

  describe("stream.manipulate", function() {
    let stream: Stream;
    let consumer: any;
    let producer: any;
    this.beforeAll(async () => {
      stream = client.stream(`testStream${Date.now()}`, false);
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
        const response = await client.getLocalEdgeLocation();
        dcName = response.tags.url;
      });
      this.afterAll(() => {
        if (consumer) consumer.close();
        if (producer) producer.close();
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

        consumer = stream.consumer(`streamSubscriptionTest`, dcName);

        producer = stream.producer(dcName);

        consumer.on("open", () => {
          ["nandha", "abhishek", "rachit", "sulom", "pratik"].map(payload => {
            producer.send(JSON.stringify({ payload }));
          });
        });
        consumer.on("message", callback);

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

      // describe("stream.terminate", () => {
      //   describe("persistent", () => {
      //     describe("local", () => {
      //       let stream: Stream;
      //       beforeEach(async () => {
      //         const streamName = `stream${Date.now()}`;
      //         stream = client.stream(streamName, true);
      //         await stream.createStream();
      //       });
      //       it("terminates persistent local stream", async () => {
      //         setTimeout(async function() {
      //           const response = await stream.terminateStream();
      //           expect(response.error).to.be.false;
      //         }, 5000);
      //       });
      //     });
      //     describe("global", () => {
      //       let stream: Stream;
      //       beforeEach(async () => {
      //         const streamName = `stream${Date.now()}`;
      //         stream = client.stream(streamName, false);
      //         await stream.createStream();
      //       });
      //       it("terminates persistent global stream", async () => {
      //         setTimeout(async function() {
      //           const response = await stream.terminateStream();
      //           expect(response.error).to.be.false;
      //         }, 5000);
      //       });
      //     });
      //   });
      // });

      describe("stream.websocket", function() {
        let dcName: string;
        let consumer: any;
        let producer: any;
        let consumerOtp: any;
        let producerOtp: any;

        this.beforeAll(async () => {
          const response = await client.getLocalEdgeLocation();
          dcName = response.tags.url;
          consumerOtp = await stream.getOtp();
          producerOtp = await stream.getOtp();
          consumer = await stream.consumer("Subscription123", dcName, {
            otp: consumerOtp,
          });
          producer = await stream.producer(dcName, { otp: producerOtp });
        });
        this.afterAll(() => {
          if (consumer) consumer.close();
          if (producer) producer.close();
        });

        it("gets data in consumer when sent by producer", function(done) {
          function callback(msg: string) {
            const parsedMsg = JSON.parse(msg);
            const { payload } = parsedMsg;
            expect(payload).to.equal("test");
            done();
          }

          consumer.on("open", () => {
            producer.send(JSON.stringify({ payload: "test" }));
          });
          consumer.on("message", callback);
        });
      });
    });
  });
});
