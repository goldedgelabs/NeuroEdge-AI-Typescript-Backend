import { logger } from "../utils/logger";
import { engineManager } from "../core/engineManager";

export class CriticAgent {
  name = "CriticAgent";

  constructor() {
    logger.info(`[CriticAgent] Initialized`);
    // Optional: survival check
    if (typeof (this as any).survivalCheck === "function") {
      (this as any).survivalCheck();
    }
  }

  // Core method: critique a task, plan, or output
  async critique(input: any, context: any = {}) {
    logger.log(`[CriticAgent] Critiquing input:`, input);

    try {
      // Example: consult PredictiveEngine for evaluation score
      const prediction = await engineManager["PredictiveEngine"].run({ input, context });

      // Example critique result
      const critiqueResult = {
        input,
        prediction,
        score: prediction?.score || Math.random(), // placeholder
        feedback: "Review completed",
        createdAt: new Date().toISOString(),
      };

      logger.info(`[CriticAgent] Critique completed successfully`);
      return critiqueResult;
    } catch (err) {
      logger.error(`[CriticAgent] Error during critique:`, err);
      if (typeof this.recover === "function") {
        await this.recover(err);
      }
      return { error: "Recovered from failure" };
    }
  }

  // Optional recovery method
  async recover(err: any) {
    logger.warn(`[CriticAgent] Recovery triggered:`, err);
    // Recovery logic here
  }

  // Inter-agent communication
  async talkTo(agentName: string, method: string, payload: any) {
    const agent = (globalThis as any).__NE_AGENT_MANAGER?.[agentName];
    if (agent && typeof agent[method] === "function") {
      return agent[method](payload);
    }
    logger.warn(`[CriticAgent] Agent or method not found: ${agentName}.${method}`);
    return null;
  }
}
