// src/agents/ResearchAgent.ts
import { logger } from "../utils/logger";
import { engineManager, eventBus } from "../core/engineManager";

export class ResearchAgent {
  name = "ResearchAgent";
  private knowledgeBase: Record<string, any> = {};

  constructor() {
    logger.info(`${this.name} initialized`);
  }

  // Add new research entry
  addResearch(topic: string, data: any) {
    this.knowledgeBase[topic] = data;
    logger.log(`[ResearchAgent] Added research topic: ${topic}`);
    eventBus["research:new"]?.forEach(cb => cb({ topic, data }));
    return { success: true };
  }

  // Query research
  queryResearch(topic: string) {
    const result = this.knowledgeBase[topic] || null;
    logger.info(`[ResearchAgent] Query topic: ${topic}`, result);
    return result;
  }

  // Collaborate with engines or other agents
  async collaborate(engineName: string, input: any) {
    const engine = engineManager[engineName];
    if (!engine || typeof engine.run !== "function") {
      logger.warn(`[ResearchAgent] Engine '${engineName}' not found or invalid.`);
      return { success: false, message: "Engine unavailable" };
    }
    logger.log(`[ResearchAgent] Collaborating with ${engineName} on input:`, input);
    const output = await engine.run(input);
    return { success: true, output };
  }

  // List all stored research topics
  listTopics() {
    return Object.keys(this.knowledgeBase);
  }
}
