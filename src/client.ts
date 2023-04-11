import { Config } from "./connection";
import { Fabric } from "./fabric";
import {
  DocumentHandle,
  DocumentsHandle,
  DocumentSaveOptions,
  CollectionUpdateProperties,
  CollectionCreateProperties,
} from "./collection";
import { C8QLLiteral } from "./c8ql-query";
import {
  KeyValue,
  KVCreateOptsObj,
  KVPairHandle,
  KVValueOptsObj,
} from "./keyValue";
import { ApiKeyAttributesType, ApiKeys, validateApiKeyHandle } from "./apiKeys";
import { Search, SearchOptions, LinksType, PrimarySortFields } from "./search";
import { AccountDetails, Billing } from "./billing";
import { CollectionParams, ImportAndExport } from "./importandexport";
import { CreateTenant, ModifyTenant } from "./tenant";
import { UserAttributesType } from "./user";
import { Stream } from "./stream";
import { Graph } from "./graph";
import { parseCSVToJSON } from "./util/parseCsv";
import { Redis } from "./redis";
import { Function } from "./function";
import { Integrations } from "./integrations";
import { Transformations } from "./transformations";
import { Connectors } from "./connectors";

export class C8Client extends Fabric {
  redis: Redis;
  function: Function;
  integrations: Integrations;
  transformations: Transformations;
  connectors: Connectors;

  constructor(config: Config) {
    super(config);
    this.redis = new Redis(config);
    this.function = new Function(config);
    this.integrations = new Integrations(config);
    this.transformations = new Transformations(config);
    this.connectors = new Connectors(config);
  }

  useApiKeyAuth(apikey: string): this {
    this._connection.setHeader("authorization", `apikey ${apikey}`);
    return this;
  }

  async loginWithToken(jwt: string) {
    this.useBearerAuth(jwt);
    const { error, errorMessage, result } = await this.validateApiKey({ jwt });
    if (error) {
      throw new Error(errorMessage);
    } else {
      const { tenant } = result;
      this.useTenant(tenant);
    }
  }

  async loginWithApiKey(apikey: string) {
    this.useApiKeyAuth(apikey);
    const { error, errorMessage, result } = await this.validateApiKey({
      apikey,
    });
    if (error) {
      throw new Error(errorMessage);
    } else {
      const { tenant } = result;
      this.useTenant(tenant);
    }
  }

  createCollection(
    collectionName: string,
    properties?: CollectionCreateProperties,
    isEdge: boolean = false
  ) {
    let collection;
    if (isEdge) {
      collection = this.edgeCollection(collectionName);
    } else {
      collection = this.collection(collectionName);
    }
    return collection.create(properties);
  }

  updateCollectionProperties(
    collectionName: string,
    properties: CollectionUpdateProperties
  ) {
    if (Object.keys(properties).length === 0) {
      throw new Error("Properties can not be empty.");
    }
    const collection = this.collection(collectionName);
    return collection.updateCollectionProperties(properties);
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
    const localDcDetails = await this.getLocalDc();
    let dcUrl = localDcDetails.tags.url;
    if (dcName) {
      dcUrl = dcName;
    }
    const collection = this.collection(collectionName);
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
    file: string | File,
    opts?: DocumentSaveOptions | boolean
  ) {
    const data = await parseCSVToJSON(file);
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
    opts?: any
  ) {
    const collection = this.collection(collectionName);
    return collection.createFulltextIndex(fields, opts);
  }

