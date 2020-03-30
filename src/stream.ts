import { Connection } from "./connection";
import { getFullStreamPath } from "./util/helper";
import { btoa } from "./util/btoa";
import { stringify } from "query-string";

// 2 document
// 3 edge
// 4 persistent

import { ws } from "./util/webSocket";

export enum StreamConstants {
  PERSISTENT = "persistent"
}

export type wsCallbackObj = {
  onopen?: () => void;
  onclose?: () => void;
  onerror?: (e: Error) => void;
  onmessage: (msg: string) => Promise<boolean> | boolean | void;
};

type consumerObj = {
  consumer: any;
  intervalId: any;
};

export class Stream {
  private _connection: Connection;
  name: string;
  local: boolean;
  isCollectionStream: boolean;
  topic: string;
  private _producer: any;
  private _consumers: Array<consumerObj>;
  private _producerIntervalId?: any;

  constructor(
    connection: Connection,
    name: string,
    local: boolean = false,
    isCollectionStream: boolean = false
  ) {
    this._connection = connection;
    this.isCollectionStream = isCollectionStream;
    this.local = local;
    this._consumers = [];
    this._producerIntervalId = undefined;
    this.name = name;

    let topic = this.name;
    if (!this.isCollectionStream) {
      if (this.local) topic = `c8locals.${this.name}`;
      else topic = `c8globals.${this.name}`;
    }
    this.topic = topic;
  }

  _getPath(useName: boolean, urlSuffix?: string): string {
    let topic = useName ? this.name : this.topic;
    return getFullStreamPath(topic, urlSuffix);
  }

