// src/agents/DoctrineAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class DoctrineAgent {
  name = "DoctrineAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Checks an action against the DoctrineEngine rules
   * @param action The action string (e.g., "CodeEngine.run")
   * @param folder Folder context
   * @param userRole Role of the user triggering the action
   */
  async enforce(action: string, folder: string = "", userRole: string = "user") {
    try {
      const doctrineEngine = engineManager["DoctrineEngine"];
      if (!doctrineEngine) throw new Error("DoctrineEngine not registered");

      const result = await doctrineEngine.enforceAction(action, folder, userRole);
      logger.info(`[${this.name}] Doctrine check for action "${action}" completed`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Doctrine check failed:`, err);
      return { success: false, error: err };
    }
  }

  /**
   * Quick check helper
   */
  async canPerform(action: string, folder: string = "", userRole: string = "user") {
    const result = await this.enforce(action, folder, userRole);
    return result.success;
  }
}
