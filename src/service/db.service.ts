import { Client, ClientConfig, QueryConfig } from "pg";
import { CustomDatabaseError } from "../models/custom-error";

export class DBService {
  private _client: Client;
  private _config: ClientConfig;
  private _connected: boolean = false;
  constructor(config: ClientConfig) {
    this._config = config;
    this._client = new Client(this._config);
  }

  async connect() {
    try {
      if (this._connected) {
        throw new CustomDatabaseError("Client has already been connected.");
      }
      await this._client.connect();
      this._connected = true;
    } catch (error) {
      if (!(error instanceof CustomDatabaseError)) {
        await this.disconnect();
      }
      throw error;
    }
  }

  async disconnect() {
    try {
      await this._client.end();
    } catch (error) {
      throw error;
    } finally {
      this._client = new Client(this._config);
      this._connected = false;
    }
  }
  async query<T extends object>(
    queryConfig: QueryConfig
  ): Promise<{ data: T[]; count: number }> {
    try {
      if (!this._connected) {
        throw new CustomDatabaseError("There is no connected client!");
      }

      queryConfig.text = queryConfig.text.trim();

      if (
        !queryConfig.text.endsWith(";") ||
        queryConfig.text.split(";").length > 2
      ) {
        throw new CustomDatabaseError("Invalid SQL query is applied!");
      }
      const resp = await this._client.query<T>(queryConfig);
      const { rows, rowCount } = resp!;
      return Promise.resolve({ data: rows, count: rowCount ? rowCount : 0 });
    } catch (error) {
      throw error;
    }
  }
}
