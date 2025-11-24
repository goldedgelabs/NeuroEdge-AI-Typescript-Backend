// src/engines/SelfHealingEngine/index.ts
import { EngineBase } from "../EngineBase";
import { engineManager } from "../core/engineManager";
import { agentManager } from "../core/agentManager";
import { logger } from "../utils/logger";

export class SelfHealingEngine extends EngineBase {
    name = "SelfHealingEngine";

    constructor() {
        super();
    }

    checkEngineStatus(engineName: string) {
        const engine = engineManager.get(engineName);
        if (!engine) return { status: "offline", message: "Engine not found" };
        return { status: "online", memorySafe: true }; // extend with real metrics later
    }

    recoverEngine(engineName: string) {
        const status = this.checkEngineStatus(engineName);
        if (status.status === "online") return `${engineName} is healthy`;
        try {
            engineManager.restart(engineName);
            logger.log(`[SelfHealing] Restarted ${engineName} successfully`);
            return `${engineName} restarted successfully`;
        } catch (e) {
            logger.error(`[SelfHealing] Failed to restart ${engineName}`, e);
            return `Failed to restart ${engineName}`;
        }
    }

    autoHealAll() {
        const allEngines = engineManager.listAll();
        const report: Record<string, string> = {};
        allEngines.forEach((eng: string) => {
            report[eng] = this.recoverEngine(eng);
        });
        return report;
    }

    runDiagnostics() {
        const allEngines = engineManager.listAll();
        const diagnostics: Record<string, any> = {};
        allEngines.forEach((eng: string) => {
            diagnostics[eng] = this.checkEngineStatus(eng);
        });
        return diagnostics;
    }

    integrateWithAgents() {
        agentManager.registerRecoveryAgent(this);
        return "Recovery agent registered with all agents";
    }
}
