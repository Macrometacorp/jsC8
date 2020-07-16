import { Connection } from "./connection";
import { getFullStreamPath } from "./util/helper";
import { stringify } from "query-string";

// 2 document
// 3 edge
// 4 persistent

import { ws } from "./util/webSocket";

export enum StreamConstants {
  PERSISTENT = "persistent",
}

export type wsCallbackObj = {
  onopen?: () => void;
  onclose?: () => void;
  onerror?: (e: Error) => void;
  onmessage: (msg: string) => Promise<boolean> | boolean | void;
};

export class Stream {
  private _connection: Connection;
  name: string;
  local: boolean;
  isCollectionStream: boolean;
  topic: string;

  constructor(
    connection: Connection,
    name: string,
    local: boolean = false,
    isCollectionStream: boolean = false
  ) {
    this._connection = connection;
    this.isCollectionStream = isCollectionStream;
    this.local = local;
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
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  expireMessagesOnAllSubscriptions(expireTimeInSeconds: number) {
    const urlSuffix = `/all_subscription/expireMessages/${expireTimeInSeconds}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  backlog() {
    const urlSuffix = "/backlog";
    return this._connection.request(
      {
        method: "GET",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  getStreamStatistics() {
    const urlSuffix = "/stats";
    return this._connection.request(
      {
        method: "GET",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  deleteSubscription(subscription: string) {
    const urlSuffix = `/subscription/${subscription}`;
    return this._connection.request(
      {
        method: "DELETE",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  resetSubscriptionToPosition(subscription: string) {
    const urlSuffix = `/subscription/${subscription}`;
    return this._connection.request(
      {
        method: "PUT",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  expireMessages(subscription: string, expireTimeInSeconds: number) {
    const urlSuffix = `/subscription/${subscription}/expireMessages/${expireTimeInSeconds}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  resetCursor(subscription: string) {
    const urlSuffix = `/subscription/${subscription}/resetcursor`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  resetSubscriptionToTimestamp(subscription: string, timestamp: number) {
    const urlSuffix = `/subscription/${subscription}/resetcursor/${timestamp}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  skipNumberOfMessages(subscription: string, numMessages: number) {
    const urlSuffix = `/subscription/${subscription}/skip/${numMessages}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  skipAllMessages(subscription: string) {
    const urlSuffix = `/subscription/${subscription}/skip_all`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  getSubscriptionList() {
    const urlSuffix = "/subscriptions";
    return this._connection.request(
      {
        method: "GET",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  terminateStream() {
    const urlSuffix = "/terminate";
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `local=${this.local}`,
      },
      (res) => res.body
    );
  }

  consumer(
    subscriptionName: string,
    dcName: string,
    params: { [key: string]: any } = {}
  ) {
    const lowerCaseUrl = dcName.toLocaleLowerCase();
    if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
      throw "Invalid DC name";

    const persist = StreamConstants.PERSISTENT;
    const region = this.local ? "c8local" : "c8global";
    const tenant = this._connection.getTenantName();
    let dbName = this._connection.getFabricName();

    if (!dbName || !tenant)
      throw "Set correct DB and/or tenant name before using.";

    let consumerUrl = `wss://api-${dcName}/_ws/ws/v2/consumer/${persist}/${tenant}/${region}.${dbName}/${
      this.topic
    }/${subscriptionName}`;

    if (Object.keys(params).length > 0) {
      const queryParams = stringify(params);
      consumerUrl = `${consumerUrl}?${queryParams}`;
    }

    return ws(consumerUrl);
  }

  producer(dcName: string, params: { [key: string]: any } = {}) {
    if (!dcName) throw "DC name not provided to establish producer connection";

    const lowerCaseUrl = dcName.toLocaleLowerCase();
    if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
      throw "Invalid DC name";

    const persist = StreamConstants.PERSISTENT;
    const region = this.local ? "c8local" : "c8global";
    const tenant = this._connection.getTenantName();
    let dbName = this._connection.getFabricName();

    if (!dbName || !tenant)
      throw "Set correct DB and/or tenant name before using.";

    let producerUrl = `wss://api-${dcName}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${
      this.topic
    }`;

    if (Object.keys(params).length > 0) {
      const queryParams = stringify(params);
      producerUrl = `${producerUrl}?${queryParams}`;
    }

    return ws(producerUrl);
  }
}
