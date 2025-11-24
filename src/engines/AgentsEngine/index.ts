// src/engines/AgentsEngine/index.ts
import { EngineBase } from "../EngineBase";
import { survivalCheck } from "./survival_check";
import { orchestrateTask } from "./agentOrchestrator";
import { logger } from "../../utils/logger";

export class AgentsEngine extends EngineBase {
    name = "AgentsEngine";

    constructor() {
        super();
        const status = survivalCheck();
        if (!status.online) logger.warn(`[${this.name}] Offline mode activated`);
        logger.log(`[${this.name}] Initialized with ${status.activeAgents} active agents`);
    }

    async runTask(task: string, context: any = {}) {
        return await orchestrateTask(task, context);
    }
}
