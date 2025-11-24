import { logger } from "../utils/logger";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(__dirname, "edgeDB.json");

export class EdgeDB {
  private data: Record<string, any> = {};

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      logger.error("EdgeDB load failed", err);
      this.data = {};
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
    } catch (err) {
      logger.error("EdgeDB save failed", err);
    }
  }

  public get(collection: string, key?: string) {
    if (!this.data[collection]) return null;
    if (key) return this.data[collection][key] ?? null;
    return this.data[collection];
  }

  public set(collection: string, key: string, value: any) {
    if (!this.data[collection]) this.data[collection] = {};
    this.data[collection][key] = value;
    this.save();
  }

  public delete(collection: string, key: string) {
    if (this.data[collection]) {
      delete this.data[collection][key];
      this.save();
    }
  }

  public replicateTo(sharedDB: any) {
    logger.info("Replicating edgeDB to sharedDB...");
    sharedDB.bulkInsert(this.data);
  }
}

export const edgeDB = new EdgeDB();
