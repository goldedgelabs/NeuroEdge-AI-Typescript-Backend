import { AgentBase } from "./AgentBase";
import { engineManager, agentManager, eventBus } from "../core/engineManager";

export class SupervisorAgent extends AgentBase {
  constructor() {
    super("SupervisorAgent");
  }

  /**
   * Supervises the execution of other agents and engines.
   * Can trigger alerts, retries, or corrective actions if something fails.
   */
  async run(input?: any) {
    const { targetAgent, targetEngine, task } = input || {};

    if (!targetAgent && !targetEngine) {
      return { error: "No target agent or engine specified for supervision." };
    }

    console.log(`[SupervisorAgent] Supervising task:`, task || "general supervision");

    // Example supervision logic
    if (targetAgent && agentManager[targetAgent]) {
      try {
        return await agentManager[targetAgent].run(task);
      } catch (err) {
        console.warn(`[SupervisorAgent] Detected failure in agent ${targetAgent}. Attempting recovery.`);
        if (typeof agentManager[targetAgent].recover === "function") {
          await agentManager[targetAgent].recover(err);
        }
        return { error: "Recovered from agent failure" };
      }
    }

    if (targetEngine && engineManager[targetEngine]) {
      try {
        return await engineManager[targetEngine].run(task);
      } catch (err) {
        console.warn(`[SupervisorAgent] Detected failure in engine ${targetEngine}.`);
        if (typeof engineManager[targetEngine].recover === "function") {
          await engineManager[targetEngine].recover(err);
        }
        return { error: "Recovered from engine failure" };
      }
    }

    return { message: "Supervision completed." };
  }

  async recover(err: any) {
    console.error(`[SupervisorAgent] Recovering from error:`, err);
  }
  }
