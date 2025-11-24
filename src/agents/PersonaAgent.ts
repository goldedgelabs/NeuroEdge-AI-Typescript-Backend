// src/agents/PersonaAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class PersonaAgent {
  name = "PersonaAgent";

  constructor() {
    logger.log(`${this.name} initialized`);
  }

  /**
   * Generate or switch AI persona
   * @param personaName Name of the persona to activate
   * @param options Optional configuration
   */
  async setPersona(personaName: string, options?: any) {
    const personaEngine = engineManager["PersonaEngine"];
    if (!personaEngine) {
      logger.warn(`[${this.name}] PersonaEngine not found`);
      return { error: "PersonaEngine not found" };
    }

    try {
      const result = await personaEngine.run({
        action: "setPersona",
        payload: { personaName, options },
      });
      logger.info(`[${this.name}] Persona set to ${personaName}`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Failed to set persona:`, err);
      return { error: "Failed to set persona", details: err };
    }
  }

  /**
   * Get current active persona
   */
  async getCurrentPersona() {
    const personaEngine = engineManager["PersonaEngine"];
    if (!personaEngine) {
      logger.warn(`[${this.name}] PersonaEngine not found`);
      return { error: "PersonaEngine not found" };
    }

    try {
      const result = await personaEngine.run({ action: "getCurrentPersona" });
      logger.info(`[${this.name}] Fetched current persona`);
      return result;
    } catch (err) {
      logger.error(`[${this.name}] Failed to fetch current persona:`, err);
      return { error: "Failed to fetch persona", details: err };
    }
  }
}
