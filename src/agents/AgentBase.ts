// src/agents/AgentBase.ts
import { db } from "../db/dbManager";
import { eventBus } from "../core/eventBus";
import { logger } from "../utils/logger";

export class AgentBase {
  name: string;

  constructor(name: string) {
    this.name = name;
    // Subscribe to DB events by default
    eventBus.subscribe("db:update", (event) => this.handleDBUpdate(event));
    eventBus.subscribe("db:delete", (event) => this.handleDBDelete(event));
  }

  async handleDBUpdate(event: any) {
    // Override in child agents
  }

  async handleDBDelete(event: any) {
    // Override in child agents
  }

  async writeDB(collection: string, key: string, value: any) {
    await db.set(collection, key, value, "edge");
    eventBus.publish("db:update", { collection, key, value, source: this.name });
    logger.log(`[AgentBase] ${this.name} wrote ${collection}:${key}`);
  }

  async deleteDB(collection: string, key: string) {
    await db.delete(collection, key, "edge");
    eventBus.publish("db:delete", { collection, key, source: this.name });
    logger.log(`[AgentBase] ${this.name} deleted ${collection}:${key}`);
  }

  async recover(err: any) {
    logger.warn(`[AgentBase] ${this.name} recovered from error:`, err);
  }
}
