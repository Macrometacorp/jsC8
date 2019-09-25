import { Connection } from "./connection";

class User {
  _connection: Connection;
  user = "";
  email: string;

  urlPrefix: string = "/_admin/user";

  constructor(connection: Connection, user: string, email: string) {
    this.user = user;
    this._connection = connection;
    this.email = email;
  }

  createUser(passwd: string = "", active: boolean = true, extra: object = {}) {
    return this._connection.request(
      {
        method: "POST",
        path: this.urlPrefix,
        body: {
          user: this.user,
          email: this.email,
          passwd: passwd,
          active,
          extra
        }
      },
      res => res.body
    );
  }

  getUserDeatils() {
    return this._connection.request(
      {
        method: "GET",
        path: `${this.urlPrefix}/${this.user}`
      },
      res => res.body
    );
  }

  deleteUser() {
    return this._connection.request(
      {
        method: "DELETE",
        path: `${this.urlPrefix}/${this.user}`
      },
      res => res.body
    );
  }

  _makeModification(
    config: { active?: boolean; passwd?: string; extra?: object },
    methodType: string
  ) {
    return this._connection.request(
      {
        method: methodType,
        path: `${this.urlPrefix}/${this.user}`,
        body: {
          ...config
        }
      },
      res => res.body
    );
  }

  modifyUser(config: { active?: boolean; passwd?: string; extra?: object }) {
    return this._makeModification(config, "PATCH");
  }

  replaceUser(config: { active?: boolean; passwd: string; extra?: object }) {
    return this._makeModification(config, "PUT");
  }

  getAllDatabases(isFullRequested: boolean = false) {
    return this._connection.request(
      {
        method: "GET",
        path: `${this.urlPrefix}/${this.user}/database`,
        qs: {
          full: isFullRequested
        }
      },
      res => res.body
    );
  }

  getDatabaseAccessLevel(databaseName: string) {
    return this._connection.request(
      {
        method: "GET",
        path: `${this.urlPrefix}/${this.user}/database/${databaseName}`
      },
      res => res.body
    );
  }

  getCollectionAccessLevel(databaseName: string, collectionName: string) {
    return this._connection.request(
      {
        method: "GET",
        path: `${this.urlPrefix}/${
          this.user
          }/database/${databaseName}/${collectionName}`
      },
      res => res.body
    );
  }

  clearDatabaseAccessLevel(fabricName: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `${this.urlPrefix}/${this.user}/database/${fabricName}`
      },
      res => res.body
    );
  }

  setDatabaseAccessLevel(fabricName: string, permission: "rw" | "ro" | "none") {
    return this._connection.request(
      {
        method: "PUT",
        path: `${this.urlPrefix}/${this.user}/database/${fabricName}`,
        body: {
          grant: permission
        }
      },
      res => res.body
    );
  }

  clearCollectionAccessLevel(fabricName: string, collectionName: string) {
    return this._connection.request(
      {
        method: "DELETE",
        path: `${this.urlPrefix}/${
          this.user
          }/database/${fabricName}/${collectionName}`
      },
      res => res.body
    );
  }

  setCollectionAccessLevel(
    fabricName: string,
    collectionName: string,
    permission: "rw" | "ro" | "none"
  ) {
    return this._connection.request(
      {
        method: "PUT",
        path: `${this.urlPrefix}/${
          this.user
          }/database/${fabricName}/${collectionName}`,
        body: {
          grant: permission
        }
      },
      res => res.body
    );
  }
}

export default User;
