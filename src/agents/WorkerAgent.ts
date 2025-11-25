import { AgentBase } from "./AgentBase";
import { eventBus } from "../core/engineManager";

export class WorkerAgent extends AgentBase {
  constructor() {
    super("WorkerAgent");
  }

  /**
   * Executes tasks assigned by engines or other agents.
   * Can handle async jobs, distributed tasks, or simple computations.
   */
  async run(input: { task: string; payload?: any }) {
    const { task, payload } = input || {};

    if (!task) {
      return { error: "WorkerAgent requires a 'task' field." };
    }

    console.log(`[WorkerAgent] Executing task: ${task}`, payload);

    // Simulate task execution (replace with real logic)
    const result = await this.executeTask(task, payload);

    // Publish event when task completes
    eventBus.publish("task:completed", { task, result });

    return { success: true, task, result };
  }

  private async executeTask(task: string, payload: any) {
    // Placeholder: real task execution logic goes here
    // Example: could call engines, perform calculations, or manage files
    return { simulatedResult: `Task "${task}" executed successfully.` };
  }

  async recover(err: any) {
    console.error(`[WorkerAgent] Error executing task:`, err);
    // Optional: retry logic or fallback
  }
}
