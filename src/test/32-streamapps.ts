import { Fabric } from "../jsC8";

import { getDCListString } from "../util/helper";


import { expect } from "chai";


describe(" StreamApps ", function () {

    let fabric: Fabric;
    const testUrl: string =
        process.env.TEST_C8_URL || "https://test.macrometa.io";

    before(async () => {
        fabric = new Fabric({
            url: testUrl,
            c8Version: Number(process.env.C8_VERSION || 30400)
        });
        await fabric.login("guest@macrometa.io", "guest");
        fabric.useTenant("guest");
    });

    after(() => {
        fabric.close();
    });

    describe("fabric.createStreamApp", async () => {


        it("Should create a Stream Apllication", async () => {
            const response = await fabric.getAllEdgeLocations();
            let dcListAll = getDCListString(response)
            let dcList = dcListAll.split(",")

            let appDefinition = 
            `@App:name('Sample-Cargo-App')
                -- Stream
                define stream srcCargoStream (weight int);
                -- Table
                define table destCargoTable (weight int, totalWeight long);
                -- Data Processing
                @info(name='Query')
                select weight, sum(weight) as totalWeight
                from srcCargoStream
                insert into destCargoTable;`
            let resp = await fabric.createStreamApp(dcList, appDefinition)
            console.log(resp)
            expect(resp.error).to.be.false;

        });

    });

    describe("fabric.getAllStreamApps", () => {
        it("get all stream apps", async () => {
            let response = await fabric.getAllStreamApps()
            expect(response.error).to.be.false;

        })
    });

    describe("fabric.validateStreamappDefinition", () => {
        it("validate the streamapp definition", async () => {
            let appDefinition = 
            `@App:name('Sample-Cargo-App')
                -- Stream
                define stream srcCargoStream (weight int);
                -- Table
                define table destCargoTable (weight int, totalWeight long);
                -- Data Processing
                @info(name='Query')
                select weight, sum(weight) as totalWeight
                from srcCargoStream
                insert into destCargoTable;`
            let response = await fabric.validateStreamappDefinition(appDefinition)
            expect(response.error).to.be.false;
        })
    });

    describe("fabric.getSampleStreamApps", () => {
        it("get sample stream apps", async () => {
            let response = await fabric.getSampleStreamApps()
            expect(response.error).to.be.false;
        })
    });

    describe("streamapps.activateStreamApplication",  () => {
        it("Activate a stream App", async () => {
            const app = fabric.streamApp("Sample-Cargo-App")
            let response = await app.activateStreamApplication(true)
            expect(response.error).to.be.false;
        })
    });

    describe("streamapps.retriveApplication",  () => {
        it("Retrive a stream App", async () => {
            const app = fabric.streamApp("Sample-Cargo-App")
            let response = await app.retriveApplication()
            expect(response.error).to.be.false;
        })
    });

    describe("streamapps.updateApplication",  () => {
        it("Update a stream App", async () => {
            const resp = await fabric.getAllEdgeLocations();
            let dcListAll = getDCListString(resp)
            let dcList = dcListAll.split(",")
            let appdef = 
            `@App:name('Sample-Cargo-App')
                -- Stream
                define stream srcCargoStream (weight int);
                -- Table
                define table destCargoTable (weight int, totalWeight long);
                -- Data Processing
                @info(name='Query')
                select weight, sum(weight) as totalWeight
                from srcCargoStream
                insert into destCargoTable;`;
            const app = fabric.streamApp("Sample-Cargo-App")
            let response = await app.updateApplication(dcList, appdef)
            expect(response.error).to.be.false;
        })
    });

    
    describe("streamapps.deleteApplication",  () => {
        it("Delete a stream App", async () => {
            const app = fabric.streamApp("Sample-Cargo-App")
            let response = await app.deleteApplication()
            console.log(response)
            expect(response.error).to.be.false;
        })
    });

})