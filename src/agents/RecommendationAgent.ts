// src/agents/RecommendationAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class RecommendationAgent {
  name = "RecommendationAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Generate recommendations based on user input or context
   * @param context Object with user preferences, history, or current state
   */
  async recommend(context: any) {
    const recEngine = engineManager["RecommendationEngine"];
    if (!recEngine) {
      logger.warn(`[${this.name}] RecommendationEngine not found`);
      return { error: "RecommendationEngine not found" };
    }

    try {
      const recommendations = await recEngine.run({ action: "recommend", context });
      logger.info(`[${this.name}] Recommendations generated`);
      return recommendations;
    } catch (err) {
      logger.error(`[${this.name}] Recommendation failed:`, err);
      return { error: "Recommendation failed", details: err };
    }
  }

  /**
   * Feedback loop to improve recommendations
   * @param feedback Object with user feedback on recommendations
   */
  async provideFeedback(feedback: any) {
    const recEngine = engineManager["RecommendationEngine"];
    if (!recEngine) {
      logger.warn(`[${this.name}] RecommendationEngine not found`);
      return { error: "RecommendationEngine not found" };
    }

    try {
      const result = await recEngine.run({ action: "feedback", feedback });
      logger.info(`[${this.name}] Feedback processed`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Feedback processing failed:`, err);
      return { error: "Feedback processing failed", details: err };
    }
  }
}
