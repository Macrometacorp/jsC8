import { Connection } from "./connection";
import { isC8Error } from "./error";

export enum ViewType {
  c8Search_VIEW = "c8Search"
}

export interface C8View {
  isC8View: true;
  name: string;
}

export interface C8ViewResponse {
  name: string;
  id: string;
  type: ViewType;
}

interface c8SearchConsolidate {
  threshold: number;
  segmentThreshold: number;
}

interface c8SearchCollectionLink {
  analyzers?: string[];
  fields?: { [key: string]: c8SearchCollectionLink | undefined };
  includeAllFields?: boolean;
  trackListPositions?: boolean;
  storeValues?: "none" | "id";
}

export interface c8SearchProperties {
  locale: string;
  commit: {
    consolidate: {
      count?: c8SearchConsolidate;
      bytes?: c8SearchConsolidate;
      bytes_accum?: c8SearchConsolidate;
      fill?: c8SearchConsolidate;
    };
    commitIntervalMsec?: number;
    cleanupIntervalStep?: number;
  };
  links: {
    [key: string]: c8SearchCollectionLink | undefined;
  };
}

export interface c8SearchPropertiesResponse
  extends c8SearchProperties,
    C8ViewResponse {
  type: ViewType.c8Search_VIEW;
}

export interface c8SearchPropertiesOptions {
  locale?: string;
  commit?: {
    consolidate?:
      | "none"
      | {
          count?: Partial<c8SearchConsolidate>;
          bytes?: Partial<c8SearchConsolidate>;
          bytes_accum?: Partial<c8SearchConsolidate>;
          fill?: Partial<c8SearchConsolidate>;
        };
    commitIntervalMsec?: number;
    cleanupIntervalStep?: number;
  };
  links?: {
    [key: string]: c8SearchCollectionLink | undefined;
  };
}

const VIEW_NOT_FOUND = 1203;
export abstract class BaseView implements C8View {
  isC8View: true = true;
  name: string;
  abstract type: ViewType;
  protected _connection: Connection;

  constructor(connection: Connection, name: string) {
    this.name = name;
    this._connection = connection;
  }

  get(): Promise<C8ViewResponse> {
    return this._connection.request(
      { path: `/_api/view/${this.name}` },
      res => res.body
    );
  }

  exists() {
    return this.get().then(
      () => true,
      err => {
        if (isC8Error(err) && err.errorNum === VIEW_NOT_FOUND) {
          return false;
        }
        throw err;
      }
    );
  }

  async rename(name: string) {
    const result = await this._connection.request(
      {
        method: "PUT",
        path: `/_api/view/${this.name}/rename`,
        body: { name }
      },
      res => res.body
    );
    this.name = name;
    return result;
  }

  drop() {
    return this._connection.request(
      {
        method: "DELETE",
        path: `/_api/view/${this.name}`
      },
      res => res.body
    );
  }
}

export class c8SearchView extends BaseView {
  type = ViewType.c8Search_VIEW;

  create(
    properties: c8SearchPropertiesOptions = {}
  ): Promise<c8SearchPropertiesResponse> {
    return this._connection.request(
      {
        method: "POST",
        path: "/_api/view",
        body: {
          properties,
          name: this.name,
          type: this.type
        }
      },
      res => res.body
    );
  }

  properties(): Promise<c8SearchPropertiesResponse> {
    return this._connection.request(
      { path: `/_api/view/${this.name}/properties` },
      res => res.body
    );
  }

  setProperties(
    properties: c8SearchPropertiesOptions = {}
  ): Promise<c8SearchPropertiesResponse> {
    return this._connection.request(
      {
        method: "PATCH",
        path: `/_api/view/${this.name}/properties`,
        body: properties
      },
      res => res.body
    );
  }

  replaceProperties(
    properties: c8SearchPropertiesOptions = {}
  ): Promise<c8SearchPropertiesResponse> {
    return this._connection.request(
      {
        method: "PUT",
        path: `/_api/view/${this.name}/properties`,
        body: properties
      },
      res => res.body
    );
  }
}

export function constructView(connection: Connection, data: any): C8View {
  if (data.type && data.type !== ViewType.c8Search_VIEW) {
    throw new Error(`Unknown view type "${data.type}"`);
  }
  return new c8SearchView(connection, data.name);
}
