import { expect } from "chai";
import { Fabric } from "../jsC8";
import { getDCListString } from "../util/helper";

describe("Manipulating pipelines", function () {
  this.timeout(50000);

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
    fabric.useFabric("_system");
  });

  after(() => {
    fabric.close();
  });

  describe("fabric.getAllPipelines", () => {
    it("returns an empty array or an array of all pipelines", async () => {
      const dcList = await fabric.getAllEdgeLocations();
      const regions = getDCListString(dcList).split(',');
      const isEnabled = false;
      const config = {
        "input": {
          "type": "c8db",
          "c8db": {
            "name": "collection_namepl1"
          }
        },
        "output": {
          "type": "c8streams",
          "c8streams": {
            "name": "stream_namepl1",
            "local": true
          }
        }
      };
      const result = await fabric.getPipelines();
      const allPipelines = result.result;
      const pipelinesCount = allPipelines.length;
      expect(allPipelines).to.be.an('array');
      const pipeline = fabric.pipeline('testPipeline');
      await pipeline.create(regions, isEnabled, config);
      const updatedResult = await fabric.getPipelines();
      const updatedAllPipelines = updatedResult.result;
      const expectedPipelinesCount = pipelinesCount + 1;
      expect(updatedAllPipelines.length).to.equal(expectedPipelinesCount);
    });
  });

  describe("pipeline.create", () => {
    it("creates a new pipeline", async () => {
      const dcList = await fabric.getAllEdgeLocations();
      const regions = getDCListString(dcList).split(',');
      const isEnabled = false;
      const config = {
        "input": {
          "type": "c8db",
          "c8db": {
            "name": "collection_namepl2"
          }
        },
        "output": {
          "type": "c8streams",
          "c8streams": {
            "name": "stream_namepl2",
            "local": true
          }
        }
      };
      const pipeline = fabric.pipeline('testPipeline2');
      const response = await pipeline.create(regions, isEnabled, config);
      expect(response.error).to.be.false;
    });
  });

  describe("pipeline.drop", () => {
    it("deletes an existing pipeline", async () => {
      const resultObject = await fabric.getPipelines();
      const allPipelines = resultObject.result;
      const pipelineName = allPipelines[0].name;
      const pipelinesCount = allPipelines.length;
      const pipeline = fabric.pipeline(pipelineName);
      await pipeline.drop();
      const updatedResultObject = await fabric.getPipelines();
      const updatedPipelines = updatedResultObject.result;
      const updatedPipelinesCount = updatedPipelines.length;
      expect(updatedPipelinesCount).to.equal(pipelinesCount - 1);

    });
  });

  describe("pipeline.details", () => {
    it("fetches the details of an existing pipeline", async () => {
      const resultObject = await fabric.getPipelines();
      const allPipelines = resultObject.result;
      const pipelineName = allPipelines[0].name;
      const pipeline = fabric.pipeline(pipelineName);
      const response = await pipeline.details();
      const result = response.result;
      expect(result).to.be.an('object');
      expect(result).to.have.property('name');
      expect(result).to.have.property('regions');
      expect(result).to.have.property('enabled');
      expect(result).to.have.property('config');
    });
  });

  describe("pipeline.update", () => {
    it("updates an existing pipeline", async () => {
      const resultObject = await fabric.getPipelines();
      const allPipelines = resultObject.result;
      const pipelineName = allPipelines[0].name;
      const pipeline = fabric.pipeline(pipelineName);
      const response = await pipeline.details();
      const { regions, enabled: isEnabled, config } = response.result;
      const toggleEnabled = !isEnabled;
      const updatedResultObject = await pipeline.update(regions, toggleEnabled, config);
      expect(updatedResultObject.error).to.be.false;
      const updatedPipeline = fabric.pipeline(pipelineName);
      const detailsObject = await updatedPipeline.details();
      const { enabled: updatedEnabledValue } = detailsObject.result;
      expect(updatedEnabledValue).to.not.equal(isEnabled);
      expect(updatedEnabledValue).to.equal(toggleEnabled);
    });
  });
});
