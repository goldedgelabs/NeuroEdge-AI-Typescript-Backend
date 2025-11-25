// src/db/replication.ts
import { db } from "./dbManager";
import { eventBus } from "../core/eventBus";
import { logger } from "../utils/logger";

/**
 * Replicate records from one layer to another
 */
export async function replicateLayer(from: "edge" | "shared", to: "shared" | "global", collection?: string) {
  const collections = collection ? [collection] : Object.keys(db[from]);
  for (const col of collections) {
    const records = await db.getAll(col, from);
    for (const record of records) {
      await db.set(col, record.id, record, to);
    }
    logger.log(`[Replication] ${from} → ${to} replicated ${col} (${records.length} records)`);
  }
}

/**
 * Listen to updates and replicate automatically
 */
eventBus.subscribe("db:update", async ({ collection, key, value, layer }) => {
  if (layer === "edge") {
    await replicateLayer("edge", "shared", collection);
  } else if (layer === "shared") {
    await replicateLayer("shared", "global", collection);
  }
});

eventBus.subscribe("db:delete", async ({ collection, key, layer }) => {
  if (layer === "edge") {
    await db.delete(collection, key, "shared");
  } else if (layer === "shared") {
    await db.delete(collection, key, "global");
  }
});
