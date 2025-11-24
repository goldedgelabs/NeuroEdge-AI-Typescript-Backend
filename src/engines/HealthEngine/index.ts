import { EngineBase } from "../EngineBase";
import { logger } from "../../utils/logger";

export class HealthEngine extends EngineBase {
  constructor() {
    super();
    this.survivalCheck();
  }

  async survivalCheck() {
    logger.log("HealthEngine is alive and monitoring systems...");
  }

  async run(input: any) {
    logger.log("HealthEngine processing input:", input);
    // Example: trigger MedicineManagementAgent
    if ((globalThis as any).__NE_AGENT_MANAGER?.MedicineManagementAgent) {
      const agent = (globalThis as any).__NE_AGENT_MANAGER.MedicineManagementAgent;
      await agent.process(input);
    }
    return { status: "HealthEngine completed task" };
  }

  async recover(err: any) {
    logger.error("HealthEngine recovered from error:", err);
  }
}
