// src/agents/SearchAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class SearchAgent {
  name = "SearchAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Perform a search across all connected engines or datasets
   * @param query The search query
   */
  async search(query: string) {
    try {
      const result = await engineManager["SearchEngine"].run({
        action: "search",
        payload: { query },
      });
      logger.info(`[${this.name}] Search completed`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Search failed:`, err);
      return { error: "Search failed", details: err };
    }
  }

  /**
   * Perform a filtered search with parameters
   * @param query The search query
   * @param filters Filters object (engine type, date, relevance, etc.)
   */
  async searchWithFilters(query: string, filters: Record<string, any>) {
    try {
      const result = await engineManager["SearchEngine"].run({
        action: "searchWithFilters",
        payload: { query, filters },
      });
      logger.info(`[${this.name}] Filtered search completed`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Filtered search failed:`, err);
      return { error: "Filtered search failed", details: err };
    }
  }
}
