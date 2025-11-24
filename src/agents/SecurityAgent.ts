// src/agents/SecurityAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class SecurityAgent {
  name = "SecurityAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Monitor system for threats or suspicious activity
   * @param context Object with system state or activity logs
   */
  async monitor(context: any) {
    const secEngine = engineManager["SecurityEngine"];
    if (!secEngine) {
      logger.warn(`[${this.name}] SecurityEngine not found`);
      return { error: "SecurityEngine not found" };
    }

    try {
      const result = await secEngine.run({ action: "monitor", context });
      logger.info(`[${this.name}] Security monitoring complete`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Monitoring failed:`, err);
      return { error: "Monitoring failed", details: err };
    }
  }

  /**
   * Respond to detected threats
   * @param threat Object with threat details
   */
  async respond(threat: any) {
    const secEngine = engineManager["SecurityEngine"];
    if (!secEngine) {
      logger.warn(`[${this.name}] SecurityEngine not found`);
      return { error: "SecurityEngine not found" };
    }

    try {
      const response = await secEngine.run({ action: "respond", threat });
      logger.info(`[${this.name}] Threat response executed`);
      return response;
    } catch (err) {
      logger.error(`[${this.name}] Threat response failed:`, err);
      return { error: "Threat response failed", details: err };
    }
  }
}
