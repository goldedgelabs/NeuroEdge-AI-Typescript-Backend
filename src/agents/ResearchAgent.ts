import { AgentBase } from "./AgentBase";
import { eventBus, agentManager } from "../core/engineManager";

export class ResearchAgent extends AgentBase {
  constructor() {
    super("ResearchAgent");
  }

  /**
   * Run method to perform research tasks
   * input example: { topic: string, parameters?: any }
   */
  async run(input?: any) {
    if (!input) return { error: "No input provided" };
    const { topic, parameters } = input;

    console.log(`[ResearchAgent] Conducting research on topic: ${topic}`);

    // Example: trigger ResearchEngine if available
    const researchEngine = agentManager["ResearchEngine"];
    if (researchEngine && typeof researchEngine.run === "function") {
      const results = await researchEngine.run({ topic, parameters });
      return { topic, results };
    }

    // Fallback
    return { topic, results: [], message: "No engine available" };
  }

  async recover(err: any) {
    console.error(`[ResearchAgent] Recovering from error:`, err);
  }
}
