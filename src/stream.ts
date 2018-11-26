import { Connection } from './connection';
import { getFullStreamPath } from './util/helper';
import { btoa } from './util/btoa';

// 2 document
// 3 edge
// 4 persistent
// 5 non-persistent

const WebSocket = require('ws');

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
    private _consumers: any[];

    constructor(connection: Connection, name: string, streamType: StreamType, local: boolean = false) {
        this._connection = connection;
        this.streamType = streamType;
        this.name = name;
        this.local = local;
        this._consumers = [];
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

    consumer(subscriptionName: string, callbackObj: wsCallbackObj, dcName: string) {
        const lowerCaseUrl = dcName.toLocaleLowerCase();
        if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https")) throw "Invalid DC name";
        const { onopen, onclose, onerror, onmessage } = callbackObj;
        const persist = this.streamType === StreamType.PERSISTENT_STREAM ? StreamConstants.PERSISTENT : StreamConstants.NON_PERSISTENT;
        const region = this.local ? 'c8local' : 'c8global';
        const tenant = this._connection.getTenantName();
        let dbName = this._connection.getFabricName();
        if (!dbName || !tenant) throw "Set correct DB and/or tenant name before using."

        dbName = (tenant === '_mm') ? dbName : `${tenant}.${dbName}`;
        const consumerUrl = `wss://${dcName}/_ws/ws/v2/consumer/${persist}/${tenant}/${region}.${dbName}/${this.name}/${subscriptionName}`;

        this._consumers.push(new WebSocket(consumerUrl));
        const lastIndex = this._consumers.length - 1;

        this._consumers[lastIndex].on('open', () => {
            console.log("Consumer connection opened");
            typeof onopen === 'function' && onopen();
        });

        this._consumers[lastIndex].on('close', () => {
            console.log("Consumer connection closed");
            typeof onclose === 'function' && onclose();
        });

        this._consumers[lastIndex].on('error', (e: Error) => {
            console.log("Consumer connection errored ", e);
            typeof onerror === 'function' && onerror(e);
        });

        this._consumers[lastIndex].on("message", (msg: string) => {
            const receiveMsg = JSON.parse(msg);
            console.log("consumer message received ", msg);
            typeof onmessage === 'function' && onmessage(receiveMsg);
        });
    }

    producer(message: string, dcName?: string) {

        if (this._producer === undefined) {
            if (!dcName) throw "DC name not provided to establish producer connection";

            const lowerCaseUrl = dcName.toLocaleLowerCase();
            if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https")) throw "Invalid DC name";
            const persist = this.streamType === StreamType.PERSISTENT_STREAM ? StreamConstants.PERSISTENT : StreamConstants.NON_PERSISTENT;
            const region = this.local ? 'c8local' : 'c8global';
            const tenant = this._connection.getTenantName();
            let dbName = this._connection.getFabricName();
            if (!dbName || !tenant) throw "Set correct DB and/or tenant name before using."

            dbName = (tenant === '_mm') ? dbName : `${tenant}.${dbName}`;
            const producerUrl = `wss://${dcName}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${this.name}`;
            this._producer = new WebSocket(producerUrl);

            this._producer.on("open", () => {
                console.log("Producer connection opened");
                this._producer.send(JSON.stringify({ data: { payload: btoa(message) } }));
            });
            this._producer.on('close', () => {
                console.log("Producer connection closed");
            });

            this._producer.on('error', (e: Error) => {
                console.log("Producer connection errored ", e);
            });
        } else {
            this._producer.send(JSON.stringify({ data: { payload: btoa(message) } }));
        }

    }

    closeWSConnections() {
        this._producer.close();
        this._consumers.forEach(consumer => consumer.close());
    }
}