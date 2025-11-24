// src/db/dbManager.ts
import { publish } from "../core/engineManager"; // EventBus from engineManager

interface DBRecord {
  id: string;
  [key: string]: any;
}

type DBStore = Record<string, Record<string, DBRecord>>; // collection → id → record

class DBManager {
  private edge: DBStore = {};
  private shared: DBStore = {};

  async set(collection: string, id: string, record: DBRecord, target: "edge" | "shared" = "edge") {
    const store = target === "edge" ? this.edge : this.shared;
    if (!store[collection]) store[collection] = {};
    store[collection][id] = record;

    // Emit DB event for subscribers
    publish("db:update", { collection, key: id, value: record, target });
  }

  async get(collection: string, id: string, target: "edge" | "shared" = "edge") {
    const store = target === "edge" ? this.edge : this.shared;
    return store[collection]?.[id] ?? null;
  }

  async getAll(collection: string, target: "edge" | "shared" = "edge") {
    const store = target === "edge" ? this.edge : this.shared;
    return Object.values(store[collection] || {});
  }

  async delete(collection: string, id: string, target: "edge" | "shared" = "edge") {
    const store = target === "edge" ? this.edge : this.shared;
    delete store[collection]?.[id];
    publish("db:delete", { collection, key: id, target });
  }
}

export const db = new DBManager();
