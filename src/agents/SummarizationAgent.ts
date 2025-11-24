// src/agents/SummarizationAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class SummarizationAgent {
  name = "SummarizationAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Summarize given text
   * @param text Text to summarize
   * @param length Desired summary length or ratio
   */
  async summarize(text: string, length: number | "short" | "medium" | "long" = "medium") {
    const summarizationEngine = engineManager["SummarizationEngine"];
    if (!summarizationEngine) {
      logger.warn(`[${this.name}] SummarizationEngine not found`);
      return { error: "SummarizationEngine not found" };
    }

    try {
      const result = await summarizationEngine.run({
        action: "summarize",
        payload: { text, length },
      });
      logger.info(`[${this.name}] Summarization completed`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Summarization failed:`, err);
      return { error: "Summarization failed", details: err };
    }
  }
}
