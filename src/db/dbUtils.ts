import { db } from "./dbManager";
import { publish } from "../core/engineManager";

export async function replicateEdgeToShared(collection: string) {
  const edgeRecords = await db.getAll(collection, "edge");
  for (const record of edgeRecords) {
    await db.set(collection, record.id, record, "shared");
    publish("db:update", { collection, key: record.id, value: record });
  }
}
