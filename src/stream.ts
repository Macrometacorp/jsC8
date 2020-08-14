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
  global: boolean;
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

    /**
     * CHANGED this.local implementation to this.global
     * keeping the stream as local so !local
     */

    this.global = !local;
    this.name = name;

    let topic = this.name;
    if (!this.isCollectionStream) {
      if (this.global) topic = `c8globals.${this.name}`;
      else topic = `c8locals.${this.name}`;
    }
    this.topic = topic;
  }

  _getPath(useName: boolean, urlSuffix?: string): string {
    let topic = useName ? this.name : this.topic;
    return getFullStreamPath(topic, urlSuffix);
  }

  getOtp() {
    return this._connection.request(
      {
        method: "POST",
        path: "/apid/otp",
        absolutePath: true,
      },
      (res) => res.body.otp
    );
  }

  createStream() {
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(true),
        qs: `global=${this.global}`,
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
        qs: `global=${this.global}`,
      },
      (res) => res.body
    );
  }

  clearBacklog() {
    const urlSuffix = `/clearbacklog`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `global=${this.global}`,
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
        qs: `global=${this.global}`,
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
        qs: `global=${this.global}`,
      },
      (res) => res.body
    );
  }

  expireMessages(expireTimeInSeconds: number) {
    const urlSuffix = `/expiry/${expireTimeInSeconds}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `global=${this.global}`,
      },
      (res) => res.body
    );
  }

  clearSubscriptionBacklog(subscription: string) {
    const urlSuffix = `/clearbacklog/${subscription}`;
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `global=${this.global}`,
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
        qs: `global=${this.global}`,
      },
      (res) => res.body
    );
  }

  deleteStream(force: boolean = false) {
    return this._connection.request(
      {
        method: "DELETE",
        path: this._getPath(false),
        qs: `global=${this.global}&force=${force}`,
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
    const region = this.global ? "c8global" : "c8local";
    const tenant = this._connection.getTenantName();
    const queryParams = stringify(params);
    let dbName = this._connection.getFabricName();

    if (!dbName || !tenant)
      throw "Set correct DB and/or tenant name before using.";

    let consumerUrl = `wss://api-${dcName}/_ws/ws/v2/consumer/${persist}/${tenant}/${region}.${dbName}/${
      this.topic
    }/${subscriptionName}`;

    // Appending query params to the url
    consumerUrl = `${consumerUrl}?${queryParams}`;

    return ws(consumerUrl);
  }

  producer(dcName: string, params: { [key: string]: any } = {}) {
    if (!dcName) throw "DC name not provided to establish producer connection";

    const lowerCaseUrl = dcName.toLocaleLowerCase();
    if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
      throw "Invalid DC name";

    const persist = StreamConstants.PERSISTENT;
    const region = this.global ? "c8global" : "c8local";
    const tenant = this._connection.getTenantName();
    const queryParams = stringify(params);
    let dbName = this._connection.getFabricName();
    if (!dbName || !tenant)
      throw "Set correct DB and/or tenant name before using.";

    let producerUrl = `wss://api-${dcName}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${
      this.topic
    }`;

    // Appending query params to the url
    producerUrl = `${producerUrl}?${queryParams}`;

    return ws(producerUrl);
  }

  publishMessage(message: any) {
    const urlSuffix = "/publish";
    return this._connection.request(
      {
        method: "POST",
        path: this._getPath(false, urlSuffix),
        qs: `global=${this.global}`,
        body: message,
      },
      (res) => res.body
    );
  }

  getMessageTtl(){
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/streams/ttl",
      },
      (res) => res.body
    );
  }

  setMessageTtl(ttl: number = 3600){
    return this._connection.request(
      {
        method: "POST",
        path: `/_api/streams/ttl/${ttl}`,
      },
      (res) => res.body
    );
  }

  deleteSubscriptions(subscription: string) {
    const urlSuffix = `/subscriptions/${subscription}`;
    return this._connection.request(
      {
        method: "DELETE",
        path: this._getPath(false, urlSuffix),
        qs: `global=${this.global}`,
      },
      (res) => res.body
    );
  }
}