  addTtlIndex(
    collectionName: string,
    fields: string[] | string,
    expireAfter: number,
    name?: string
  ) {
    const collection = this.collection(collectionName);
    return collection.createTtlIndex(fields, expireAfter, name);
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

  hasStream(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false
  ): Promise<boolean> {
    let topic = streamName;

    if (
      !isCollectionStream &&
      !streamName.includes("c8locals") &&
      !streamName.includes("c8globals")
    ) {
      topic = local ? `c8locals.${streamName}` : `c8globals.${streamName}`;
    }

    // @VIKAS Cant we use any other api eg: /_api/streams/c8locals.test/stats
    // If 200 api exits else api does not exist

    return this.getStreams(!local).then(
      (res) => !!res.result.find((stream: any) => stream.topic === topic),
      (err) => {
        throw err;
      }
    );
  }

  getStream(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false
  ): Stream {
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
    const localDcDetails = await this.getLocalDc();
    let dcUrl = localDcDetails.tags.url;
    if (dcName) {
      dcUrl = dcName;
    }
    const stream = this.stream(streamName, local, isCollectionStream);
    const otp = await stream.getOtp();
    return stream.producer(dcUrl, { ...params, otp });
  }

  async createStreamReader(
    streamName: string,
    subscriptionName: string,
    local: boolean,
    isCollectionStream: boolean = false,
    dcName: string,
    params: { [key: string]: any } = {}
  ) {
    const localDcDetails = await this.getLocalDc();
    let dcUrl = localDcDetails.tags.url;
    if (dcName) {
      dcUrl = dcName;
    }
    const stream = this.stream(streamName, local, isCollectionStream);
    const otp = await stream.getOtp();
    return stream.consumer(subscriptionName, dcUrl, { ...params, otp });
  }

  async subscribe(
    streamName: string,
    local: boolean,
    isCollectionStream: boolean = false,
    subscriptionName: string,
    dcName: string,
    params: { [key: string]: any } = {}
  ) {
    const localDcDetails = await this.getLocalDc();
    let dcUrl = localDcDetails.tags.url;
    if (dcName) {
      dcUrl = dcName;
    }
    const stream = this.stream(streamName, local, isCollectionStream);
    const otp = await stream.getOtp();
    return stream.consumer(subscriptionName, dcUrl, { ...params, otp });
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
    return stream.deleteSubscriptions(subscription);
  }

  deleteStream(streamName: string, force: boolean = true) {
    const stream = this.stream(streamName);
    return stream.deleteStream(force);
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

  //------------ Graph ----------
  getGraphs(): Promise<Graph[]> {
    return this.graphs();
  }

  createGraph(graphName: string, properties: any = {}) {
    const graph = this.graph(graphName);
    return graph.create(properties);
  }

  deleteGraph(graphName: string, dropCollections: boolean) {
    const graph = this.graph(graphName);
    return graph.drop(dropCollections);
  }

  getGraph(graphName: string) {
    const graph = this.graph(graphName);
    return graph.get();
  }

  hasGraph(graphName: string) {
    const graph = this.graph(graphName);
    return graph.exists();
  }

  async getEdges(graphName: string) {
    const graph = this.graph(graphName);
    const graphDetails = await graph.get();
    return graphDetails.edgeDefinitions;
  }

  insertEdge(graphName: string, definition: any) {
    const graph = this.graph(graphName);
    return graph.addEdgeDefinition(definition);
  }

  removeEdgeDefinition(graphName: string, edgeCollectionName: string) {
    const graph = this.graph(graphName);
    return graph.removeEdgeDefinition(edgeCollectionName);
  }

  getEdge(
    graphName: string,
    collectionName: string,
    documentHandle: DocumentHandle,
    opts: any = {}
  ) {
    const graph = this.graph(graphName);
    const graphEdgeCollection = graph.edgeCollection(collectionName);
    return graphEdgeCollection.document(documentHandle, opts);
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

  linkEdge(
    graphName: string,
    collectionName: string,
    fromId: string | string[],
    toId: string | string[]
  ) {
    const graph = this.graph(graphName);
    return graph.create({
      edgeDefinitions: [
        {
          collection: collectionName,
          from: fromId,
          to: toId,
        },
      ],
    });
  }

  addEdgeToEdgeCollection(
    graphName: string,
    collectionName: string,
    properties: any = {},
    returnNew: boolean = false
  ) {
    const graph = this.graph(graphName);
    return graph.addEdgeToEdgeCollection(collectionName, properties, returnNew);
  }

  async listVertexCollections(graphName: string) {
    const graph = this.graph(graphName);
    return graph.listVertexCollections();
  }

  async addVertexCollection(graphName: string, collectionName: string) {
    const graph = this.graph(graphName);
    return graph.addVertexCollection(collectionName);
  }

  async removeVertexCollection(
    graphName: string,
    collectionName: string,
    dropCollection: boolean = false
  ) {
    const graph = this.graph(graphName);
    return graph.removeVertexCollection(collectionName, dropCollection);
  }

  addVertexToVertexCollection(
    graphName: string,
    collectionName: string,
    properties: any = {},
    returnNew: boolean = false
  ) {
    const graph = this.graph(graphName);
    return graph.addVertexToVertexCollection(
      collectionName,
      properties,
      returnNew
    );
  }

  removeVertexFromVertexCollection(
    graphName: string,
    collectionName: string,
    documentHandle: DocumentHandle,
    opts: any = {}
  ) {
    const graph = this.graph(graphName);
    return graph.vertexCollection(collectionName).remove(documentHandle, opts);
  }

  getVertexFromVertexCollection(
    graphName: string,
    collectionName: string,
    documentHandle: DocumentHandle,
    opts: any = {}
  ) {
    const graph = this.graph(graphName);
    return graph
      .vertexCollection(collectionName)
      .document(documentHandle, opts);
  }

  updateVertexFromVertexCollection(
    graphName: string,
    collectionName: string,
    documentHandle: DocumentHandle,
    newValue: any,
    opts: any = {}
  ) {
    const graph = this.graph(graphName);
    return graph
      .vertexCollection(collectionName)
      .update(documentHandle, newValue, opts);
  }

  replaceVertexFromVertexCollection(
    graphName: string,
    collectionName: string,
    documentHandle: DocumentHandle,
    newValue: any,
    opts: any = {}
  ) {
    const graph = this.graph(graphName);
    return graph
      .vertexCollection(collectionName)
      .replace(documentHandle, newValue, opts);
  }

  //------------ User ----------
  hasUser(userName: string) {
    const user = this.user(userName);
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

  deleteUser(userName: string) {
    const user = this.user(userName);
    return user.deleteUser();
  }

  getUsers() {
    return this.getAllUsers();
  }

  getUser(userName: string) {
    const user = this.user(userName);
    return user.getUserDeatils();
  }

  updateUser(
    userName: string,
    data: { active?: boolean; passwd: string; extra?: object }
  ) {
    const user = this.user(userName);
    return user.modifyUser(data);
  }

  replaceUser(
    userName: string,
    data: { active?: boolean; passwd: string; extra?: object }
  ) {
    const user = this.user(userName);
    return user.replaceUser(data);
  }

  getPermissions(userName: string, isFullRequested?: boolean) {
    const user = this.user(userName);
    return user.getAllDatabases(isFullRequested);
  }

  getPermission(
    userName: string,
    databaseName: string,
    collectionName?: string
  ) {
    const user = this.user(userName);
    if (!!collectionName) {
      return user.getCollectionAccessLevel(databaseName, collectionName);
    }
    return user.getDatabaseAccessLevel(databaseName);
  }

  updatePermission(
    userName: string,
    fabricName: string,
    permission: "rw" | "ro" | "none",
    collectionName?: string
  ) {
    const user = this.user(userName);
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
    fabricName: string,
    collectionName?: string
  ) {
    const user = this.user(userName);
    if (!!collectionName) {
      return user.clearCollectionAccessLevel(fabricName, collectionName);
    }
    return user.clearDatabaseAccessLevel(fabricName);
  }

  //------------ User Attributes ----------

  getUserAttributes(userName: string) {
    const user = this.user(userName);
    return user.getUserAttributes();
  }

  deleteUserAttribute(userName: string, attributeId: string) {
    const user = this.user(userName);
    return user.deleteUserAttribute(attributeId);
  }

  createUpdateUserAttributes(userName: string, data: UserAttributesType) {
    const user = this.user(userName);
    return user.createUpdateUserAttributes(data);
  }

  //--------------- Key Value ---------------

  keyValue(collectionName: string): KeyValue {
    return new KeyValue(this._connection, collectionName);
  }

  getKVCollections() {
    const keyValueColl = this.keyValue("");
    return keyValueColl.getCollections();
  }

  getKVCount(collectionName: string) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.getKVCount();
  }

  getKVKeys(collectionName: string, opts?: any) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.getKVKeys(opts);
  }

  getValueForKey(collectionName: string, key: string) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.getValueForKey(key);
  }

  createKVCollection(collectionName: string, opts?: KVCreateOptsObj) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.createCollection(opts);
  }

