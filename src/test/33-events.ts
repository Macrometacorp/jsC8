import { expect } from "chai";
import { Fabric } from "../jsC8";
import { Status, ActionType, EntityType  } from '../event';

describe("Manipulating events", function() {
    this.timeout(50000);
  
    let fabric: Fabric;
    const testUrl: string =
      process.env.TEST_C8_URL || "https://qa1.eng1.macrometa.io";
  
    before(async () => {
      fabric = new Fabric({
        url: testUrl,
        c8Version: Number(process.env.C8_VERSION || 30400)
      });
      await fabric.login("_mm", "root", "Macrometa123!@#");
      fabric.useTenant("_mm");
      fabric.useFabric("_system");
    });
  
    after(() => {
      fabric.close();
    });
  
    describe("fabric.getEvents", () => {
      it("returns an empty array or an array of all events", async() => {
        const eventList = await fabric.getEvents();
        const initialCount = eventList.length;
        expect(eventList).to.be.an('array');
        const event = fabric.event("testEvent");
        await event.create({
            status: Status.OK,
            description: "description about the event",
            entityType: EntityType.GEOFABRIC,
            details: "additional details about the event",
            action: ActionType.CREATE,
            attributes: {},
        });
        const updatedEventList = await fabric.getEvents();
        expect(updatedEventList.length).to.equal(initialCount + 1);
      });
    });

    describe("fabric.deleteEvents", () => {
        it("deletes a single event or multiple events", async () => {
            const createRequest = {
                status: Status.OK,
                description: "description about the event",
                entityType: EntityType.GEOFABRIC,
                details: "additional details about the event",
                action: ActionType.CREATE,
                attributes: {},
            };
            const event1 = fabric.event("testEvent1");
            await event1.create(createRequest);
            const event2= fabric.event("testEvent2");
            await event2.create(createRequest);
            const event3 = fabric.event("testEvent3");
            await event3.create(createRequest);
            const updatedEventList = await fabric.getEvents();
            const updatedEventIds = updatedEventList.map(function(event: any){
                return event._key;
            })
            const singleEvent = updatedEventIds.slice(0,1);
            const multipleEvents = updatedEventIds.slice(1);
            await fabric.deleteEvents(singleEvent);
            const eventList = await fabric.getEvents();
            const numberOfEvents = updatedEventIds.length;
            expect(eventList.length).to.equal(numberOfEvents - 1);
            await fabric.deleteEvents(multipleEvents);
            const deletedList = await fabric.getEvents();
            expect(deletedList).to.be.an('array').that.is.empty;
        });
    });
  
    describe("event.create", () => {
        it("creates a new event", async () => {
            const event = fabric.event("testEvent");
            const initialEventsList = await fabric.getEvents();
            const initialEventsCount = initialEventsList.length;
            const response = await event.create({
                status: Status.OK,
                description: "description about the event",
                entityType: EntityType.GEOFABRIC,
                details: "additional details about the event",
                action: ActionType.CREATE,
                attributes: {},
            });
            const updatedEventList = await fabric.getEvents();
            const updatedEventsCount = updatedEventList.length;
            expect(updatedEventsCount).to.equal(initialEventsCount + 1);
            expect(response).to.be.an('object');
            expect(response).to.have.property('_id');
            expect(response).to.have.property('_key');
            expect(response).to.have.property('_rev');
        });
    });

    describe("event.details", () => {
        it("fetches the details of an existing event", async () => {
            const list = await fabric.getEvents();
            const eventId = list[0]._key;
            const event = fabric.event(null, eventId);
            const response = await event.details();
            expect(response).to.be.an('object');
            expect(response).to.have.property('_id');
            expect(response).to.have.property('_key');
            expect(response).to.have.property('_rev');
            expect(response).to.have.property('action');
            expect(response).to.have.property('attributes');
            expect(response).to.have.property('clusterID');
            expect(response).to.have.property('description');
            expect(response).to.have.property('details');
            expect(response).to.have.property('entityName');
            expect(response).to.have.property('entityType');
            expect(response).to.have.property('fabric');
            expect(response).to.have.property('status');
            expect(response).to.have.property('tenant');
            expect(response).to.have.property('timestamp');
            expect(response).to.have.property('user');
            expect(response).to.have.property('version');
        });
    });
});
  