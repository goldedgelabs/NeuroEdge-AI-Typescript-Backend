import { EngineBase } from "../EngineBase";
import { logger } from "../../utils/logger";

export class GoldEdgeIntegrationEngine extends EngineBase {
  constructor() {
    super();
    this.survivalCheck();
  }

  async survivalCheck() {
    logger.log("GoldEdgeIntegrationEngine active: ready to integrate apps...");
  }

  async run(input: any) {
    logger.log("GoldEdgeIntegrationEngine processing input:", input);
    const agentManager = (globalThis as any).__NE_AGENT_MANAGER;
    if (agentManager?.GoldEdgeIntegrationAgent) {
      await agentManager.GoldEdgeIntegrationAgent.integrate(input);
    }
    return { status: "GoldEdgeIntegrationEngine completed task" };
  }

  async recover(err: any) {
    logger.error("GoldEdgeIntegrationEngine recovered from error:", err);
  }
}
