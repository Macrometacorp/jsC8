import { Connection } from "./connection";

export const enum Status {
    OK = 'OK',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export const enum EntityType {
    COLLECTION = 'COLLECTION',
    GRAPH = 'GRAPH',
    PIPELINE = 'PIPELINE',
    AUTH = 'AUTH',
    STREAM = 'STREAM',
    GEOFABRIC = 'GEOFABRIC',
}

export const enum ActionType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    EXECUTE = 'EXECUTE',
    LOGIN = 'LOGIN',
}

export interface IEventCreateRequest {
    status: Status;
    description: string;
    entityType: EntityType;
    details: string;
    action: ActionType;
    attributes: object;
}

export class Event {

    _connection: Connection;
    entityName: string | null;
    eventId?: number;

    constructor(connection: Connection, entityName: string | null, eventId?: number) {
        this._connection = connection;
        this.entityName = entityName;
        this.eventId =eventId;
    }

    create(requestObject: IEventCreateRequest) {
        const { status, description, entityType, details, action, attributes} = requestObject;

        return this._connection.request(
            {
                method: "POST",
                path: "/events",
                body: {
                    status,
                    description,
                    entityName: this.entityName,
                    entityType,
                    details,
                    action,
                    attributes,
                }
            },
            res => res.body
        );
    }

    details(eventId: number) {
        return this._connection.request(
            {
                method: "GET",
                path: `/events/${eventId}`,
            },
            res => res.body
        );
    }
}