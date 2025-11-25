import { AgentBase } from "./AgentBase";
import { agentManager, eventBus } from "../core/engineManager";

export class SecurityCheckAgent extends AgentBase {
  constructor() {
    super("SecurityCheckAgent");
  }

  /**
   * Perform detailed security checks on systems, engines, or agents
   * input example: { target: "engine" | "agent", name?: string }
   */
  async run(input?: any) {
    if (!input) return { error: "No input provided" };
    const { target, name } = input;

    console.log(`[SecurityCheckAgent] Running security check on ${target}${name ? ":" + name : ""}`);

    let result = null;

    // Example: check specific engine
    if (target === "engine" && name) {
      const engine = agentManager[name];
      if (engine && typeof engine.run === "function") {
        result = await engine.run({ type: "securityAudit" });
      } else {
        result = { error: "Engine not found or not runnable" };
      }
    }

    // Example: check all engines if no specific name
    if (target === "engine" && !name) {
      result = {};
      for (const key in agentManager) {
        if (key.endsWith("Engine") && typeof agentManager[key].run === "function") {
          result[key] = await agentManager[key].run({ type: "securityAudit" });
        }
      }
    }

    // Future: could also check agents, files, DB, etc.

    return { target, name, result };
  }

  async recover(err: any) {
    console.error(`[SecurityCheckAgent] Recovering from error:`, err);
  }
}
