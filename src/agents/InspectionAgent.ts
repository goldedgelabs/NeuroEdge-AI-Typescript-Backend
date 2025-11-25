// src/agents/InspectionAgent.ts
import fs from "fs";
import path from "path";
import { agentManager, registerAgent } from "../core/agentManager";
import { engineManager, registerEngine } from "../core/engineManager";
import { db } from "../db/dbManager";
import { eventBus } from "../core/eventBus";
import { logger } from "../utils/logger";

export class InspectionAgent {
  name = "InspectionAgent";

  agentsPath = path.join(__dirname);
  enginesPath = path.join(__dirname, "../engines");

  constructor() {
    logger.log(`[InspectionAgent] Initialized`);
  }

  async scanAndRegisterAgents() {
    const files = fs.readdirSync(this.agentsPath);
    for (const file of files) {
      if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;
      const agentName = file.replace(/\.(ts|js)$/, "");
      if (agentManager[agentName]) continue; // Already registered

      const modulePath = path.join(this.agentsPath, file);
      const AgentClass = require(modulePath)[agentName];
      if (!AgentClass) continue;

      const instance = new AgentClass();
      registerAgent(agentName, instance);

      logger.log(`[InspectionAgent] Registered agent: ${agentName}`);
    }
  }

  async scanAndRegisterEngines() {
    const files = fs.readdirSync(this.enginesPath);
    for (const file of files) {
      if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;
      const engineName = file.replace(/\.(ts|js)$/, "");
      if (engineManager[engineName]) continue; // Already registered

      const modulePath = path.join(this.enginesPath, file);
      const EngineClass = require(modulePath)[engineName];
      if (!EngineClass) continue;

      const instance = new EngineClass();
      registerEngine(engineName, instance);

      logger.log(`[InspectionAgent] Registered engine: ${engineName}`);
    }
  }

  async wireAgentsToEnginesDynamic() {
    for (const agentName of Object.keys(agentManager)) {
      // Skip self to avoid recursion
      if (agentName === this.name) continue;

      eventBus.subscribe(`${agentName}:update`, async (payload: any) => {
        for (const engineName of Object.keys(engineManager)) {
          const engine = engineManager[engineName];
          if (engine && typeof engine.run === "function") {
            try {
              await engine.run(payload);
              logger.log(`[InspectionAgent] Agent ${agentName} → Engine ${engineName} triggered`);
            } catch (err) {
              logger.error(`[InspectionAgent] Error triggering ${engineName} from ${agentName}:`, err);
            }
          }
        }
      });
    }
  }

  async runFullScan() {
    await this.scanAndRegisterAgents();
    await this.scanAndRegisterEngines();
    await this.wireAgentsToEnginesDynamic();
    logger.log(`[InspectionAgent] Full scan completed.`);
  }
}
