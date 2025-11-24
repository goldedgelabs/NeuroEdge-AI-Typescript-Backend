// src/database/index.ts
import { LocalDB } from "./local/LocalDB";
import { DistributedDB } from "./distributed/DistributedDB";
import { Replicator } from "./replication/Replicator";

export const localDB = new LocalDB();
export const distributedDB = new DistributedDB();
export const replicator = new Replicator();

// Utility to sync local -> distributed
export async function syncLocalToDistributed(key: string, value: any) {
  await localDB.set(key, value);
  await distributedDB.pushUpdate(key, value);
}

// Utility to sync distributed -> local
export async function receiveDistributedUpdate(data: { key: string; value: any }) {
  await localDB.set(data.key, data.value);
}
