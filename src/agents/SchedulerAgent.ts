import { AgentBase } from "./AgentBase";
import { eventBus, agentManager } from "../core/engineManager";

export class SchedulerAgent extends AgentBase {
  constructor() {
    super("SchedulerAgent");
  }

  /**
   * Run method to schedule tasks or events
   * input example: { taskName: string, time: string, metadata?: any }
   */
  async run(input?: any) {
    if (!input) return { error: "No input provided" };
    const { taskName, time, metadata } = input;

    console.log(`[SchedulerAgent] Scheduling task: ${taskName} at ${time}`);

    // Example: trigger SchedulingEngine if available
    const schedulingEngine = agentManager["SchedulingEngine"];
    if (schedulingEngine && typeof schedulingEngine.run === "function") {
      const result = await schedulingEngine.run({ taskName, time, metadata });
      return { taskName, time, result };
    }

    // Fallback
    return { taskName, time, result: null, message: "No engine available" };
  }

  async recover(err: any) {
    console.error(`[SchedulerAgent] Recovering from error:`, err);
  }
}
