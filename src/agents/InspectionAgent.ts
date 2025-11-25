// src/agents/InspectionAgent.ts
import { engineManager, registerEngine } from "../core/engineManager";
import { agentManager, registerAgent, wireDBSubscriptions } from "../core/agentManager";
import { replicateEdgeToShared } from "../db/replication";
import { logger } from "../utils/logger";
import fs from "fs";
import path from "path";

export class InspectionAgent {
  name = "InspectionAgent";
  private intervalId: NodeJS.Timer | null = null;

  constructor() {
    logger.log(`[InspectionAgent] Initialized`);
  }

  private scanFolder(folderPath: string): string[] {
    let results: string[] = [];
    if (!fs.existsSync(folderPath)) return results;
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(this.scanFolder(fullPath));
      } else if (stat.isFile() && (file.endsWith(".ts") || file.endsWith(".js"))) {
        results.push(fullPath);
      }
    }
    return results;
  }

  private async inspectEngines(enginesFolder: string) {
    const engineFiles = this.scanFolder(enginesFolder);
    for (const filePath of engineFiles) {
      const EngineModule = await import(filePath);
      const EngineClass = EngineModule.default || Object.values(EngineModule)[0];
      if (!EngineClass) continue;
      const instance = new EngineClass();
      const name = instance.name || EngineClass.name;
      if (!engineManager[name]) {
        registerEngine(name, instance);
        logger.log(`[InspectionAgent] Engine registered: ${name}`);
        // Replicate engine registration to shared DB
        await replicateEdgeToShared("engines");
      }
    }
  }

  private async inspectAgents(agentsFolder: string) {
    const agentFiles = this.scanFolder(agentsFolder);
    for (const filePath of agentFiles) {
      const AgentModule = await import(filePath);
      const AgentClass = AgentModule.default || Object.values(AgentModule)[0];
      if (!AgentClass) continue;
      const instance = new AgentClass();
      const name = instance.name || AgentClass.name;
      if (!agentManager[name]) {
        registerAgent(name, instance);
        wireDBSubscriptions(name);
        logger.log(`[InspectionAgent] Agent registered: ${name}`);
        // Replicate agent registration to shared DB
        await replicateEdgeToShared("agents");
      }
    }
  }

  private cleanup(enginesFolder: string, agentsFolder: string) {
    // Unregister deleted engines
    for (const name of Object.keys(engineManager)) {
      const enginePath = path.join(enginesFolder, name + ".ts");
      if (!fs.existsSync(enginePath)) {
        delete engineManager[name];
        logger.log(`[InspectionAgent] Engine unregistered: ${name}`);
      }
    }

    // Unregister deleted agents
    for (const name of Object.keys(agentManager)) {
      const agentPath = path.join(agentsFolder, name + ".ts");
      if (!fs.existsSync(agentPath)) {
        delete agentManager[name];
        logger.log(`[InspectionAgent] Agent unregistered: ${name}`);
      }
    }
  }

  public async runOnce(enginesFolder: string, agentsFolder: string) {
    logger.log(`[InspectionAgent] Running inspection...`);
    await this.inspectEngines(enginesFolder);
    await this.inspectAgents(agentsFolder);
    this.cleanup(enginesFolder, agentsFolder);
    logger.log(`[InspectionAgent] Inspection completed.`);
  }

  public startPeriodicInspection(enginesFolder: string, agentsFolder: string, intervalMs: number = 60000) {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(async () => {
      try {
        await this.runOnce(enginesFolder, agentsFolder);
      } catch (err) {
        logger.error(`[InspectionAgent] Periodic inspection error:`, err);
      }
    }, intervalMs);
    logger.log(`[InspectionAgent] Periodic inspection started (every ${intervalMs} ms)`);
  }

  public stopPeriodicInspection() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.log(`[InspectionAgent] Periodic inspection stopped`);
    }
  }
  }
