import { Connection } from './connection';
import { getFullStreamPath } from './util/helper';
import { btoa } from './util/btoa';

// 2 document
// 3 edge
// 4 persistent
// 5 non-persistent

import { ws } from './util/webSocket';

export enum StreamType { PERSISTENT_STREAM = 4, NON_PERSISTENT_STREAM };
export enum StreamConstants { NON_PERSISTENT = "non-persistent", PERSISTENT = "persistent" };

export type wsCallbackObj = {
    onopen?: () => void,
    onclose?: () => void,
    onerror?: (e: Error) => void,
    onmessage: (msg: string) => void
}

export class Stream {
    private _connection: Connection;
    streamType: StreamType;
    name: string;
    local: boolean;
    private _producer: any;
    private _noopProducer: any;
    private _consumers: any[];
    private setIntervalId?: NodeJS.Timeout;

    constructor(connection: Connection, name: string, streamType: StreamType, local: boolean = false) {
        this._connection = connection;
        this.streamType = streamType;
        this.name = name;
        this.local = local;
        this._consumers = [];
        this.setIntervalId = undefined;
    }

    _getPath(urlSuffix?: string): string {
        return getFullStreamPath(this.name, this.streamType, this.local, urlSuffix);
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
        if (this.streamType === StreamType.NON_PERSISTENT_STREAM) throw "Non-persistent stream cannot be terminated"
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
        const persist = this.streamType === StreamType.PERSISTENT_STREAM ? StreamConstants.PERSISTENT : StreamConstants.NON_PERSISTENT;
        const region = this.local ? 'c8local' : 'c8global';
        const tenant = this._connection.getTenantName();
        let dbName = this._connection.getFabricName();
        if (!dbName || !tenant) throw "Set correct DB and/or tenant name before using."

        dbName = (tenant === '_mm') ? dbName : `${tenant}.${dbName}`;
        const consumerUrl = `wss://${dcUrl}/_ws/ws/v2/consumer/${persist}/${tenant}/${region}.${dbName}/${this.name}/${subscriptionName}`;

        this._consumers.push(ws(consumerUrl));
        const lastIndex = this._consumers.length - 1;

        this._consumers[lastIndex].on('open', () => {
            console.log("Consumer connection opened");
            typeof onopen === 'function' && onopen();
        });

        this._consumers[lastIndex].on('close', () => {
            console.log("Consumer connection closed");
            this.setIntervalId && clearInterval(this.setIntervalId);
            typeof onclose === 'function' && onclose();

        });

        this._consumers[lastIndex].on('error', (e: Error) => {
            console.log("Consumer connection errored ", e);
            typeof onerror === 'function' && onerror(e);
        });

        this._consumers[lastIndex].on("message", (msg: string) => {
            typeof onmessage === 'function' && onmessage(msg);
        });

        !this._noopProducer && this.noopProducer(dcUrl);

    }

    private noopProducer(dcUrl: string) {
        const lowerCaseUrl = dcUrl.toLocaleLowerCase();
        if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https")) throw "Invalid DC name";
        const persist = this.streamType === StreamType.PERSISTENT_STREAM ? StreamConstants.PERSISTENT : StreamConstants.NON_PERSISTENT;
        const region = this.local ? 'c8local' : 'c8global';
        const tenant = this._connection.getTenantName();
        let dbName = this._connection.getFabricName();
        if (!dbName || !tenant) throw "Set correct DB and/or tenant name before using."

        dbName = (tenant === '_mm') ? dbName : `${tenant}.${dbName}`;
        const noopProducerUrl = `wss://${dcUrl}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${this.name}`;

        this._noopProducer = ws(noopProducerUrl);

        this._noopProducer.on('open', () => {
            console.log("noop producer opened");
            this.setIntervalId = setInterval(() => {
                this._noopProducer.send(JSON.stringify({ payload: 'noop' }));
            }, 30000);
        });

        this._noopProducer.on('close', (e: Event) => console.log("noop producer closed ", e));

        this._noopProducer.on('error', (e: Event) => console.log("noop producer errored ", e));

        this._noopProducer.on("message", (msg: string) => console.log('received ack: %s', msg));
    }

    producer(message: string, dcUrl?: string) {

        if (this._producer === undefined) {
            if (!dcUrl) throw "DC name not provided to establish producer connection";

            const lowerCaseUrl = dcUrl.toLocaleLowerCase();
            if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https")) throw "Invalid DC name";
            const persist = this.streamType === StreamType.PERSISTENT_STREAM ? StreamConstants.PERSISTENT : StreamConstants.NON_PERSISTENT;
            const region = this.local ? 'c8local' : 'c8global';
            const tenant = this._connection.getTenantName();
            let dbName = this._connection.getFabricName();
            if (!dbName || !tenant) throw "Set correct DB and/or tenant name before using."

            dbName = (tenant === '_mm') ? dbName : `${tenant}.${dbName}`;
            const producerUrl = `wss://${dcUrl}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${this.name}`;

            this._producer = ws(producerUrl);
            this._producer.on("open", () => {
                console.log("Producer connection opened");
                this._producer.send(JSON.stringify({ payload: btoa(message) }));
            });
            this._producer.on('close', (e: any) => {
                console.log("Producer connection closed ", e);
            });

            this._producer.on('error', (e: Error) => {
                console.log("Producer connection errored ", e);
            });

            this._producer.on("message", (msg: string) => console.log('received ack: %s', msg));
        } else {
            if (this._producer.readyState === this._producer.OPEN) {
                this._producer.send(JSON.stringify({ payload: btoa(message) }));
            } else {
                console.log("Producer connection not open yet. Please wait.");
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