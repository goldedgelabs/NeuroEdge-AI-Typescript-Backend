import { AgentBase } from "./AgentBase";
import { eventBus } from "../core/engineManager";

export class PlannerAgent extends AgentBase {
  constructor() {
    super("PlannerAgent");
  }

  async run(input?: any) {
    console.log(`[PlannerAgent] Running planner with input:`, input);

    // Example: generate plan based on tasks or goals
    const plan = this.generatePlan(input?.tasks || []);

    // Publish event for other agents or engines
    eventBus.publish("plan:generated", plan);

    return plan;
  }

  async recover(err: any) {
    console.error(`[PlannerAgent] Recovering from error:`, err);
  }

  private generatePlan(tasks: any[]) {
    // Simple placeholder plan: just order tasks by priority
    const sortedTasks = tasks.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const plan = sortedTasks.map((task, idx) => ({ step: idx + 1, task }));
    console.log(`[PlannerAgent] Generated plan:`, plan);
    return plan;
  }
}
