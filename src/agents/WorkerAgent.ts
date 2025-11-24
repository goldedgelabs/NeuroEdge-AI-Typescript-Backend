import { logger } from "../utils/logger";
import { engineManager } from "../core/engineManager";

export class WorkerAgent {
  name = "WorkerAgent";

  constructor() {
    logger.info(`[WorkerAgent] Initialized`);
    if (typeof (this as any).survivalCheck === "function") {
      (this as any).survivalCheck();
    }
  }

  // Executes a task or job
  async execute(task: any, context: any = {}) {
    logger.log(`[WorkerAgent] Executing task:`, task);

    try {
      // Example: use OrchestrationEngine to run sub-tasks
      const result = await engineManager["OrchestrationEngine"].run({ task, context });

      const output = {
        task,
        result,
        status: "completed",
        completedAt: new Date().toISOString(),
      };

      logger.info(`[WorkerAgent] Task execution completed`);
      return output;
    } catch (err) {
      logger.error(`[WorkerAgent] Error during execution:`, err);
      if (typeof this.recover === "function") {
        await this.recover(err);
      }
      return { error: "Recovered from failure" };
    }
  }

  async recover(err: any) {
    logger.warn(`[WorkerAgent] Recovery triggered:`, err);
    // Recovery logic here
  }

  // Inter-agent communication
  async talkTo(agentName: string, method: string, payload: any) {
    const agent = (globalThis as any).__NE_AGENT_MANAGER?.[agentName];
    if (agent && typeof agent[method] === "function") {
      return agent[method](payload);
    }
    logger.warn(`[WorkerAgent] Agent or method not found: ${agentName}.${method}`);
    return null;
  }
}
