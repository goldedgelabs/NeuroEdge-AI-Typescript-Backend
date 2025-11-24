// src/agents/ValidatorAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class ValidatorAgent {
  name = "ValidatorAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Validate input data for a specific engine
   * @param engineName Name of the engine
   * @param input Input payload to validate
   */
  async validate(engineName: string, input: any) {
    const engine = engineManager[engineName];
    if (!engine) {
      logger.warn(`[${this.name}] Engine not found: ${engineName}`);
      return { error: "Engine not found" };
    }

    try {
      if (typeof engine.validate === "function") {
        const result = await engine.validate(input);
        logger.info(`[${this.name}] Validation result for ${engineName}:`, result);
        return result;
      } else {
        logger.warn(`[${this.name}] Engine ${engineName} has no validate method`);
        return { success: true, message: "No validation required" };
      }
    } catch (err) {
      logger.error(`[${this.name}] Validation failed for ${engineName}:`, err);
      return { success: false, error: err };
    }
  }

  /**
   * Batch validate multiple engines
   */
  async batchValidate(inputs: { engine: string, data: any }[]) {
    const results: Record<string, any> = {};
    for (const item of inputs) {
      results[item.engine] = await this.validate(item.engine, item.data);
    }
    return results;
  }
}
