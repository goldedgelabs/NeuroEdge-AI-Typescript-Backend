import { AgentBase } from "./AgentBase";
import { eventBus, agentManager } from "../core/engineManager";

export class PlannerHelperAgent extends AgentBase {
  constructor() {
    super("PlannerHelperAgent");
  }

  /**
   * Run the agent with given input.
   * Example: assist PlannerAgent or PlannerEngine
   */
  async run(input?: any) {
    if (!input) return;

    if (input.task && input.context) {
      console.log(`[PlannerHelperAgent] Assisting task:`, input.task);

      // Example: communicate with PlannerEngine
      const plannerEngine = (globalThis as any).__NE_ENGINE_MANAGER?.PlannerEngine;
      if (plannerEngine && typeof plannerEngine.run === "function") {
        const result = await plannerEngine.run({ task: input.task, context: input.context });
        console.log(`[PlannerHelperAgent] PlannerEngine returned:`, result);
        return result;
      }
    }

    return { message: "No task provided" };
  }

  async recover(err: any) {
    console.error(`[PlannerHelperAgent] Recovering from error:`, err);
  }
}
