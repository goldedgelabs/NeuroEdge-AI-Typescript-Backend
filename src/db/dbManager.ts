import { eventBus } from "../core/engineManager";

export const db: any = {
  edge: { medicine: {} },
  shared: { medicine: {} },

  async set(collection: string, key: string, value: any, source: "edge" | "shared" = "edge") {
    const target = source === "edge" ? this.edge : this.shared;
    target[collection][key] = { ...value, updatedAt: Date.now() };

    // Trigger DB update event
    eventBus["db:update"]?.forEach(cb => cb({ collection, key, value: target[collection][key] }));
    return target[collection][key];
  },

  async get(collection: string, key: string, source: "edge" | "shared" = "edge") {
    const target = source === "edge" ? this.edge : this.shared;
    return target[collection][key] ?? null;
  },

  async getAll(collection: string, source: "edge" | "shared" = "edge") {
    const target = source === "edge" ? this.edge : this.shared;
    return Object.values(target[collection] ?? {});
  }
};
