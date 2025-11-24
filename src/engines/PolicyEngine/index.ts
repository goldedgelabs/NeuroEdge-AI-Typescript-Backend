import { EngineBase } from "../EngineBase";
import { logger } from "../../utils/logger";

export class PolicyEngine extends EngineBase {
  constructor() {
    super();
    this.name = "PolicyEngine";
    this.survivalCheck();
  }

  async survivalCheck() {
    logger.info(`[${this.name}] Performing survival check...`);
    // Ensure policy rules are loaded
    return true;
  }

  /**
   * run function
   * @param input - { action: string, role: string, context?: any }
   */
  async run(input: { action: string; role: string; context?: any }) {
    logger.info(`[${this.name}] Evaluating policy for action: ${input.action}`);

    // Simple mock policy evaluation
    const allowedRoles = ["admin", "founder"];
    const isAllowed = allowedRoles.includes(input.role);

    return {
      action: input.action,
      allowed: isAllowed,
      message: isAllowed
        ? "Action permitted by PolicyEngine"
        : "Action denied by PolicyEngine",
    };
  }

  async recover(err: any) {
    logger.error(`[${this.name}] Error recovered:`, err);
    return { status: "recovered", message: "PolicyEngine recovered" };
  }

  async talkTo(engineName: string, method: string, payload: any) {
    const engine = (globalThis as any).__NE_ENGINE_MANAGER[engineName];
    if (engine && typeof engine[method] === "function") {
      return engine[method](payload);
    }
    return null;
  }
}

// Optional: register immediately
// registerEngine("PolicyEngine", new PolicyEngine());