  createStream() {
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(true),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  expireMessagesOnAllSubscriptions(expireTimeInSeconds: number) {
    const urlSuffix = `/all_subscription/expireMessages/${expireTimeInSeconds}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  backlog() {
    const urlSuffix = "/backlog";
    return this._connection.request(
      {
        method: "GET",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  getStreamStatistics() {
    const urlSuffix = "/stats";
    return this._connection.request(
      {
        method: "GET",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  deleteSubscription(subscription: string) {
    const urlSuffix = `/subscription/${subscription}`;
    return this._connection.request(
      {
        method: "DELETE",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  resetSubscriptionToPosition(subscription: string) {
    const urlSuffix = `/subscription/${subscription}`;
    return this._connection.request(
      {
        method: "PUT",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  expireMessages(subscription: string, expireTimeInSeconds: number) {
    const urlSuffix = `/subscription/${subscription}/expireMessages/${expireTimeInSeconds}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  resetCursor(subscription: string) {
    const urlSuffix = `/subscription/${subscription}/resetcursor`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  resetSubscriptionToTimestamp(subscription: string, timestamp: number) {
    const urlSuffix = `/subscription/${subscription}/resetcursor/${timestamp}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  skipNumberOfMessages(subscription: string, numMessages: number) {
    const urlSuffix = `/subscription/${subscription}/skip/${numMessages}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  skipAllMessages(subscription: string) {
    const urlSuffix = `/subscription/${subscription}/skip_all`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  getSubscriptionList() {
    const urlSuffix = "/subscriptions";
    return this._connection.request(
      {
        method: "GET",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  terminateStream() {
    const urlSuffix = "/terminate";
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`
      },
      res => res.body
    );
  }

  consumer(
    subscriptionName: string,
    callbackObj: wsCallbackObj,
    dcName: string,
    params: { [key: string]: any } = {}
  ) {
    const lowerCaseUrl = dcName.toLocaleLowerCase();
    if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
      throw "Invalid DC name";
    const { onopen, onclose, onerror, onmessage } = callbackObj;
    const persist = StreamConstants.PERSISTENT;
    const region = this.local ? "c8local" : "c8global";
    const tenant = this._connection.getTenantName();
    let dbName = this._connection.getFabricName();
    let queryParams = stringify(params);
    if (!dbName || !tenant)
      throw "Set correct DB and/or tenant name before using.";

    const consumerUrl = `wss://${dcName}/_ws/ws/v2/consumer/${persist}/${tenant}/${region}.${dbName}/${
      this.topic
    }/${subscriptionName}?${queryParams}`;

    const consumerObj: consumerObj = {
      consumer: ws(consumerUrl),
      intervalId: null
    };

    this._consumers.push(consumerObj);

    const { consumer } = consumerObj;

    consumer.on("open", () => {
      typeof onopen === "function" && onopen();

      consumerObj["intervalId"] = setInterval(() => {
        consumer.send(JSON.stringify("noop"));
      }, 30000);
    });

    consumer.on("close", () => {
      clearInterval(consumerObj.intervalId);
      typeof onclose === "function" && onclose();
    });

    consumer.on("error", (e: Error) => {
      typeof onerror === "function" && onerror(e);
    });

    consumer.on("message", async (msg: string) => {
      const message = JSON.parse(msg);
      const ackMsg = { messageId: message.messageId };
      const { payload } = message;

      if (payload !== btoa("noop") && payload !== "noop") {
        if (typeof onmessage === "function") {
          const shouldAck = await onmessage(msg);
          if (shouldAck !== false) {
            consumer.send(JSON.stringify(ackMsg));
          }
        }
      } else {
        consumer.send(JSON.stringify(ackMsg));
      }
    });

    return consumer;
  }

  producer(
    message: string | Array<string>,
    dcName?: string,
    callbackObj?: wsCallbackObj
  ) {
    type CallbackFunction = () => void;
    let onopen: CallbackFunction | undefined;
    let onclose: CallbackFunction | undefined;
    let onmessage: (msg: string) => Promise<boolean> | boolean | void;
    let onerror: ((e: Error) => void) | undefined;
    if (callbackObj !== undefined) {
      onopen = callbackObj.onopen;
      onclose = callbackObj.onclose;
      onmessage = callbackObj.onmessage;
      onerror = callbackObj.onerror;
    }
    if (this._producer === undefined) {
      if (!dcName)
        throw "DC name not provided to establish producer connection";

      const lowerCaseUrl = dcName.toLocaleLowerCase();
      if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
        throw "Invalid DC name";
      const persist = StreamConstants.PERSISTENT;
      const region = this.local ? "c8local" : "c8global";
      const tenant = this._connection.getTenantName();
      let dbName = this._connection.getFabricName();
      if (!dbName || !tenant)
        throw "Set correct DB and/or tenant name before using.";

      const producerUrl = `wss://${dcName}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${
        this.topic
      }`;

      this._producer = ws(producerUrl);

      this._producer.on("message", (msg: string) => {
        typeof onmessage === "function" && onmessage(msg);
      });

      this._producer.on("open", () => {
        this._producerIntervalId = setInterval(() => {
          this._producer.send(JSON.stringify({ payload: "noop" }));
        }, 30000);
        if (!Array.isArray(message)) {
          this._producer.send(JSON.stringify({ payload: btoa(message) }));
        } else {
          for (let i = 0; i < message.length; i++) {
            this._producer.send(JSON.stringify({ payload: btoa(message[i]) }));
          }
        }
        typeof onopen === "function" && onopen();
      });
      this._producer.on("close", () => {
        clearInterval(this._producerIntervalId);
        typeof onclose === "function" && onclose();
      });

      this._producer.on("error", (e: Error) => {
        typeof onerror === "function" && onerror(e);
      });
    } else {
      if (this._producer.readyState === this._producer.OPEN) {
        if (!Array.isArray(message)) {
          this._producer.send(JSON.stringify({ payload: btoa(message) }));
        } else {
          for (let i = 0; i < message.length; i++) {
            this._producer.send(JSON.stringify({ payload: btoa(message[i]) }));
          }
        }
      } else {
        console.warn("Producer connection not open yet. Please wait.");
      }
    }
  }

  closeConnections() {
    this._producerIntervalId && clearInterval(this._producerIntervalId);
    this._producer && this._producer.terminate();
    this._consumers &&
      this._consumers.forEach(consumerObj => {
        consumerObj.consumer.terminate();
        clearInterval(consumerObj.intervalId);
      });
  }
}