  insertKVPairs(collectionName: string, keyValuePairs: KVPairHandle[]) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.insertKVPairs(keyValuePairs);
  }

  deleteEntryForKey(collectionName: string, key: string) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.deleteEntryForKey(key);
  }

  deleteEntryForKeys(collectionName: string, keys: string[]) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.deleteEntryForKeys(keys);
  }

  deleteKVCollection(collectionName: string) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.deleteCollection();
  }

  getKVCollectionValues(
    collectionName: string,
    keys: string[],
    opts?: KVValueOptsObj
  ) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.getKVCollectionValues(keys, opts);
  }

  truncateKVCollectionByName(collectionName: string) {
    const keyValueColl = this.keyValue(collectionName);
    return keyValueColl.truncateKVCollectionByName();
  }

  //--------------- Api keys ---------------

  apiKeys(keyid: string = "", dbName: string = ""): ApiKeys {
    return new ApiKeys(this._connection, keyid, dbName);
  }

  validateApiKey(data: validateApiKeyHandle) {
    const apiKeys = this.apiKeys();
    return apiKeys.validateApiKey(data);
  }

  createApiKey(keyid: string) {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.createApiKey();
  }

  getAvailableApiKeys() {
    const apiKeys = this.apiKeys();
    return apiKeys.getAvailableApiKeys();
  }

  getAvailableApiKey(keyid: string) {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.getAvailableApiKey();
  }

  removeApiKey(keyid: string) {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.removeApiKey();
  }

  // ----------------------------------
  listAccessibleDatabases(keyid: string, full?: boolean) {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.listAccessibleDatabases(full);
  }

  getDatabaseAccessLevel(keyid: string, dbName: string) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.getDatabaseAccessLevel();
  }

  clearDatabaseAccessLevel(keyid: string, dbName: string) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.clearDatabaseAccessLevel();
  }

  setDatabaseAccessLevel(
    keyid: string,
    dbName: string,
    permission: "rw" | "ro" | "none"
  ) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.setDatabaseAccessLevel(permission);
  }

  // ----------------------------------
  listAccessibleCollections(keyid: string, dbName: string, full?: boolean) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.listAccessibleCollections(full);
  }

  getCollectionAccessLevel(
    keyid: string,
    dbName: string,
    collectionName: string
  ) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.getCollectionAccessLevel(collectionName);
  }

  clearCollectionAccessLevel(
    keyid: string,
    dbName: string,
    collectionName: string
  ) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.clearCollectionAccessLevel(collectionName);
  }

  setCollectionAccessLevel(
    keyid: string,
    dbName: string,
    collectionName: string,
    permission: "rw" | "ro" | "none"
  ) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.setCollectionAccessLevel(collectionName, permission);
  }

  // ----------------------------------
  listAccessibleStreams(keyid: string, dbName: string, full?: boolean) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.listAccessibleStreams(full);
  }

  getStreamAccessLevel(keyid: string, dbName: string, streamName: string) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.getStreamAccessLevel(streamName);
  }

  clearStreamAccessLevel(keyid: string, dbName: string, streamName: string) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.clearStreamAccessLevel(streamName);
  }

  setStreamAccessLevel(
    keyid: string,
    dbName: string,
    streamName: string,
    permission: "rw" | "ro" | "none" | "wo"
  ) {
    const apiKeys = this.apiKeys(keyid, dbName);
    return apiKeys.setStreamAccessLevel(streamName, permission);
  }

  // ----------------------------------
  getBillingAccessLevel(keyid: string) {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.getBillingAccessLevel();
  }

  clearBillingAccessLevel(keyid: string) {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.clearBillingAccessLevel();
  }

  setBillingAccessLevel(keyid: string, permission: "rw" | "ro" | "none") {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.setBillingAccessLevel(permission);
  }

  // ----------------------------------------

  createUpdateApikeyAttributes(keyid: string, data: ApiKeyAttributesType) {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.createUpdateApikeyAttributes(data);
  }

  getApikeyAttributes(keyid: string) {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.getApikeyAttributes();
  }

  deleteApikeyAttribute(keyid: string, attributeId: string) {
    const apiKeys = this.apiKeys(keyid);
    return apiKeys.deleteApikeyAttribute(attributeId);
  }

  //--------------- Search ---------------

  search(searchOptions?: SearchOptions) {
    return new Search(this._connection, searchOptions);
  }

  setSearch(collectionName: string, enable: boolean, field: string) {
    const search = this.search();
    return search.setSearch(collectionName, enable, field);
  }

  searchInCollection(
    collectionName: string,
    searchString: string,
    bindVars?: object,
    ttl?: number
  ) {
    const search = this.search();
    return search.searchInCollection(
      collectionName,
      searchString,
      bindVars,
      ttl
    );
  }

  getListOfViews() {
    const search = this.search();
    return search.getListOfViews();
  }

  createView(
    viewName: string,
    links?: LinksType,
    primarySort?: Array<PrimarySortFields>
  ) {
    const search = this.search({ viewName });
    return search.createView(links, primarySort);
  }

  getViewInfo(viewName: string) {
    const search = this.search({ viewName });
    return search.getViewInfo();
  }

  renameView(viewName: string, newName: string) {
    const search = this.search({ viewName });
    return search.renameView(newName);
  }

  deleteView(viewName: string) {
    const search = this.search({ viewName });
    return search.deleteView();
  }

  getViewProperties(viewName: string) {
    const search = this.search({ viewName });
    return search.getViewProperties();
  }

  updateViewProperties(viewName: string, properties: LinksType) {
    const search = this.search({ viewName });
    return search.updateViewProperties(properties);
  }

  getListOfAnalyzers() {
    const search = this.search();
    return search.getListOfAnalyzers();
  }

  // Creation of custom analyzer is not available at this moment
  // createAnalyzer(
  //   analyzerName: string,
  //   type: string,
  //   properties?: object,
  //   features?: Array<string>
  // ) {
  //   const search = this.search({ analyzerName });
  //   return search.createAnalyzer(type, properties, features);
  // }

  // Creation of custom analyzer is not available at this moment
  // deleteAnalyzer(analyzerName: string, force?: boolean) {
  //   const search = this.search({ analyzerName });
  //   return search.deleteAnalyzer(force);
  // }

  getAnalyzerDefinition(analyzerName: string) {
    const search = this.search({ analyzerName });
    return search.getAnalyzerDefinition();
  }

  /** billing apis starts from here */

  billing(tenantName: string) {
    return new Billing(this._connection, tenantName);
  }

  getAccountDetails(tenantName: string) {
    const billing = this.billing(tenantName);
    return billing.getAccountDetails();
  }

  updateAccountDetails(tenantName: string, accountDetails: AccountDetails) {
    const billing = this.billing(tenantName);
    return billing.updateAccountDetails(accountDetails);
  }

  updatePaymentSettings(tenantName: string, paymentMethodId: string) {
    const billing = this.billing(tenantName);
    return billing.updatePaymentSettings(paymentMethodId);
  }

  getPaymentDetailsOfPreviousMonths(tenantName: string, limit: number) {
    const billing = this.billing(tenantName);
    return billing.getPaymentDetailsOfPreviousMonths(limit);
  }

  getInvoices(tenantName: string, limit: number) {
    const billing = this.billing(tenantName);
    return billing.getInvoices(limit);
  }

  getCurrentInvoices(tenantName: string) {
    const billing = this.billing(tenantName);
    return billing.getCurrentInvoices();
  }

  getInvoiceOfSpecificMonthYear(
    tenantName: string,
    year: number,
    month: number
  ) {
    if (!(month > 0 && month <= 12)) {
      throw new Error("Please provide valid month");
    }
    const billing = this.billing(tenantName);
    return billing.getInvoiceOfSpecificMonthYear(year, month);
  }

  getUsageOfTenant(tenantName: string, startDate?: string, endDate?: string) {
    const billing = this.billing(tenantName);
    return billing.getUsageOfTenant(startDate, endDate);
  }

  getUsageOfTenantForSpecificRegion(
    tenantName: string,
    region: string,
    startDate?: string,
    endDate?: string
  ) {
    const billing = this.billing(tenantName);
    return billing.getUsageOfTenantForSpecificRegion(
      region,
      startDate,
      endDate
    );
  }

  /** billing apis ends here */

  /**export and import apis starts from here */

  importAndExport(collectionName: string = "") {
    return new ImportAndExport(this._connection, collectionName);
  }

  exportDataByQuery(query: string, bindVars?: Record<string, any>) {
    const importAndExport = this.importAndExport();
    return importAndExport.exportDataByQuery(query, bindVars);
  }

  exportDataByCollectionName(
    collectionName: string,
    params: CollectionParams = {}
  ) {
    const importAndExport = this.importAndExport(collectionName);
    return importAndExport.exportDataByCollectionName(params);
  }

  importDocuments(
    collectionName: string,
    data: Array<Record<string, any>>,
    showErrors: boolean,
    primaryKey: string,
    replace: boolean = false
  ) {
    const importAndExport = this.importAndExport(collectionName);
    return importAndExport.importDocuments(
      data,
      showErrors,
      primaryKey,
      replace
    );
  }

  /**export and import apis ends */

  //--------------- Tenant ---------------

  createTenant(
    email: string,
    passwd: string,
    plan: string,
    attribution: string,
    dcList: string,
    otherParams: CreateTenant = {}
  ) {
    if (!email) {
      throw new Error("Please provide email.");
    }

    if (!plan) {
      throw new Error("Please provide plan.");
    }

    if (!attribution) {
      throw new Error("Please provide attribution.");
    }

    if (!dcList) {
      throw new Error("Please provide dcList.");
    }

    const tenant = this.tenant(email);

    return tenant.createTenant(passwd, plan, attribution, dcList, otherParams);
  }

  dropTenant(tenantEmail: string) {
    if (!tenantEmail) {
      throw new Error("Please provide valid email.");
    }

    const tenant = this.tenant(tenantEmail);

    return tenant.dropTenant();
  }

  tenantDetails(tenantEmail: string) {
    if (!tenantEmail) {
      throw new Error("Please provide valid email.");
    }

    const tenant = this.tenant(tenantEmail);

    return tenant.tenantDetails();
  }

  updateTenant(tenantEmail: string, modifyTenant: ModifyTenant) {
    if (!tenantEmail) {
      throw new Error("Please provide valid email.");
    }

    const tenant = this.tenant(tenantEmail);

    return tenant.modifyTenant(modifyTenant);
  }

  getDCListByTenantName(tenantEmail: string) {
    if (!tenantEmail) {
      throw new Error("Please provide valid email.");
    }

    const tenant = this.tenant(tenantEmail);

    return tenant.getTenantEdgeLocations();
  }
}
