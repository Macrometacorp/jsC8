interface Database {
    maxDocumentSize: number;
    maxDocumentsReturnedByQuery: number;
    maxQueryExecutionTimeInMs: number;
    maxQueryMemoryBytes: number;
    maxGeoFabricsPerTenant: number;
    maxCollectionsPerFabric: number;
    maxGraphsPerFabric: number;
    maxIndexes: number;
    maxViewsPerFabric: number;
    maxRequestsPerDay: number;
    maxRequestPerMinute: number;
    maxStoragePerRegion: number;
    maxRestQLUsagePerFabric: number;
    maxRestQLUsagePerDay: number;
}

interface StreamsLocal {
    maxBacklogMessageTtlMin: number;
    maxBacklogStorageSizeMB: number;
    maxByteDispatchRatePerMin: number;
    maxConsumersCount: number;
    maxCount: number;
    maxProducersCount: number;
    maxSubscriptionsCount: number;
}

interface StreamsGlobal {
    maxBacklogMessageTtlMin: number;
    maxBacklogStorageSizeMB: number;
    maxByteDispatchRatePerMin: number;
    maxConsumersCount: number;
    maxCount: number;
    maxProducersCount: number;
    maxSubscriptionsCount: number;
}

interface Compute {
    maxNamespaceConfigmapsCount: number;
    maxNamespaceEphimeralStorageMB: number;
    maxNamespaceLimitsCpuMi: number;
    maxNamespaceLimitsMemoryMB: number;
    maxNamespacePodsCount: number;
    maxNamespaceRequestsCpuMi: number;
    maxNamespaceRequestsMemoryMB: number;
    maxNamespaceSecretsCount: number;
    maxNamespaceServicesCount: number;
}

interface LimitsData {
    database: Database;
    streamsLocal: StreamsLocal;
    streamsGlobal: StreamsGlobal;
    compute: Compute;
}

type ServiceName = 'database' | 'streamsLocal' | 'streamsGlobal';


