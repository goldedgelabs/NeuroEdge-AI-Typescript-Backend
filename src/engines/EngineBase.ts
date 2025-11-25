// src/engines/EngineBase.ts
import { db } from "../db/dbManager";
import { eventBus } from "../core/eventBus";
import { logger } from "../utils/logger";

export class EngineBase {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async writeDB(collection: string, key: string, value: any) {
    await db.set(collection, key, value, "edge");
    eventBus.publish("db:update", { collection, key, value, source: this.name });
    logger.log(`[EngineBase] ${this.name} wrote ${collection}:${key}`);
  }

  async deleteDB(collection: string, key: string) {
    await db.delete(collection, key, "edge");
    eventBus.publish("db:delete", { collection, key, source: this.name });
    logger.log(`[EngineBase] ${this.name} deleted ${collection}:${key}`);
  }

  async recover(err: any) {
    logger.warn(`[EngineBase] ${this.name} recovered from error:`, err);
  }
}
