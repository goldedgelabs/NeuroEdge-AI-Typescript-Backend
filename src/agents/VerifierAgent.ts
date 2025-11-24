import { logger } from "../utils/logger";
import { engineManager } from "../core/engineManager";

export class VerifierAgent {
  name = "VerifierAgent";

  constructor() {
    logger.info(`[VerifierAgent] Initialized`);
    if (typeof (this as any).survivalCheck === "function") {
      (this as any).survivalCheck();
    }
  }

  // Verifies the correctness or validity of a task/output
  async verify(task: any, context: any = {}) {
    logger.log(`[VerifierAgent] Verifying task:`, task);

    try {
      // Example: use AnalyticsEngine for validation
      const verificationResult = await engineManager["AnalyticsEngine"].run({ task, context });

      const output = {
        task,
        verified: verificationResult?.success ?? true,
        details: verificationResult,
        verifiedAt: new Date().toISOString(),
      };

      logger.info(`[VerifierAgent] Task verification completed`);
      return output;
    } catch (err) {
      logger.error(`[VerifierAgent] Error during verification:`, err);
      if (typeof this.recover === "function") {
        await this.recover(err);
      }
      return { error: "Recovered from failure" };
    }
  }

  async recover(err: any) {
    logger.warn(`[VerifierAgent] Recovery triggered:`, err);
    // Recovery logic here
  }

  // Inter-agent communication
  async talkTo(agentName: string, method: string, payload: any) {
    const agent = (globalThis as any).__NE_AGENT_MANAGER?.[agentName];
    if (agent && typeof agent[method] === "function") {
      return agent[method](payload);
    }
    logger.warn(`[VerifierAgent] Agent or method not found: ${agentName}.${method}`);
    return null;
  }
               }
