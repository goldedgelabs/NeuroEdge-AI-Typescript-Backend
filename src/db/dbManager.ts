// src/db/dbManager.ts
/**
 * NeuroEdge DB Manager
 * -------------------
 * Provides:
 * - Edge DB (local/offline)
 * - Shared DB (global sync)
 * - CRUD operations
 * - Event notifications
 * - Replication from Edge → Shared
 */

import { eventBus } from "../core/neuroEdgeManager";

interface RecordType {
  id: string;
  [key: string]: any;
}

interface DBLayer {
  [collection: string]: Record<string, RecordType>;
}

// Edge and Shared DB
const edgeDB: DBLayer = {};
const sharedDB: DBLayer = {};

export const db = {
  // ----------------- GET -----------------
  async get(collection: string, id: string, layer: "edge" | "shared" = "edge") {
    const dbLayer = layer === "edge" ? edgeDB : sharedDB;
    return dbLayer[collection]?.[id] ?? null;
  },

  async getAll(collection: string, layer: "edge" | "shared" = "edge") {
    const dbLayer = layer === "edge" ? edgeDB : sharedDB;
    return Object.values(dbLayer[collection] || {});
  },

  // ----------------- SET -----------------
  async set(collection: string, id: string, value: RecordType, layer: "edge" | "shared" = "edge") {
    const dbLayer = layer === "edge" ? edgeDB : sharedDB;
    if (!dbLayer[collection]) dbLayer[collection] = {};
    dbLayer[collection][id] = value;

    // Notify subscribers
    eventBus.publish("db:update", { collection, key: id, value, target: layer });
  },

  // ----------------- DELETE -----------------
  async delete(collection: string, id: string, layer: "edge" | "shared" = "edge") {
    const dbLayer = layer === "edge" ? edgeDB : sharedDB;
    if (dbLayer[collection]) {
      delete dbLayer[collection][id];
      eventBus.publish("db:delete", { collection, key: id, target: layer });
    }
  },

  // ----------------- REPLICATION -----------------
  async replicateEdgeToShared(collection: string) {
    const edgeRecords = await db.getAll(collection, "edge");
    for (const record of edgeRecords) {
      await db.set(collection, record.id, record, "shared");
    }
  },

  // Optional: periodic replication
  startPeriodicReplication(intervalMs: number = 60000) {
    setInterval(async () => {
      for (const collection in edgeDB) {
        await db.replicateEdgeToShared(collection);
      }
    }, intervalMs);
  },
};

// ================== DB Event Subscription ==================
export function subscribeToDBUpdates(callback: (event: any) => void) {
  eventBus.subscribe("db:update", callback);
}

export function subscribeToDBDeletes(callback: (event: any) => void) {
  eventBus.subscribe("db:delete", callback);
}

// ================== Example Usage ==================
// Engines or agents can subscribe like:
// subscribeToDBUpdates(event => {
//   if (event.collection === "medicine") {
//     console.log("Medicine updated:", event.key, event.value);
//   }
// });
