import { Config } from "./connection";
import { Fabric } from "./fabric";
import {
  DocumentHandle,
  DocumentsHandle,
  DocumentSaveOptions,
} from "./collection";
import { C8QLLiteral } from "./c8ql-query";

const csv = require("csvtojson");
const jwtDecode = require("jwt-decode");

export class C8Client extends Fabric {
  constructor(config: Config) {
    super(config);
  }

  useApiKeyAuth(apikey: string): this {
    this._connection.setHeader("authorization", `apikey ${apikey}`);
    return this;
  }

  validateApiKey(apikey: string) {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/key/validate",
        absolutePath: true,
        body: {
          apikey,
        },
      },
      (res) => res.body
    );
  }

  async loginWithToken(token: string) {
    this.useBearerAuth(token);
    const { error, errorMessage } = await this.version();
    if (error) {
      throw new Error(errorMessage);
    } else {
      const { tenant } = jwtDecode(token);
      this.useTenant(tenant);
    }
  }

  async loginWithApiKey(apikey: string) {
    this.useApiKeyAuth(apikey);
    const { error, errorMessage, result } = await this.validateApiKey(apikey);
    if (error) {
      throw new Error(errorMessage);
    } else {
      const { tenant } = result;
      this.useTenant(tenant);
    }
  }

  createCollection(collectionName: string, properties?: any) {
    const collection = this.collection(collectionName);
    return collection.create(properties);
  }

  deleteCollection(collectionName: string, opts?: any) {
    const collection = this.collection(collectionName);
    return collection.drop(opts);
  }

  hasCollection(collectionName: string) {
    const collection = this.collection(collectionName);
    return collection.exists();
  }

  getCollection(collectionName: string) {
    const collection = this.collection(collectionName);
    return collection.get();
  }

  getCollections(excludeSystem: boolean = true) {
    return this.listCollections(excludeSystem);
  }

  async onCollectionChange(
    collectionName: string,
    dcName: string,
    subscriptionName: string
  ) {
    const dcList = await this.getDcList();
    let dcUrl = dcList[0].dcInfo[0].tags.url;
    if (dcName) {
      dcUrl = dcName;
    }
    const otp = await this.getOtp();
    const collection = this.collection(collectionName, otp);
    return collection.onChange(dcUrl, subscriptionName);
  }

  getDocument(
    collectionName: string,
    documentHandle: DocumentHandle,
    graceful: boolean = false
  ) {
    const collection = this.collection(collectionName);
    return collection.document(documentHandle, graceful);
  }

  getDocumentMany(collectionName: string, limit?: number, skip?: number) {
    const getDocumentsQuery = `FOR doc IN ${collectionName} ${
      limit ? `limit ${skip ? `${skip},` : ""}${limit}` : ""
      } return doc`;
    return this.executeQuery(getDocumentsQuery);
  }

  insertDocument(
    collectionName: string,
    data: any,
    opts?: DocumentSaveOptions | boolean
  ) {
    const collection = this.collection(collectionName);
    return collection.save(data, opts);
  }

  insertDocumentMany(
    collectionName: string,
    data: any,
    opts?: DocumentSaveOptions | boolean
  ) {
    const collection = this.collection(collectionName);
    return collection.save(data, opts);
  }

  async insertDocumentFromFile(
    collectionName: string,
    csvPath: string,
    opts?: DocumentSaveOptions | boolean
  ) {
    const data = await csv().fromFile(csvPath);
    const collection = this.collection(collectionName);
    return collection.save(data, opts);
  }

  updateDocument(
    collectionName: string,
    documentHandle: any,
    newValue: any,
    opts: any = {}
  ) {
    const collection = this.collection(collectionName);
    return collection.update(documentHandle, newValue, opts);
  }

  updateDocumentMany(
    collectionName: string,
    documentsHandle: DocumentsHandle[],
    opts: any = {}
  ) {
    const collection = this.collection(collectionName);
    return collection.updateDocuments(documentsHandle, opts);
  }

  replaceDocument(
    collectionName: string,
    documentHandle: any,
    newValue: any,
    opts: any = {}
  ) {
    const collection = this.collection(collectionName);
    return collection.replace(documentHandle, newValue, opts);
  }

  replaceDocumentMany(
    collectionName: string,
    documentsHandle: DocumentsHandle[],
    opts: any = {}
  ) {
    const collection = this.collection(collectionName);
    return collection.replaceDocuments(documentsHandle, opts);
  }

  deleteDocument(collectionName: string, documentHandle: any, opts: any = {}) {
    const collection = this.collection(collectionName);
    return collection.remove(documentHandle, opts);
  }

  deleteDocumentMany(
    collectionName: string,
    documentsHandle: string[] | DocumentsHandle[],
    opts: any = {}
  ) {
    const collection = this.collection(collectionName);
    return collection.removeDocuments(documentsHandle, opts);
  }

  listCollectionIndexes(collectionName: string) {
    const collection = this.collection(collectionName);
    return collection.indexes();
  }

  addHashIndex(collectionName: string, fields: string[] | string, opts?: any) {
    const collection = this.collection(collectionName);
    return collection.createHashIndex(fields, opts);
  }

  addGeoIndex(collectionName: string, fields: string[] | string, opts?: any) {
    const collection = this.collection(collectionName);
    return collection.createGeoIndex(fields, opts);
  }

  addSkiplistIndex(
    collectionName: string,
    fields: string[] | string,
    opts?: any
  ) {
    const collection = this.collection(collectionName);
    return collection.createSkipList(fields, opts);
  }

  addPersistentIndex(
    collectionName: string,
    fields: string[] | string,
    opts?: any
  ) {
    const collection = this.collection(collectionName);
    return collection.createPersistentIndex(fields, opts);
  }

  addFullTextIndex(
    collectionName: string,
    fields: string[] | string,
    minLength?: number
  ) {
    const collection = this.collection(collectionName);
    return collection.createFulltextIndex(fields, minLength);
  }

  addTtlIndex(
    collectionName: string,
    fields: string[] | string,
    expireAfter: number
  ) {
    const collection = this.collection(collectionName);
    return collection.createTtlIndex(fields, expireAfter);
  }

  deleteIndex(collectionName: string, indexName: string) {
    const collection = this.collection(collectionName);
    return collection.dropIndex(indexName);
  }

  getCollectionIds(collectionName: string) {
    const getIdsQuery = `FOR doc IN ${collectionName} RETURN doc._id`;
    return this.executeQuery(getIdsQuery);
  }

  getCollectionKeys(collectionName: string) {
    const getKeysQuery = `FOR doc IN ${collectionName} RETURN doc._key`;
    return this.executeQuery(getKeysQuery);
  }

  getCollectionIndexes(collectionName: string) {
    const collection = this.collection(collectionName);
    return collection.indexes();
  }

  // validateQuery() { } already available

  executeQuery(query: string | C8QLLiteral, bindVars?: any, opts?: any) {
    return this.query(query, bindVars, opts).then((cursor) => cursor.all());
  }

  // explainQuery() { } already available

  getRunningQueries() {
    return this.getCurrentQueries();
  }

  killQuery(queryId: string) {
    return this.terminateRunningQuery(queryId);
  }

  createRestql(restqlName: string, value: string, parameter: any = {}) {
    return this.saveQuery(restqlName, parameter, value);
  }

  executeRestql(restqlName: string, bindVars: any = {}) {
    return this.executeSavedQuery(restqlName, bindVars);
  }

  updateRestql(restqlName: string, value: string, parameter: any = {}) {
    return this.updateSavedQuery(restqlName, parameter, value);
  }

  deleteRestql(restqlName: string) {
    return this.deleteSavedQuery(restqlName);
  }

  getRestqls() {
    return this.listSavedQueries();
  }

  getDcList() {
    return this.getTenantEdgeLocations();
  }

  getLocalDc() {
    return this.getLocalEdgeLocation();
  }

  createStream(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false
  ) {
    const stream = this.stream(streamName, local, isCollectionStream);
    return stream.createStream();
  }

  hasStream(streamName: string, local: boolean): Promise<boolean> {
    const topic = local ? `c8locals.${streamName}` : `c8globals.${streamName}`;

    // @VIKAS Cant we use any other api eg: /_api/streams/c8locals.test/stats
    // If 200 api exits else api does not exist

    return this.getStreams(!local).then(
      (res) => !!res.result.find((stream: any) => stream.topic === topic),
      (err) => {
        throw err.errorMessage;
      }
    );
  }

  getStream(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false
  ) {
    const stream = this.stream(streamName, local, isCollectionStream);
    return stream;
  }
  //getStreams() { } // already present
  getStreamStats(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false
  ) {
    const stream = this.stream(streamName, local, isCollectionStream);
    return stream.getStreamStatistics();
  }

  async createStreamProducer(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false,
    dcName: string,
    params: { [key: string]: any } = {}
  ) {
    const dcList = await this.getDcList();
    let dcUrl = dcList[0].dcInfo[0].tags.url;
    if (dcName) {
      dcUrl = dcName;
    }
    const otp = await this.getOtp();
    const stream = this.stream(streamName, local, isCollectionStream, otp);
    return stream.producer(dcUrl, params);
  }

  async createStreamReader(
    streamName: string,
    subscriptionName: string,
    local: boolean,
    isCollectionStream: boolean = false,
    dcName: string,
    params: { [key: string]: any } = {}
  ) {
    const dcList = await this.getDcList();
    let dcUrl = dcList[0].dcInfo[0].tags.url;
    if (dcName) {
      dcUrl = dcName;
    }
    const otp = await this.getOtp();
    const stream = this.stream(streamName, local, isCollectionStream, otp);
    return stream.consumer(subscriptionName, dcUrl, params);
  }

  async subscribe(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false,
    subscriptionName: string,
    dcName: string,
    params: { [key: string]: any } = {}
  ) {
    const dcList = await this.getDcList();
    let dcUrl = dcList[0].dcInfo[0].tags.url;
    if (dcName) {
      dcUrl = dcName;
    }
    const otp = await this.getOtp();
    const stream = this.stream(streamName, local, isCollectionStream, otp);
    return stream.consumer(subscriptionName, dcUrl, params);
  } // how is it same as create  web socket handler

  // unsubscribe(){} already available
  getStreamBacklog(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false
  ) {
    const stream = this.stream(streamName, local, isCollectionStream);
    return stream.backlog();
  }

  clearStreamBacklog(subscription: string) {
    return this.clearSubscriptionBacklog(subscription);
  }

  clearStreamsBacklog() {
    return this.clearBacklog();
  }

  getStreamSubscriptions(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false
  ) {
    const stream = this.stream(streamName, local, isCollectionStream);
    return stream.getSubscriptionList();
  }

  deleteStreamSubscription(
    streamName: string,
    subscription: string,
    local: boolean,
    isCollectionStream: boolean = false
  ) {
    const stream = this.stream(streamName, local, isCollectionStream);
    return stream.deleteSubscription(subscription);
  }

  // createStreamApp() { } already present
  validateStreamApp(appDefinition: string) {
    return this.validateStreamappDefinition(appDefinition);
  }

  retrieveStreamApp() {
    return this.getAllStreamApps();
  }

  deleteStreamApp(appName: string) {
    const streamApp = this.streamApp(appName);
    return streamApp.deleteApplication();
  }

  getStreamApp(appName: string) {
    const streamApp = this.streamApp(appName);
    return streamApp.retriveApplication();
  }

  getStreamAppSamples() {
    return this.getSampleStreamApps();
  }

  activateStreamApp(appName: string, active: boolean) {
    const streamApp = this.streamApp(appName);
    return streamApp.activateStreamApplication(active);
  }

  createGraph(graphName: string, properties: any = {}) {
    const graph = this.graph(graphName);
    return graph.create(properties);
  }

  deleteGraph(graphName: string, dropCollections: boolean) {
    const graph = this.graph(graphName);
    return graph.drop(dropCollections);
  }

  hasGraph(graphName: string) {
    const graph = this.graph(graphName);
    return graph.exists();
  }

  getGraph(graphName: string) {
    const graph = this.graph(graphName);
    return graph.get();
  }

  getGraphs() {
    return this.graphs();
  }

  insertEdge(graphName: string, definition: any) {
    const graph = this.graph(graphName);
    return graph.addEdgeDefinition(definition);
  }

  updateEdge(
    graphName: string,
    collectionName: string,
    documentHandle: DocumentHandle,
    newValue: any,
    opts: any = {}
  ) {
    const graph = this.graph(graphName);
    const graphEdgeCollection = graph.edgeCollection(collectionName);
    return graphEdgeCollection.update(documentHandle, newValue, opts);
  }

  replaceEdge(
    graphName: string,
    collectionName: string,
    documentHandle: DocumentHandle,
    newValue: any,
    opts: any = {}
  ) {
    const graph = this.graph(graphName);
    const graphEdgeCollection = graph.edgeCollection(collectionName);
    return graphEdgeCollection.replace(documentHandle, newValue, opts);
  }

  deleteEdge(
    graphName: string,
    collectionName: string,
    documentHandle: DocumentHandle,
    opts: any = {}
  ) {
    const graph = this.graph(graphName);
    const graphEdgeCollection = graph.edgeCollection(collectionName);
    return graphEdgeCollection.remove(documentHandle, opts);
  }

  async getEdges(graphName: string) {
    const graph = this.graph(graphName);
    const graphDetails = await graph.get();
    return graphDetails.edgeDefinitions;
  }

  linkEdge(
    graphName: string,
    collectionName: string,
    fromId: string | string[],
    toId: string | string[],
  ) {
    const graph = this.graph(graphName);
    return graph.create({
      edgeDefinitions: [{
        collection: collectionName,
        from: fromId,
        to: toId
      }]
    })
  }

  hasUser(userName: string, email: string = "") {
    const user = this.user(userName, email);
    return user.hasUser();
  }

  createUser(
    userName: string,
    email: string,
    passwd: string = "",
    active: boolean = true,
    extra: object = {}
  ) {
    const user = this.user(userName, email);
    return user.createUser(passwd, active, extra);
  }

  deleteUser(userName: string, email: string = "") {
    const user = this.user(userName, email);
    return user.deleteUser();
  }

  getUsers() {
    return this.getAllUsers();
  }

  getUser(userName: string, email: string = "") {
    const user = this.user(userName, email);
    return user.getUserDeatils();
  }

  updateUser(
    userName: string,
    email: string = "",
    data: object
  ) {
    const user = this.user(userName, email);
    return user.modifyUser(data);
  }

  replaceUser(
    userName: string,
    email: string = "",
    data: { active?: boolean; passwd: string; extra?: object }
  ) {
    const user = this.user(userName, email);
    return user.replaceUser(data);
  }

  getPermissions(
    userName: string,
    email: string = "",
    isFullRequested?: boolean
  ) {
    const user = this.user(userName, email);
    return user.getAllDatabases(isFullRequested);
  }

  getPermission(
    userName: string,
    email: string = "",
    databaseName: string,
    collectionName?: string
  ) {
    const user = this.user(userName, email);
    if (!!collectionName) {
      return user.getCollectionAccessLevel(databaseName, collectionName);
    }
    return user.getDatabaseAccessLevel(databaseName);
  }

  updatePermission(
    userName: string,
    email: string = "",
    fabricName: string,
    permission: "rw" | "ro" | "none",
    collectionName?: string
  ) {
    const user = this.user(userName, email);
    if (!!collectionName) {
      return user.setCollectionAccessLevel(
        fabricName,
        collectionName,
        permission
      );
    }
    return user.setDatabaseAccessLevel(fabricName, permission);
  }

  resetPermission(
    userName: string,
    email: string = "",
    fabricName: string,
    collectionName?: string
  ) {
    const user = this.user(userName, email);
    if (!!collectionName) {
      return user.clearCollectionAccessLevel(fabricName, collectionName);
    }
    return user.clearDatabaseAccessLevel(fabricName);
  }
}