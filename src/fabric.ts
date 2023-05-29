import {
  C8QLLiteral,
  C8QLQuery,
  isC8QLLiteral,
  isC8QLQuery,
} from "./c8ql-query";
import {
  C8Collection,
  constructCollection,
  DocumentCollection,
  EdgeCollection,
} from "./collection";
import { Config, Connection } from "./connection";
import { ArrayCursor } from "./cursor";
import { isC8Error } from "./error";
import { Graph } from "./graph";
import { Tenant } from "./tenant";
import { Stream } from "./stream";
import { Route } from "./route";
import { btoa } from "./util/btoa";
import { Event } from "./event";
import User from "./user";
import { Streamapps } from "./streamapps";

export type TenantListObj = {
  tenant: string;
  active: boolean;
  extra: any;
};

export type TenantList = {
  error: boolean;
  code: number;
  result: TenantListObj[];
};

export type EdgeLocation = {
  _id: string;
  _key: string;
  _rev: string;
  host: string;
  local: boolean;
  name: string;
  port: number;
  spot_region: boolean;
  status: 0 | 1;
  tags: {
    city: string;
    countrycode: string;
    countryname: string;
    latitude: string;
    longitude: string;
    role: string;
    url: string;
  };
};

export type ServiceOptions = {
  [key: string]: any;
  configuration?: { [key: string]: any };
  dependencies?: { [key: string]: any };
};

export interface CreateFabricOptions {
  dcList: string; //comma separated string, can also be ""
  spotDc?: string;
  metadata?: object;
}

const FABRIC_NOT_FOUND = 1228;

export class Fabric {
  protected _connection: Connection;

  constructor(config?: Config) {
    this._connection = new Connection(config);
  }

  get name(): string | null {
    return this._connection.getFabricName() || null;
  }

  route(path?: string, headers?: Object): Route {
    return new Route(this._connection, path, headers);
  }

  close(): void {
    this._connection.close();
  }

  // Fabric manipulation

  useFabric(fabricName: string): this {
    this._connection.setFabricName(fabricName);
    return this;
  }

  useBearerAuth(token: string): this {
    this._connection.setHeader("authorization", `Bearer ${token}`);
    return this;
  }

  useBasicAuth(username: string, password: string): this {
    this._connection.setHeader(
      "authorization",
      `Basic ${btoa(`${username}:${password}`)}`
    );
    return this;
  }

  get() {
    return this._connection.request(
      { path: "/database/current" },
      (res) => res.body.result
    );
  }

