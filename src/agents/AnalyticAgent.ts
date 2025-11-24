// src/agents/AnalyticAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class AnalyticAgent {
  name = "AnalyticAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Analyze data using the AnalyticsEngine
   * @param input Data to analyze
   */
  async analyze(input: any) {
    const analyticsEngine = engineManager["AnalyticsEngine"];
    if (!analyticsEngine) {
      logger.warn(`[${this.name}] AnalyticsEngine not found`);
      return { error: "AnalyticsEngine not found" };
    }

    try {
      const result = await analyticsEngine.run(input);
      logger.info(`[${this.name}] Analysis result:`, result);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Analysis failed:`, err);
      return { error: "Analysis failed", details: err };
    }
  }

  /**
   * Analyze multiple datasets in sequence
   */
  async batchAnalyze(inputs: any[]) {
    const results = [];
    for (const input of inputs) {
      results.push(await this.analyze(input));
    }
    return results;
  }
}
