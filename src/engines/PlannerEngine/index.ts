import { EngineBase } from "../EngineBase";
import { logger } from "../../utils/logger";

export class PlannerEngine extends EngineBase {
  constructor() {
    super();
    this.name = "PlannerEngine";
    this.survivalCheck();
  }

  async survivalCheck() {
    logger.info(`[${this.name}] Performing survival check...`);
    // Ensure planning modules are ready
    return true;
  }

  /**
   * run function
   * @param input - { tasks: Array<{name: string, priority: number}>, options?: any }
   */
  async run(input: { tasks: any[]; options?: any }) {
    logger.info(`[${this.name}] Running task planning...`);

    if (!input.tasks || !Array.isArray(input.tasks)) {
      return { error: "No tasks provided" };
    }

    // Simple prioritization logic
    const sortedTasks = input.tasks.sort(
      (a, b) => (b.priority || 0) - (a.priority || 0)
    );

    return { status: "ok", plannedTasks: sortedTasks };
  }

  async recover(err: any) {
    logger.error(`[${this.name}] Error recovered:`, err);
    return { status: "recovered", message: "PlannerEngine recovered" };
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
// registerEngine("PlannerEngine", new PlannerEngine());
