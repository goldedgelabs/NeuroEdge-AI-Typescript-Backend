import { EngineBase } from "../EngineBase";
import { logger } from "../../utils/logger";

export class SchedulingEngine extends EngineBase {
  constructor() {
    super();
    this.name = "SchedulingEngine";
    this.survivalCheck();
  }

  async survivalCheck() {
    logger.info(`[${this.name}] Performing survival check...`);
    // Ensure calendar and scheduling modules are ready
    return true;
  }

  /**
   * run function
   * @param input - { tasks: Array<{title: string, time: string, priority?: number}> }
   */
  async run(input: { tasks: Array<{ title: string; time: string; priority?: number }> }) {
    logger.info(`[${this.name}] Scheduling tasks...`, input.tasks);

    // Simple scheduling logic (mock)
    const sortedTasks = input.tasks.sort((a, b) => {
      if (a.priority && b.priority) return b.priority - a.priority;
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    return {
      scheduledTasks: sortedTasks,
      timestamp: new Date().toISOString(),
    };
  }

  async recover(err: any) {
    logger.error(`[${this.name}] Error recovered:`, err);
    return { status: "recovered", message: "SchedulingEngine recovered" };
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
// registerEngine("SchedulingEngine", new SchedulingEngine());
