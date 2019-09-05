import { expect } from "chai";
import { Fabric } from "../jsC8";

describe("Manipulating pipelines", function() {
    this.timeout(50000);
  
    let fabric: Fabric;
    const testUrl: string =
      process.env.TEST_C8_URL || "https://qa2.eng1.macrometa.io";
  
    before(async () => {
      fabric = new Fabric({
        url: testUrl,
        c8Version: Number(process.env.C8_VERSION || 30400)
      });
      await fabric.login("guest", "root", "guest");
      fabric.useTenant("guest");
      fabric.useFabric("_system");
          
    });
  
    after(() => {
      fabric.close();
    });
  
    describe("fabric.getAllPipelines", () => {
      it("returns an empty array or an array of all pipelines", async() => {
        const regions = ["qa2-asia-east1"];
        const isEnabled = false;
        const config = {
          "input": {
          "type": "c8db",
          "c8db": {
            "name": "collection_name1"
          }
        },
          "output": {
          "type": "c8streams",
          "c8streams": {
            "name": "stream_name1",
            "local": true
          }
        }
        };
        const allPipelines = await fabric.getPipelines();
        const pipelinesCount = allPipelines.length;
        expect(allPipelines).to.be.an('array');
        const pipeline = await fabric.pipeline('pipeline1');
        await pipeline.create(regions,isEnabled, config);
        const updatedAllPipelines = await fabric.getPipelines();
        const expectedPipelinesCount = pipelinesCount + 1;
        expect(updatedAllPipelines.length).to.equal(expectedPipelinesCount);
      });
    });
  
    describe("pipeline.create", () => {
        it("creates a new pipeline", async () => {
            const regions = ["qa2-asia-east1"];
            const isEnabled = false;
            const config = {
                "input": {
                    "type": "c8db",
                    "c8db": {
                        "name": "collection_name2"
                    }
                    },
                "output": {
                    "type": "c8streams",
                    "c8streams": {
                        "name": "stream_name2",
                        "local": true
                    }
                }
            };
            const pipeline = await fabric.pipeline('pipeline2');
            const response = await pipeline.create(regions,isEnabled, config);
            expect(response).to.equal('Stream Created Successfully');
        });
    });

    describe("pipeline.drop", () => {
        it("deletes an existing pipeline", async () => {
            const allPipelines = await fabric.getPipelines();
            const pipelineName = allPipelines[0].name;
            const pipelinesCount = allPipelines.length;
            const pipeline = await fabric.pipeline(pipelineName);
            await pipeline.drop();
            const updatedPipelines = await fabric.getPipelines();
            const updatedPipelinesCount = updatedPipelines.length;
            expect(updatedPipelinesCount).to.equal(pipelinesCount-1);

        });
    });

    describe("pipeline.details", () => {
        it("fetches the details of an existing pipeline", async () => {
            const allPipelines = await fabric.getPipelines();
            const pipelineName = allPipelines[0].name;
            const pipeline = await fabric.pipeline(pipelineName);
            const response = await pipeline.details();            
            expect(response).to.be.an('object');
            expect(response).to.have.property('name');
            expect(response).to.have.property('regions');
            expect(response).to.have.property('enabled');
            expect(response).to.have.property('config');
        });
    });

    describe("pipeline.update", () => {
        it("updates an existing pipeline", async () => {
            const allPipelines = await fabric.getPipelines();
            const pipelineName = allPipelines[0].name;
            const pipeline = await fabric.pipeline(pipelineName);
            const response = await pipeline.details();
            const { regions, enabled: isEnabled, config } = response;
            const enabled = !isEnabled;
            const updatedMessage = await pipeline.update(regions, enabled, config);
            expect(updatedMessage).to.equal('Stream Updated Successfully');
            const updatedPipeline = await fabric.pipeline(pipelineName);
            const { enabled: updatedEnabledValue } = await updatedPipeline.details();
            expect(updatedEnabledValue).to.not.equal(isEnabled);
            expect(updatedEnabledValue).to.equal(enabled);
        });
    });
});
  