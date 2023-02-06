import { Connection } from "./connection";

export type SearchOptions = {
    viewName?: string;
    analyzerName?: string;
};

export type PrimarySortFields = {
    field?: string;
    asc?: boolean;
};

export type LinksType = {
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
            },
            res => res.body
        );
    }

    getListOfViews() {
        return this._connection.request(
            {
                method: "GET",
                path: `${this.viewUrlPrefix}`,
            },
            res => res.body
        );
    }

    createView(links: LinksType = {}, primarySort: Array<PrimarySortFields> = []) {
        return this._connection.request(
            {
                method: "POST",
                path: `${this.viewUrlPrefix}`,
                body: {
                    type: "search",
                    name: this._viewName,
                    links,
                    primarySort
                },
            },
            res => res.body
        );
    }

    getViewInfo() {
        return this._connection.request(
            {
                method: "GET",
                path: `${this.viewUrlPrefix}/${this._viewName}`,
            },
            res => res.body
        );
    }

    renameView(name: string) {
        return this._connection.request(
            {
                method: "PUT",
                path: `${this.viewUrlPrefix}/${this._viewName}/rename`,
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
            },
            res => res.body
        );
    }

    getViewProperties() {
        return this._connection.request(
            {
                method: "GET",
                path: `${this.viewUrlPrefix}/${this._viewName}/properties`,
            },
            res => res.body
        );
    }

    updateViewProperties(properties: LinksType) {
        return this._connection.request(
            {
                method: "PUT",
                path: `${this.viewUrlPrefix}/${this._viewName}/properties`,
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
            },
            res => res.body
        );
    }
    
    getAnalyzerDefinition() {
        return this._connection.request(
            {
                method: "GET",
                path: `${this.analyzerUrlPrefix}/${this._analyzerName}`,
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
            },
            res => res.body
        );
    }
}
