// src/agents/PlannerAgent.ts
import { engineManager } from "../core/engineManager";

export class PlannerAgent {
  name = "PlannerAgent";

  constructor() {
    // Initialization logic
  }

  async run(task: string, context: any = {}) {
    // Example: Use engines
    const analyticsResult = await engineManager["AnalyticsEngine"].run({ task, context });
    return { task, analytics: analyticsResult };
  }

  async recover(err: any) {
    console.error(`[PlannerAgent] Recovered from error:`, err);
  }

  // Optional: inter-agent communication
  async talkTo(agentName: string, method: string, payload: any) {
    const agent = (globalThis as any).__NE_AGENT_MANAGER[agentName];
    if (agent && typeof agent[method] === "function") {
      return agent[method](payload);
    }
    return null;
  }
}
