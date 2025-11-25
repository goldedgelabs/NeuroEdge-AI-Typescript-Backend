// src/db/dbManager.ts
import { LocalDB } from "./local/LocalDB";
import { DistributedDB } from "./distributed/DistributedDB";
import { Replicator } from "./replication/Replicator";
import { eventBus } from "../core/engineManager";

// Initialize local + distributed DB
export const localDB = new LocalDB();
export const distributedDB = new DistributedDB();
export const replicator = new Replicator(localDB, distributedDB);

export const db = {
  async set(
    collection: string,
    key: string,
    value: any,
    target: "edge" | "shared" = "edge"
  ) {
    if (target === "edge") await localDB.set(collection, key, value);
    else await distributedDB.set(collection, key, value);

    // Emit update event
    eventBus.publish("db:update", { collection, key, value, target });
    return value;
  },

  async get(collection: string, key: string, target: "edge" | "shared" = "edge") {
    if (target === "edge") return await localDB.get(collection, key);
    else return await distributedDB.get(collection, key);
  },

  async getAll(collection: string, target: "edge" | "shared" = "edge") {
    if (target === "edge") return await localDB.getAll(collection);
    else return await distributedDB.getAll(collection);
  },

  async delete(collection: string, key: string, target: "edge" | "shared" = "edge") {
    if (target === "edge") await localDB.delete(collection, key);
    else await distributedDB.delete(collection, key);

    eventBus.publish("db:delete", { collection, key, target });
  },

  async replicateCollection(collection: string) {
    await replicator.replicate(collection);
  },

  async replicateAll(collections: string[]) {
    await replicator.replicateAll(collections);
  }
};
