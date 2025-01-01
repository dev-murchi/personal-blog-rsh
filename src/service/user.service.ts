import "dotenv/config";
import { DBService } from "./db.service";
import { CustomError } from "../models/custom-error";
import { User } from "../models/user";

class UserService {
  private _db: DBService | null = null;
  constructor() {
    if (
      process.env.DB_HOST &&
      process.env.DB_PORT &&
      !isNaN(parseInt(process.env.DB_PORT)) &&
      process.env.DB_NAME &&
      process.env.DB_USER &&
      process.env.DB_PASSKEY
    ) {
      this._db = new DBService({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSKEY,
      });
    }
  }

  async saveUser(user: User): Promise<User[]> {
    try {
      if (this._db === null) {
        throw new CustomError("Could not connected to DB", 500);
      }
      await this._db.connect();
      const text = `INSERT INTO ${process.env.DB_TUSER} (
        ${process.env.DB_TUSER_NAME},
        ${process.env.DB_TUSER_MAIL},
        ${process.env.DB_TUSER_PASSKEY},
        ${process.env.DB_TUSER_ROLE},
        ${process.env.DB_TUSER_CREATE_DATE},
        ${process.env.DB_TUSER_UPDATE_DATE}
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING 
        ${process.env.DB_TUSER_NAME} as "username",
        ${process.env.DB_TUSER_MAIL} as "email",
        ${process.env.DB_TUSER_PASSKEY} as "password",
        ${process.env.DB_TUSER_ROLE} as "role",
        ${process.env.DB_TUSER_CREATE_DATE} as "createdAt",
        ${process.env.DB_TUSER_UPDATE_DATE} as "updatedAt"
      ;`;
      const result = await this._db.query<User>({
        text: text.trim(),
        values: [
          user.username,
          user.email,
          user.password,
          user.role,
          new Date().toString(),
          new Date().toString(),
        ],
      });
      await this._db.disconnect();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async findUsers(): Promise<User[]> {
    try {
      if (this._db === null) {
        throw new CustomError("Could not connected to DB", 500);
      }

      await this._db.connect();
      const result = await this._db.query<User>({
        text: `SELECT 
        ${process.env.DB_TUSER_NAME} as "username",
        ${process.env.DB_TUSER_MAIL} as "email",
        ${process.env.DB_TUSER_PASSKEY} as "password",
        ${process.env.DB_TUSER_ROLE} as "role",
        ${process.env.DB_TUSER_CREATE_DATE} as "createdAt",
        ${process.env.DB_TUSER_UPDATE_DATE} as "updatedAt"
        FROM ${process.env.DB_TUSER};`.trim(),
        values: [],
      });
      await this._db.disconnect();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async findUser(mail: string): Promise<User[]> {
    try {
      if (this._db === null) {
        throw new CustomError("Could not connected to DB", 500);
      }

      if (!mail.trim()) {
        return [];
      }

      await this._db.connect();
      const result = await this._db.query<User>({
        text: `SELECT 
        ${process.env.DB_TUSER_NAME} as "username",
        ${process.env.DB_TUSER_MAIL} as "email",
        ${process.env.DB_TUSER_PASSKEY} as "password",
        ${process.env.DB_TUSER_ROLE} as "role",
        ${process.env.DB_TUSER_CREATE_DATE} as "createdAt",
        ${process.env.DB_TUSER_UPDATE_DATE} as "updatedAt"
        FROM ${process.env.DB_TUSER}
        WHERE ${process.env.DB_TUSER_MAIL}=$1;`.trim(),
        values: [mail],
      });
      await this._db.disconnect();
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(mail: string): Promise<User[]> {
    try {
      if (this._db === null) {
        throw new CustomError("Could not connected to DB", 500);
      }

      if (!mail.trim()) {
        return [];
      }

      const text = `DELETE FROM ${process.env.DB_TUSER}
      WHERE ${process.env.DB_TUSER_MAIL}=$1
      RETURNING 
        ${process.env.DB_TUSER_NAME} as "username",
        ${process.env.DB_TUSER_MAIL} as "email",
        ${process.env.DB_TUSER_PASSKEY} as "password",
        ${process.env.DB_TUSER_ROLE} as "role",
        ${process.env.DB_TUSER_CREATE_DATE} as "createdAt",
        ${process.env.DB_TUSER_UPDATE_DATE} as "updatedAt"
      ;`;

      await this._db.connect();
      const result = await this._db.query<User>({
        text: text.trim(),
        values: [mail],
      });
      await this._db.disconnect();
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
