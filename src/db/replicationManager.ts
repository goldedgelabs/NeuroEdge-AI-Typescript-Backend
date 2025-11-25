// src/db/replicationManager.ts
import { db } from "./dbManager";
import { eventBus } from "../core/eventBus";
import { logger } from "../utils/logger";

/**
 * Replicate all records from edge → shared store
 * Can be called periodically or triggered by db:update
 */
export async function replicateEdgeToShared(collection?: string) {
  const collections = collection ? [collection] : Object.keys(db["edge"]);
  for (const col of collections) {
    const records = await db.getAll(col, "edge");
    for (const record of records) {
      await db.set(col, record.id, record, "shared");
      logger.log(`[Replication] ${col}:${record.id} replicated to shared`);
    }
  }
}

// Listen for all db:update events and replicate automatically
eventBus.subscribe("db:update", async ({ collection }) => {
  if (!collection) return;
  await replicateEdgeToShared(collection);
});
