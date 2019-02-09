import { Connection } from './connection';
import { getFullStreamPath } from './util/helper';
import { btoa } from './util/btoa';

// 2 document
// 3 edge
// 4 persistent

import { ws } from './util/webSocket';

export enum StreamConstants { PERSISTENT = "persistent" };

export type wsCallbackObj = {
    onopen?: () => void,
    onclose?: () => void,
    onerror?: (e: Error) => void,
    onmessage: (msg: string) => void
}

export class Stream {
    private _connection: Connection;
    name: string;
    local: boolean;
    private _producer: any;
    private _noopProducer: any;
    private _consumers: any[];
    private setIntervalId?: number;

    constructor(connection: Connection, name: string, local: boolean = false) {
        this._connection = connection;
        this.name = name;
        this.local = local;
        this._consumers = [];
        this.setIntervalId = undefined;
    }

    _getPath(urlSuffix?: string): string {
        return getFullStreamPath(this.name, this.local, urlSuffix);
    }

    createStream() {
        return this._connection.request(
            {
                method: "POST",
                path: this._getPath()
            },
            res => res.body
        );
    }

    expireMessagesOnAllSubscriptions(expireTimeInSeconds: number) {
        const urlSuffix = `/all_subscription/expireMessages/${expireTimeInSeconds}`;
        return this._connection.request(
            {
                method: "POST",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    backlog() {
        const urlSuffix = "/backlog";
        return this._connection.request(
            {
                method: "GET",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    compaction() {
        const urlSuffix = "/compaction";
        return this._connection.request(
            {
                method: "GET",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    triggerCompaction() {
        const urlSuffix = "/compaction";
        return this._connection.request(
            {
                method: "PUT",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    getStreamStatistics() {
        const urlSuffix = "/stats";
        return this._connection.request(
            {
                method: "GET",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    deleteSubscription(subscription: string) {
        const urlSuffix = `/subscription/${subscription}`;
        return this._connection.request(
            {
                method: "DELETE",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    resetSubscriptionToPosition(subscription: string) {
        const urlSuffix = `/subscription/${subscription}`;
        return this._connection.request(
            {
                method: "PUT",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    expireMessages(subscription: string, expireTimeInSeconds: number) {
        const urlSuffix = `/subscription/${subscription}/expireMessages/${expireTimeInSeconds}`;
        return this._connection.request(
            {
                method: "POST",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    resetCursor(subscription: string) {
        const urlSuffix = `/subscription/${subscription}/resetcursor`;
        return this._connection.request(
            {
                method: "POST",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    resetSubscriptionToTimestamp(subscription: string, timestamp: number) {
        const urlSuffix = `/subscription/${subscription}/resetcursor/${timestamp}`;
        return this._connection.request(
            {
                method: "POST",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    skipNumberOfMessages(subscription: string, numMessages: number) {
        const urlSuffix = `/subscription/${subscription}/skip/${numMessages}`;
        return this._connection.request(
            {
                method: "POST",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    skipAllMessages(subscription: string) {
        const urlSuffix = `/subscription/${subscription}/skip_all`;
        return this._connection.request(
            {
                method: "POST",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    getSubscriptionList() {
        const urlSuffix = "/subscriptions";
        return this._connection.request(
            {
                method: "GET",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    terminateStream() {
        const urlSuffix = "/terminate";
        return this._connection.request(
            {
                method: "POST",
                path: this._getPath(urlSuffix)
            },
            res => res.body
        );
    }

    consumer(subscriptionName: string, callbackObj: wsCallbackObj, dcUrl: string) {
        const lowerCaseUrl = dcUrl.toLocaleLowerCase();
        if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https")) throw "Invalid DC name";
        const { onopen, onclose, onerror, onmessage } = callbackObj;
        const persist = StreamConstants.PERSISTENT;
        const region = this.local ? 'c8local' : 'c8global';
        const tenant = this._connection.getTenantName();
        let dbName = this._connection.getFabricName();
        if (!dbName || !tenant) throw "Set correct DB and/or tenant name before using."

        const consumerUrl = `wss://${dcUrl}/_ws/ws/v2/consumer/${persist}/${tenant}/${region}.${dbName}/${this.name}/${subscriptionName}`;

        this._consumers.push(ws(consumerUrl));
        const lastIndex = this._consumers.length - 1;

        const consumer = this._consumers[lastIndex];

        consumer.on('open', () => {
            typeof onopen === 'function' && onopen();
        });

        consumer.on('close', () => {
            this.setIntervalId && clearInterval(this.setIntervalId);
            typeof onclose === 'function' && onclose();

        });

        consumer.on('error', (e: Error) => {
            console.log("Consumer connection errored ", e);
            typeof onerror === 'function' && onerror(e);
        });

        consumer.on("message", (msg: string) => {
            const message = JSON.parse(msg);
            const ackMsg = { "messageId": message.messageId };
            const { payload } = message;

            if (payload !== btoa('noop') && payload !== 'noop') {
                typeof onmessage === 'function' && consumer.send(JSON.stringify(ackMsg)) && onmessage(msg);
            } else {
                consumer.send(JSON.stringify(ackMsg));
            }
        });

        !this._noopProducer && this.noopProducer(dcUrl);

    }

    private noopProducer(dcUrl: string) {
        const lowerCaseUrl = dcUrl.toLocaleLowerCase();
        if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https")) throw "Invalid DC name";
        const persist = StreamConstants.PERSISTENT;
        const region = this.local ? 'c8local' : 'c8global';
        const tenant = this._connection.getTenantName();
        let dbName = this._connection.getFabricName();
        if (!dbName || !tenant) throw "Set correct DB and/or tenant name before using."

        const noopProducerUrl = `wss://${dcUrl}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${this.name}`;

        this._noopProducer = ws(noopProducerUrl);

        this._noopProducer.on('open', () => {
            this.setIntervalId = setInterval(() => {
                this._noopProducer.send(JSON.stringify({ payload: 'noop' }));
            }, 30000);
        });

        this._noopProducer.on('error', (e: Event) => console.log("noop producer errored ", e));
    }

    producer(message: string, dcUrl?: string) {

        if (this._producer === undefined) {
            if (!dcUrl) throw "DC name not provided to establish producer connection";

            const lowerCaseUrl = dcUrl.toLocaleLowerCase();
            if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https")) throw "Invalid DC name";
            const persist = StreamConstants.PERSISTENT;
            const region = this.local ? 'c8local' : 'c8global';
            const tenant = this._connection.getTenantName();
            let dbName = this._connection.getFabricName();
            if (!dbName || !tenant) throw "Set correct DB and/or tenant name before using."

            const producerUrl = `wss://${dcUrl}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${this.name}`;

            this._producer = ws(producerUrl);

            this._producer.on("message", (msg: string) => console.log('received ack: %s', msg));

            this._producer.on("open", () => {
                this._producer.send(JSON.stringify({ payload: btoa(message) }));
            });
            this._producer.on('close', (e: any) => {
                console.log("Producer connection closed ", e);
            });

            this._producer.on('error', (e: Error) => {
                console.log("Producer connection errored ", e);
            });

        } else {
            if (this._producer.readyState === this._producer.OPEN) {
                this._producer.send(JSON.stringify({ payload: btoa(message) }));
            } else {
                console.warn("Producer connection not open yet. Please wait.");
            }
        }

    }

    closeWSConnections() {
        this.setIntervalId && clearInterval(this.setIntervalId);
        this._producer && this._producer.terminate();
        this._noopProducer && this._noopProducer.terminate();
        this._consumers && this._consumers.forEach(consumer => consumer.terminate());
    }
}