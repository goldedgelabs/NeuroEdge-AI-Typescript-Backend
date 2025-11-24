// src/agents/ConversationAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class ConversationAgent {
  name = "ConversationAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Generate a response using the ConversationEngine
   * @param input User input or prompt
   */
  async chat(input: string) {
    const convoEngine = engineManager["ConversationEngine"];
    if (!convoEngine) {
      logger.warn(`[${this.name}] ConversationEngine not found`);
      return { error: "ConversationEngine not found" };
    }

    try {
      const response = await convoEngine.run({ action: "chat", input });
      logger.info(`[${this.name}] Generated response`);
      return response;
    } catch (err) {
      logger.error(`[${this.name}] Chat failed:`, err);
      return { error: "Chat failed", details: err };
    }
  }

  /**
   * Summarize conversation context
   * @param context Array of messages
   */
  async summarize(context: string[]) {
    const convoEngine = engineManager["ConversationEngine"];
    if (!convoEngine) {
      logger.warn(`[${this.name}] ConversationEngine not found`);
      return { error: "ConversationEngine not found" };
    }

    try {
      const summary = await convoEngine.run({ action: "summarize", context });
      logger.info(`[${this.name}] Conversation summarized`);
      return summary;
    } catch (err) {
      logger.error(`[${this.name}] Summarize failed:`, err);
      return { error: "Summarize failed", details: err };
    }
  }
}
