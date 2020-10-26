import { Connection } from "./connection";

export type SearchOptions = {
    viewName?: string;
    analyzerName?: string;
};

export type Properties = {
    links?: {
        [collectionName: string]: {
            analyzers?: [
                string
            ],
            fields?: object,
            includeAllFields?: boolean,
            storeValues?: string,
            trackListPositions?: boolean
        }
    }
}

export class Search {

    private _connection: Connection;
    _viewName: string;
    _analyzerName: string;

    viewUrlPrefix: string = "/_api/search/view";
    analyzerUrlPrefix: string = "/_api/search/analyzer";

    constructor(connection: Connection, searchOptions?: SearchOptions) {
        this._connection = connection;
        this._viewName = (searchOptions && searchOptions.viewName) || "";
        this._analyzerName = (searchOptions && searchOptions.analyzerName) || "";
    }

    setSearch(collectionName: string, enable: boolean, field: string) {
        return this._connection.request(
            {
                method: "POST",
                path: `/_api/search/collection/${collectionName}`,
                qs: {
                    enable,
                    field
                },
                absolutePath: true,
                body: {}
            },
            res => res.body
        );
    }

    searchInCollection(collection: string, search: string, bindVars: object = {}, ttl: number = 60) {
        return this._connection.request(
            {
                method: "POST",
                path: "/_api/search",
                body: {
                    collection,
                    search,
                    bindVars,
                    ttl
                },
                absolutePath: true
            },
            res => res.body
        );
    }

    getListOfViews() {
        return this._connection.request(
            {
                method: "GET",
                path: `${this.viewUrlPrefix}`,
                absolutePath: true
            },
            res => res.body
        );
    }

    createView(properties: Properties = {}) {
        return this._connection.request(
            {
                method: "POST",
                path: `${this.viewUrlPrefix}`,
                body: {
                    type: "search",
                    name: this._viewName,
                    properties
                },
                absolutePath: true
            },
            res => res.body
        );
    }

    getViewInfo() {
        return this._connection.request(
            {
                method: "GET",
                path: `${this.viewUrlPrefix}/${this._viewName}`,
                absolutePath: true
            },
            res => res.body
        );
    }

    renameView(name: string) {
        return this._connection.request(
            {
                method: "PUT",
                path: `${this.viewUrlPrefix}/${this._viewName}/rename`,
                absolutePath: true,
                body: {
                    name
                }
            },
            res => res.body
        );
    }

    deleteView() {
        return this._connection.request(
            {
                method: "DELETE",
                path: `${this.viewUrlPrefix}/${this._viewName}`,
                absolutePath: true
            },
            res => res.body
        );
    }

    getViewProperties() {
        return this._connection.request(
            {
                method: "GET",
                path: `${this.viewUrlPrefix}/${this._viewName}/properties`,
                absolutePath: true
            },
            res => res.body
        );
    }

    updateViewProperties(properties: Properties) {
        return this._connection.request(
            {
                method: "PUT",
                path: `${this.viewUrlPrefix}/${this._viewName}/properties`,
                absolutePath: true,
                body: properties
            },
            res => res.body
        );
    }

    getListOfAnalyzers() {
        return this._connection.request(
            {
                method: "GET",
                path: `${this.analyzerUrlPrefix}`,
                absolutePath: true
            },
            res => res.body
        );
    }

    createAnalyzer(type: string, properties?: object, features?: Array<string>) {
        return this._connection.request(
            {
                method: "POST",
                path: `${this.analyzerUrlPrefix}`,
                body: {
                    name: this._analyzerName,
                    type,
                    features,
                    properties
                },
                absolutePath: true
            },
            res => res.body
        );
    }
    
    getAnalyzerDefinition() {
        return this._connection.request(
            {
                method: "GET",
                path: `${this.analyzerUrlPrefix}/${this._analyzerName}`,
                absolutePath: true
            },
            res => res.body
        );
    }

    deleteAnalyzer(force: boolean = false) {
        return this._connection.request(
            {
                method: "DELETE",
                path: `${this.analyzerUrlPrefix}/${this._analyzerName}`,
                qs: {
                    force
                },
                absolutePath: true
            },
            res => res.body
        );
    }
}