  exists(): Promise<boolean> {
    return this.get().then(
      () => true,
      (err) => {
        if (isC8Error(err) && err.errorNum === FABRIC_NOT_FOUND) {
          return false;
        }
        throw err;
      }
    );
  }
  createFabric(
    fabricName: string,
    users: string[] | undefined,
    options: CreateFabricOptions
  ): Promise<any> {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/database",
        body: { users: users || [], name: fabricName, options },
      },
      (res) => res.body
    );
  }

  listFabrics() {
    return this._connection.request(
      { path: "/database" },
      (res) => res.body.result
    );
  }

  listUserFabrics() {
    return this._connection.request(
      { path: "/database/user" },
      (res) => res.body.result
    );
  }

  dropFabric(fabricName: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/database/${fabricName}`,
      },
      (res) => res.body
    );
  }

  getGeoFabricMetaData() {
    return this._connection.request(
      {
        method: "GET",
        path: "/database/metadata",
      },
      (res) => res.body
    );
  }

  setMetaDataForGeoFabric(metadata: any) {
    return this._connection.request(
      {
        method: "PUT",
        path: "/database/metadata",
        body: { metadata },
      },
      (res) => res.body
    );
  }

  updateMetaDataForGeoFabric(metadata: any) {
    return this._connection.request(
      {
        method: "PATCH",
        path: "/database/metadata",
        body: { metadata },
      },
      (res) => res.body
    );
  }

  login(email: string, password: string): Promise<object> {
    return this._connection.request(
      {
        method: "POST",
        path: "/_open/auth",
        body: { email, password },
        absolutePath: true,
      },
      (res) => {
        this.useBearerAuth(res.body.jwt);
        this.useTenant(res.body.tenant);
        return res.body;
      }
    );
  }

  updateFabricSpotRegion(
    tenantName: string,
    fabricName: string,
    datacenter: string = ""
  ) {
    return this._connection.request(
      {
        method: "PUT",
        path: `_tenant/${tenantName}/_fabric/${fabricName}/database/${datacenter}`,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getEvents() {
    return this._connection.request(
      {
        method: "GET",
        path: `/events`,
      },
      (res) => res.body
    );
  }

  deleteEvents(eventIds: string[]) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/events`,
        body: JSON.stringify(eventIds),
      },
      (res) => res.body
    );
  }

  event(entityName: string, eventId?: number) {
    return new Event(this._connection, entityName, eventId);
  }

  // Collection manipulation

  collection(collectionName: string): DocumentCollection {
    return new DocumentCollection(this._connection, collectionName);
  }

  edgeCollection(collectionName: string): EdgeCollection {
    return new EdgeCollection(this._connection, collectionName);
  }

  listCollections(excludeSystem: boolean = true) {
    return this._connection.request(
      {
        path: "/collection",
        qs: { excludeSystem },
      },
      (res) =>
        this._connection.c8Major <= 2 ? res.body.collections : res.body.result
    );
  }

  async collections(excludeSystem: boolean = true): Promise<C8Collection[]> {
    const collections = await this.listCollections(excludeSystem);
    return collections.map((data: any) =>
      constructCollection(this._connection, data)
    );
  }

  async truncate(excludeSystem: boolean = true) {
    const collections = await this.listCollections(excludeSystem);
    return await Promise.all(
      collections.map((data: any) =>
        this._connection.request(
          {
            method: "PUT",
            path: `/collection/${data.name}/truncate`,
          },
          (res) => res.body
        )
      )
    );
  }

  // Graph manipulation

  graph(graphName: string): Graph {
    return new Graph(this._connection, graphName);
  }

  listGraphs() {
    return this._connection.request(
      { path: "/_api/graph" },
      (res) => res.body.graphs
    );
  }

  async graphs(): Promise<Graph[]> {
    const graphs = await this.listGraphs();
    return graphs.map((data: any) => this.graph(data._key));
  }

  // Queries

  query(query: string | C8QLQuery | C8QLLiteral): Promise<ArrayCursor>;
  query(query: C8QLQuery, opts?: any): Promise<ArrayCursor>;
  query(
    query: string | C8QLLiteral,
    bindVars?: any,
    opts?: any
  ): Promise<ArrayCursor>;
  query(
    query: string | C8QLQuery | C8QLLiteral,
    bindVars?: any,
    opts?: any
  ): Promise<ArrayCursor> {
    const apiPath = opts && opts.sql ? "/cursor/sql" : "/cursor";
    if (isC8QLQuery(query)) {
      opts = bindVars;
      bindVars = query.bindVars;
      query = query.query;
    } else if (isC8QLLiteral(query)) {
      query = query.toC8QL();
    }
    return this._connection.request(
      {
        method: "POST",
        path: apiPath,
        body: { ...opts, query, bindVars },
      },
      (res) => new ArrayCursor(this._connection, res.body, res.host)
    );
  }

  nextBatchFromCursor(cursorIdentifier: number) {
    const cursorHandler = new ArrayCursor(this._connection, {
      id: cursorIdentifier,
    });
    return cursorHandler.nextBatch().then((res) => res.body);
  }

  deleteCursor(cursorIdentifier: number) {
    const cursorHandler = new ArrayCursor(this._connection, {
      id: cursorIdentifier,
    });
    return cursorHandler.delete();
  }

  validateQuery(query: string) {
    return this._connection.request(
      {
        method: "POST",
        path: "/query",
        body: { query },
      },
      (res) => res.body
    );
  }

  explainQuery(explainQueryObj: C8QLQuery) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/explain",
        body: { ...explainQueryObj },
      },
      (res) => res.body
    );
  }

  getCurrentQueries() {
    return this._connection.request(
      {
        path: "/query/current",
      },
      (res) => res.body
    );
  }

  clearSlowQueries() {
    return this._connection.request(
      {
        method: "DELETE",
        path: "/query/slow",
      },
      (res) => res.body
    );
  }

  getSlowQueries() {
    return this._connection.request(
      {
        path: "/query/slow",
      },
      (res) => res.body
    );
  }

  terminateRunningQuery(queryId: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/query/${queryId}`,
      },
      (res) => res.body
    );
  }

  // Function management

  listFunctions() {
    return this._connection.request(
      { path: "/c8qlfunction" },
      (res) => res.body
    );
  }

  createFunction(name: string, code: string, isDeterministic?: boolean) {
    return this._connection.request(
      {
        method: "POST",
        path: "/c8qlfunction",
        body: { name, code, isDeterministic },
      },
      (res) => res.body
    );
  }

  dropFunction(name: string, group?: boolean) {
    const path =
      typeof group === "boolean"
        ? `/c8qlfunction/${name}?group=${group}`
        : `/c8qlfunction/${name}`;
    return this._connection.request(
      {
        method: "DELETE",
        path,
      },
      (res) => res.body
    );
  }

  version(details: boolean = false): Promise<any> {
    return this._connection.request(
      {
        method: "GET",
        path: `/_fabric/${this._connection.getFabricName()}/_api/version`,
        absolutePath: true,
        qs: { details },
      },
      (res) => res.body
    );
  }

  // Tenant

  useTenant(tenantName: string): this {
    this._connection.setTenantName(tenantName);
    return this;
  }

  tenant(email: string, tenantName?: string): Tenant {
    return new Tenant(this._connection, email, tenantName);
  }

  listTenants() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/tenants",
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  //Stream

  stream(
    streamName: string,
    local: boolean = false,
    isCollectionStream: boolean = false
  ): Stream {
    return new Stream(this._connection, streamName, local, isCollectionStream);
  }

  /* -------------------------------- DUPLICATE ------------------------------- */
  // TODO: @RACHIT choose which Fn to deprecate

  getStreams(global: boolean | undefined = undefined) {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/streams",
        qs: global === undefined ? "" : `global=${global}`,
      },
      (res) => res.body
    );
  }

  getAllStreams() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/streams",
      },
      (res) => res.body
    );
  }

  /* ----------------------------------- --- ---------------------------------- */
  // TODO: RACHIT/VIKAS DO WE STILL HAVE THIS API?
  listPersistentStreams(local: boolean = false) {
    return this._connection.request(
      {
        method: "GET",
        path: `/_api/streams/persistent`,
        qs: `local=${local}`,
      },
      (res) => res.body
    );
  }

  clearBacklog() {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/streams/clearbacklog",
      },
      (res) => res.body
    );
  }

  clearSubscriptionBacklog(subscription: string) {
    return this._connection.request(
      {
        method: "POST",
        path: `/_api/streams/clearbacklog/${subscription}`,
      },
      (res) => res.body
    );
  }

  unsubscribe(subscription: string) {
    return this._connection.request(
      {
        method: "POST",
        path: `/_api/streams/unsubscribe/${subscription}`,
      },
      (res) => res.body
    );
  }

  //edge locations

  getAllEdgeLocations() {
    return this._connection.request(
      {
        method: "GET",
        path: "/datacenter/all",
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getTenantEdgeLocations() {
    return this._connection.request(
      {
        method: "GET",
        path: `/datacenter/_tenant/${this._connection.getTenantName()}`,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  getLocalEdgeLocation() {
    return this._connection.request(
      {
        method: "GET",
        path: "/datacenter/local",
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  changeEdgeLocationSpotStatus(dcName: string, isSpot: boolean) {
    return this._connection.request(
      {
        method: "PUT",
        path: `_api/datacenter/${dcName}/${isSpot}`,
        absolutePath: true,
      },
      (res) => res.body
    );
  }

  //user

  user(user: string, email: string = ""): User {
    return new User(this._connection, user, email);
  }

  getAllUsers() {
    return this._connection.request(
      {
        method: "GET",
        path: `/_admin/user`,
      },
      (res) => res.body
    );
  }

  //User Queries / RESTQL

  listSavedQueries() {
    return this._connection.request(
      {
        method: "GET",
        path: `/restql/user`,
      },
      (res) => res.body
    );
  }

  saveQuery(name: string, parameter: any = {}, value: string) {
    return this._connection.request(
      {
        method: "POST",
        path: "/restql",
        body: {
          query: {
            name: name,
            parameter: parameter,
            value: value,
          },
        },
      },
      (res) => res.body
    );
  }

  executeSavedQuery(queryName: string, opts: any = {}) {
    return this._connection.request(
      {
        method: "POST",
        path: `/restql/execute/${queryName}`,
        body: {
          bindVars: opts.bindVars,
          batchSize: opts.batchSize,
        },
      },
      (res) => res.body
    );
  }

  updateSavedQuery(queryName: string, parameter: any = {}, value: string) {
    return this._connection.request(
      {
        method: "PUT",
        path: `/restql/${queryName}`,
        body: {
          query: {
            parameter: parameter,
            value: value,
          },
        },
      },
      (res) => res.body
    );
  }

  deleteSavedQuery(queryName: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/restql/${queryName}`,
      },
      (res) => res.body
    );
  }

  getNextBatchFromCursor(id: string) {
    return this._connection.request(
      {
        method: "PUT",
        path: `/restql/fetch/${id}`,
      },
      (res) => res.body
    );
  }

  // Stream Applications

  streamApp(appName: string): Streamapps {
    return new Streamapps(this._connection, appName);
  }

  createStreamApp(regions: Array<string>, appDefinition: string): Promise<any> {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/streamapps",
        body: {
          definition: appDefinition,
          regions: regions,
        },
      },
      (res) => res.body
    );
  }

  getAllStreamApps() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/streamapps",
      },
      (res) => res.body
    );
  }

  validateStreamappDefinition(appDefinition: string) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/streamapps/validate",
        body: {
          definition: appDefinition,
        },
      },
      (res) => res.body
    );
  }

  getSampleStreamApps() {
    return this._connection.request(
      {
        method: "GET",
        path: "/_api/streamapps/samples",
      },
      (res) => res.body
    );
  }
}
