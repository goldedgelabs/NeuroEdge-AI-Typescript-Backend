// src/agents/CreativityAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class CreativityAgent {
  name = "CreativityAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Generate creative outputs like art, text, or ideas
   * @param prompt The creative input prompt
   * @param options Optional settings (style, length, format)
   */
  async generate(prompt: string, options?: any) {
    const creativityEngine = engineManager["CreativityEngine"];
    if (!creativityEngine) {
      logger.warn(`[${this.name}] CreativityEngine not found`);
      return { error: "CreativityEngine not found" };
    }

    try {
      const result = await creativityEngine.run({
        action: "generate",
        payload: { prompt, options },
      });
      logger.info(`[${this.name}] Generated creative output`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Creativity generation failed:`, err);
      return { error: "Failed to generate creativity", details: err };
    }
  }

  /**
   * Suggest improvements or variations on a given idea
   * @param idea The input idea or content
   * @param options Optional settings
   */
  async suggestVariations(idea: string, options?: any) {
    const creativityEngine = engineManager["CreativityEngine"];
    if (!creativityEngine) {
      logger.warn(`[${this.name}] CreativityEngine not found`);
      return { error: "CreativityEngine not found" };
    }

    try {
      const result = await creativityEngine.run({
        action: "suggestVariations",
        payload: { idea, options },
      });
      logger.info(`[${this.name}] Suggested variations`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Failed to suggest variations:`, err);
      return { error: "Failed to suggest variations", details: err };
    }
  }
}
