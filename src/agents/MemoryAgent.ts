// src/agents/MemoryAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class MemoryAgent {
  name = "MemoryAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Store data in MemoryEngine
   * @param key Key for storage
   * @param value Value to store
   */
  async store(key: string, value: any) {
    const memoryEngine = engineManager["MemoryEngine"];
    if (!memoryEngine) {
      logger.warn(`[${this.name}] MemoryEngine not found`);
      return { error: "MemoryEngine not found" };
    }

    try {
      await memoryEngine.run({ action: "store", key, value });
      logger.info(`[${this.name}] Stored data for key: ${key}`);
      return { success: true };
    } catch (err) {
      logger.error(`[${this.name}] Store failed:`, err);
      return { error: "Store failed", details: err };
    }
  }

  /**
   * Retrieve data from MemoryEngine
   * @param key Key to retrieve
   */
  async retrieve(key: string) {
    const memoryEngine = engineManager["MemoryEngine"];
    if (!memoryEngine) {
      logger.warn(`[${this.name}] MemoryEngine not found`);
      return { error: "MemoryEngine not found" };
    }

    try {
      const value = await memoryEngine.run({ action: "retrieve", key });
      logger.info(`[${this.name}] Retrieved data for key: ${key}`);
      return value;
    } catch (err) {
      logger.error(`[${this.name}] Retrieve failed:`, err);
      return { error: "Retrieve failed", details: err };
    }
  }
}
