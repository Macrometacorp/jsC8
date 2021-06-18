import { expect } from "chai";
import { C8Client } from "../jsC8";

const C8_VERSION = Number(process.env.C8_VERSION || 30400);

describe("validating limits apis", function () {
    this.timeout(60000);

    let c8Client: C8Client;
    const testUrl: string =
        process.env.TEST_C8_URL || "https://test.macrometa.io";

    beforeEach(async () => {
        c8Client = new C8Client({
            url: testUrl,
            c8Version: C8_VERSION
        });

        await c8Client.login("guest@macrometa.io", "guest");
        c8Client.useTenant("guest");
    });

    afterEach(() => {
        c8Client.close();
    });


    const limits = {
        database: {
            maxDocumentSize: 409600,
            maxDocumentsReturnedByQuery: 1000,
            maxQueryExecutionTimeInMs: 10000,
            maxQueryMemoryBytes: 268435456,
            maxGeoFabricsPerTenant: 2,
            maxCollectionsPerFabric: 10,
            maxGraphsPerFabric: 10,
            maxIndexes: 10,
            maxViewsPerFabric: 10,
            maxRequestsPerDay: 5000,
            maxRequestPerMinute: 60,
            maxStoragePerRegion: 104857600,
            maxRestQLUsagePerFabric: 100,
            maxRestQLUsagePerDay: 100,
            maxStoredRestQL: 10
        },
        streamsLocal: {
            maxBacklogMessageTtlMin: 60,
            maxBacklogStorageSizeMB: 100,
            maxByteDispatchRatePerMin: 10,
            maxConsumersCount: 10,
            maxCount: 10,
            maxProducersCount: 10,
            maxSubscriptionsCount: 10
        },
        streamsGlobal: {
            maxBacklogMessageTtlMin: 60,
            maxBacklogStorageSizeMB: 100,
            maxByteDispatchRatePerMin: 10,
            maxConsumersCount: 10,
            maxCount: 10,
            maxProducersCount: 10,
            maxSubscriptionsCount: 10
        },
        compute: {
            maxNamespaceConfigmapsCount: 5,
            maxNamespaceEphimeralStorageMB: 50,
            maxNamespaceLimitsCpuMi: 50,
            maxNamespaceLimitsMemoryMB: 100,
            maxNamespacePodsCount: 5,
            maxNamespaceRequestsCpuMi: 300,
            maxNamespaceRequestsMemoryMB: 300,
            maxNamespaceSecretsCount: 5,
            maxNamespaceServicesCount: 5
        }
    }



    it("limits.getDefaultLimits", async () => {
        const response = await c8Client.Limits().getDefaultLimits();
        expect(response.result).to.deep.equal(limits);
    });

    it("limits.setDefaultLimits", async () => {
        const newLimits = {
            ...limits, database: {
                ...limits.database,
                maxDocumentSize: 309600
            }
        }
        const response = await c8Client.Limits().setDefaultLimits(newLimits);
        expect(response.result).to.deep.equal(newLimits);
    });

    it("limits.updateDefaultLimits", async () => {
        const newLimits = {
            ...limits, database: {
                ...limits.database,
                maxDocumentSize: 109600
            }
        }
        const response = await c8Client.Limits().updateDefaultLimits(newLimits);
        expect(response.result).to.deep.equal(newLimits);
    });

    it("limits.deleteDefaultLimits", async () => {
        const response = await c8Client.Limits().deleteDefaultLimits();
        expect(response.result).to.deep.equal(limits);
    });

    it("limits.getDefaultLimitsByServiceName", async () => {
        const response = await c8Client.Limits().getDefaultLimitsByServiceName('database');
        expect(response.result).to.deep.equal(limits.database);
    });

    it("limits.getLimitsFlag", async () => {
        const response = await c8Client.Limits().getLimitsFlag();
        expect(typeof response.result.value).to.equal('boolean');
    });

    it("limits.enableLimitsFlag", async () => {
        const response = await c8Client.Limits().enableLimitsFlag(true);
        expect(response.result.value).to.equal(true);
    });
});
