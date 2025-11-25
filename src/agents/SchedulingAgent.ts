import { AgentBase } from "./AgentBase";
import { agentManager, eventBus } from "../core/engineManager";

export class SchedulingAgent extends AgentBase {
  constructor() {
    super("SchedulingAgent");
  }

  /**
   * Main method to handle scheduling requests
   * input example: { task: string, datetime: string, metadata?: any }
   */
  async run(input?: any) {
    if (!input) return { error: "No input provided" };
    const { task, datetime, metadata } = input;

    console.log(`[SchedulingAgent] Received task: ${task} at ${datetime}`);

    // Trigger SchedulingEngine if registered
    const schedulingEngine = agentManager["SchedulingEngine"];
    if (schedulingEngine && typeof schedulingEngine.run === "function") {
      const result = await schedulingEngine.run({ task, datetime, metadata });
      return { task, datetime, result };
    }

    return { task, datetime, result: null, message: "SchedulingEngine not available" };
  }

  async recover(err: any) {
    console.error(`[SchedulingAgent] Recovering from error:`, err);
  }
}
