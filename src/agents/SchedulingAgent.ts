// src/agents/SchedulingAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class SchedulingAgent {
  name = "SchedulingAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Schedule a task using the SchedulingEngine
   * @param task Object with task details { title, time, priority }
   */
  async schedule(task: { title: string; time: Date; priority?: number }) {
    const schedEngine = engineManager["SchedulingEngine"];
    if (!schedEngine) {
      logger.warn(`[${this.name}] SchedulingEngine not found`);
      return { error: "SchedulingEngine not found" };
    }

    try {
      const result = await schedEngine.run({ action: "schedule", task });
      logger.info(`[${this.name}] Task scheduled`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Scheduling failed:`, err);
      return { error: "Scheduling failed", details: err };
    }
  }

  /**
   * Retrieve scheduled tasks
   * @param options Optional filter { date, priority }
   */
  async getTasks(options?: { date?: Date; priority?: number }) {
    const schedEngine = engineManager["SchedulingEngine"];
    if (!schedEngine) {
      logger.warn(`[${this.name}] SchedulingEngine not found`);
      return { error: "SchedulingEngine not found" };
    }

    try {
      const tasks = await schedEngine.run({ action: "getTasks", options });
      logger.info(`[${this.name}] Retrieved scheduled tasks`);
      return tasks;
    } catch (err) {
      logger.error(`[${this.name}] Get tasks failed:`, err);
      return { error: "Get tasks failed", details: err };
    }
  }
}
