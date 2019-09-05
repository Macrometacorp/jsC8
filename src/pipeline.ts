import { Connection } from "./connection";

export class Pipeline {

    _connection: Connection;
    name: string;

    constructor(connection: Connection, pipelineName: string) {
        this._connection = connection;
        this.name = pipelineName;
    }

    create(regions: Array<string>, enabled: boolean = true, config: object = {}) {
        return this._connection.request(
            {
                method: "POST",
                path: "/pipeline",
                body: {
                    name: this.name,
                    regions,
                    enabled,
                    config,
                }
            },
            res => res.body
        );
    }

    drop() {
        return this._connection.request(
            {
                method: "DELETE",
                path: `/pipeline/${this.name}`,
            },
            res => res.body
        );
    }

    details() {
        return this._connection.request(
            {
                method: "GET",
                path: `/pipeline/${this.name}`,
            },
            res => res.body
        );
    }

    update(regions: Array<string>, enabled: boolean = true, config: object = {}) {
        return this._connection.request(
            {
                method: "PUT",
                path: `/pipeline/${this.name}`,
                body: {
                    name: this.name,
                    regions,
                    enabled,
                    config,
                }
            },
            res => res.body
        );
    }
}