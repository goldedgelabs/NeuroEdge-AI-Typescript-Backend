// src/db/replication.ts
import { db } from "./dbManager";
import { logger } from "../utils/logger";

export async function replicateEdgeToShared(collection: string) {
  const edgeRecords = await db.getAll(collection, "edge");
  for (const record of edgeRecords) {
    await db.set(collection, record.id, record, "shared");
  }
  logger.log(`[Replication] Replicated ${edgeRecords.length} records from edge:${collection} → shared`);
}
