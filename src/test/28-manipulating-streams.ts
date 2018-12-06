import { expect } from "chai";
import { Fabric } from "../jsC8";
import { Stream, StreamType } from '../stream';

describe("Manipulating streams", function () {
    // create fabric takes 11s in a standard cluster
    this.timeout(50000);

    let fabric: Fabric;
    const testUrl: string = process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

    before(async () => {
        fabric = new Fabric({
            url: testUrl,
            c8Version: Number(process.env.C8_VERSION || 30400)
        });
    });

    after(() => {
        fabric.close();
    });

    describe("fabric.stream", () => {
        it("returns a new Stream instance", () => {
            expect(fabric.stream("testStream", StreamType.PERSISTENT_STREAM, true)).to.be.instanceof(Stream);
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

            it('creates a persistent local stream', async () => {
                const name = `stream_${Date.now()}`;
                stream = fabric.stream(name, StreamType.PERSISTENT_STREAM, true);
                const response = await stream.createStream();
                expect(response.error).to.be.false;
            });
            it('creates a persistent global stream', async () => {
                const name = `stream_${Date.now()}`;
                stream = fabric.stream(name, StreamType.PERSISTENT_STREAM, false);
                const response = await stream.createStream();
                expect(response.error).to.be.false;
            });
        });

        describe("non-persistent", () => {
            let stream: Stream | undefined;
            it('creates a non-persistent local stream', async () => {
                const name = `stream_${Date.now()}`;
                stream = fabric.stream(name, StreamType.NON_PERSISTENT_STREAM, true);
                const response = await stream.createStream();
                expect(response.error).to.be.false;
            });
            it('creates a non-persistent global stream', async () => {
                const name = `stream_${Date.now()}`;
                stream = fabric.stream(name, StreamType.NON_PERSISTENT_STREAM, false);
                const response = await stream.createStream();
                expect(response.error).to.be.false;
            });
        });
    });

    describe("stream.delete", () => {
        it("deletes the stream");
    });

    describe("stream.manipulate", function () {
        let stream: Stream;
        this.beforeAll(async () => {
            stream = fabric.stream(`testStream_${Date.now()}`, StreamType.PERSISTENT_STREAM, false);
            await stream.createStream();
        });

        it("stream.expireMessagesOnAllSubscriptions");

        describe("stream.getBacklog", () => {
            it("gets estimated backlog for offline stream", async () => {
                const response = await stream.backlog();
                expect(response.error).to.be.false;
            });
        });

        describe("stream.compaction", () => {
            it("gets the status of a compaction operation for a stream", async () => {
                const response = await stream.compaction();
                expect(response.error).to.be.false;
            });
        });

        describe("stream.triggerCompaction", () => {
            it("triggers a compaction on a stream", async () => {
                const response = await stream.triggerCompaction();
                expect(response.error).to.be.false;
            });
        });

        describe("stream.getStreamStatistics", () => {
            it("gets the stream statistics", async () => {
                const response = await stream.getStreamStatistics();
                expect(response.error).to.be.false;
            });
        });

        it("stream.deleteSubscription");

        it("stream.resetSubscriptionToPosition");

        it("stream.expireMessages");

        it("stream.resetCursor");

        it("stream.resetSubscription");

        it("stream.skipNumberOfMessages");

        it("stream.skipAllMessages");

        it("stream.getSubscriptionList", () => {
            it("gets subscription list", async () => {
                const response = await stream.getSubscriptionList();
                expect(response.error).to.be.false;
            });
        });

        describe("stream.terminate", () => {
            describe("persistent", () => {
                describe("local", () => {
                    let stream: Stream;
                    beforeEach(async () => {
                        const streamName = `stream_${Date.now()}`
                        stream = fabric.stream(streamName, StreamType.PERSISTENT_STREAM, true);
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
                        const streamName = `stream_${Date.now()}`
                        stream = fabric.stream(streamName, StreamType.PERSISTENT_STREAM, false);
                        await stream.createStream();
                    });
                    it("terminates persistent global stream", async () => {
                        const response = await stream.terminateStream();
                        expect(response.error).to.be.false;
                    });
                });
            });
            describe("non-persistent", () => {
                describe("local", () => {
                    let stream: Stream;
                    beforeEach(async () => {
                        const streamName = `stream_${Date.now()}`
                        stream = fabric.stream(streamName, StreamType.NON_PERSISTENT_STREAM, true);
                        await stream.createStream();
                    });
                    it("throws an error if terminating a non-persistent local stream", () => {
                        try {
                            stream.terminateStream();
                        } catch (e) {
                            return;
                        }
                        expect.fail("should fail");
                    });
                });
                describe("global", () => {
                    let stream: Stream;
                    beforeEach(async () => {
                        const streamName = `stream_${Date.now()}`
                        stream = fabric.stream(streamName, StreamType.NON_PERSISTENT_STREAM, false);
                        await stream.createStream();
                    });
                    it("throws an error if terminating a non-persistent global stream", async () => {
                        try {
                            stream.terminateStream();
                        } catch (e) {
                            return;
                        }
                        expect.fail("should fail");
                    });
                });
            });
        });

        describe("stream.websocket", function () {
            let dcName: string;
            this.beforeAll(async () => {
                const response = await fabric.getLocalEdgeLocation();
                dcName = response.tags.url;
            });
            this.afterAll(() => {
                stream.closeWSConnections();
            })

            it("gets data in consumer when sent by producer", function (done) {
                function callback(msg: string) {
                    const parsedMsg = JSON.parse(msg);
                    const { payload } = parsedMsg;
                    if (payload !== 'noop' && payload !== '') {
                        expect(payload).to.equal("dGVzdA==");
                        done();
                    }
                }
                stream.consumer(`streamSubscription_${Date.now()}`, { onmessage: callback, onopen: () => stream.producer("test", dcName) }, dcName);
            });
        });
    });
});