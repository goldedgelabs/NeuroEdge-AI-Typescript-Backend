import { edgeDB } from "./edgeDB";
import { sharedDB } from "./sharedDB";
import { eventBus } from "../core/eventBus"; // Engines/agents can subscribe/publish

export class NeuroEdgeDB {
  static get(collection: string, key?: string) {
    return edgeDB.get(collection, key) ?? sharedDB.get(collection, key);
  }

  static set(collection: string, key: string, value: any, replicate = true) {
    edgeDB.set(collection, key, value);
    if (replicate) {
      sharedDB.set(collection, key, value);
    }
    eventBus["db:update"]?.forEach((cb) => cb({ collection, key, value }));
  }

  static delete(collection: string, key: string) {
    edgeDB.delete(collection, key);
    sharedDB.get(collection, key) && sharedDB.set(collection, key, null);
    eventBus["db:delete"]?.forEach((cb) => cb({ collection, key }));
  }

  static replicateEdgeToShared() {
    edgeDB.replicateTo(sharedDB);
  }
}

export const db = NeuroEdgeDB;
