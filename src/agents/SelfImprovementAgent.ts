// src/agents/SelfImprovementAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class SelfImprovementAgent {
  name = "SelfImprovementAgent";

  constructor() {
    logger.log(`[SelfImprovementAgent] Initialized`);
  }

  // Improve self or other agents based on data
  async improve(input: any) {
    logger.info(`[SelfImprovementAgent] Improving...`);
    
    // Example: use SelfImprovementEngine
    const result = await engineManager.SelfImprovementEngine?.run?.({ data: input });
    
    // Optionally, enhance outputs of other engines
    if (input.targetEngine && engineManager[input.targetEngine]) {
      const enhanced = await engineManager[input.targetEngine].run?.({ data: result });
      return enhanced;
    }

    return result;
  }

  async recover(err: any) {
    logger.warn(`[SelfImprovementAgent] Recovering from error`, err);
  }

  async talkTo(agentName: string, method: string, payload: any) {
    const agent = (globalThis as any).__NE_AGENT_MANAGER?.[agentName];
    if (agent && typeof agent[method] === "function") {
      return await agent[method](payload);
    }
    return null;
  }
}
