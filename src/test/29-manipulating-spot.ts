import { expect } from "chai";
import { Fabric } from "../jsC8";
import { EdgeLocation } from "../fabric";

describe("manipulating spot", () => {
    let fabric: Fabric;
    let localLocation: EdgeLocation;
    let name: string;
    const testUrl: string = process.env.TEST_C8_URL || "https://default.dev.macrometa.io";

    before(async () => {
        fabric = new Fabric({
            url: testUrl,
            c8Version: Number(process.env.C8_VERSION || 30400)
        });

        localLocation = await fabric.getLocalEdgeLocation();
        name = localLocation.name;
    });

    after(() => {
        fabric.close();
    });

    describe("spot_region status of a region", async function () {

        it('should change the spot_region of a region', async () => {
            const currentSpotStatus = localLocation.spot_region;
            await fabric.changeEdgeLocationSpotStatus(name, !currentSpotStatus);
            const changedLocation = await fabric.getLocalEdgeLocation();
            const changedSpotStatus = changedLocation.spot_region;
            expect(changedLocation).to.equal(!changedSpotStatus);
        });

        it("should not change the spot_region to false if a fabric's spot primary is that region");

    });

    describe("spot fabric", () => {
        let fabricName = `Fabric_${Date.now()}`;
        after(() => {
            fabric.dropFabric(fabricName);
        });
        it("should create a fabric with a spot primary region", async () => {

            await fabric.changeEdgeLocationSpotStatus(name, true);

            const options = {
                dcList: name,
                spotDc: name
            };
            const response = await fabric.createFabric(fabricName, undefined, options);
            expect(response.error).to.be.false;
        });
        it("should change the spot primary region of a fabric");
    });

    describe("spot collection", async () => {
        it("should create a spot document collection");
        it("should create a spot edge collection");
        describe("mapulating spot collection's region", () => {
            it("should change the spot region of a spot collection to none");
            it("should change the spot region of a spot collection to some other region");
        });
    });
});