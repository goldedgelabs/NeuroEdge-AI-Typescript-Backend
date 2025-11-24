// src/db/dbManager.ts
import { eventBus } from "../core/engineManager";
import { logger } from "../utils/logger";

type StorageType = "edge" | "shared";

interface DBRecord {
  [key: string]: any;
}

interface DBCollection {
  [id: string]: DBRecord;
}

class DBManager {
  private edgeDB: Record<string, DBCollection> = {};
  private sharedDB: Record<string, DBCollection> = {};

  // --------------------------
  // Set record
  // --------------------------
  async set(collection: string, key: string, value: any, target: StorageType = "edge") {
    const db = target === "edge" ? this.edgeDB : this.sharedDB;
    if (!db[collection]) db[collection] = {};
    db[collection][key] = value;

    // Trigger event
    eventBus.publish("db:update", { collection, key, value, target });
    logger.info(`[DB] Set ${target}:${collection}:${key}`);
    return true;
  }

  // --------------------------
  // Get record
  // --------------------------
  async get(collection: string, key: string, target: StorageType = "edge") {
    const db = target === "edge" ? this.edgeDB : this.sharedDB;
    return db[collection]?.[key] ?? null;
  }

  // --------------------------
  // Get all records
  // --------------------------
  async getAll(collection: string, target: StorageType = "edge") {
    const db = target === "edge" ? this.edgeDB : this.sharedDB;
    const coll = db[collection] || {};
    return Object.values(coll);
  }

  // --------------------------
  // Delete record
  // --------------------------
  async delete(collection: string, key: string, target: StorageType = "edge") {
    const db = target === "edge" ? this.edgeDB : this.sharedDB;
    if (db[collection]?.[key]) {
      delete db[collection][key];
      eventBus.publish("db:delete", { collection, key, target });
      logger.info(`[DB] Deleted ${target}:${collection}:${key}`);
      return true;
    }
    return false;
  }

  // --------------------------
  // Replicate edge → shared
  // --------------------------
  async replicateEdgeToShared(collection: string) {
    const edgeRecords = await this.getAll(collection, "edge");
    for (const record of edgeRecords) {
      await this.set(collection, record.id, record, "shared");
    }
    logger.info(`[DB] Replicated edge → shared for ${collection}`);
  }

  // --------------------------
  // Subscribe to DB events
  // --------------------------
  subscribeUpdate(callback: (event: any) => void) {
    eventBus.subscribe("db:update", callback);
  }

  subscribeDelete(callback: (event: any) => void) {
    eventBus.subscribe("db:delete", callback);
  }
}

// Export a singleton
export const db = new DBManager();
