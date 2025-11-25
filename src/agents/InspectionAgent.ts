// src/agents/InspectionAgent.ts
import { engineManager } from "../core/engineManager";
import { agentManager, registerAgent, wireDBSubscriptions } from "../core/agentManager";
import { logger } from "../utils/logger";
import fs from "fs";
import path from "path";

export class InspectionAgent {
  name = "InspectionAgent";

  constructor() {
    logger.log(`[InspectionAgent] Initialized`);
  }

  /**
   * Recursively scan a folder for files
   */
  private scanFolder(folderPath: string): string[] {
    let results: string[] = [];
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

  /**
   * Inspect Engines folder, identify new engines, and register them
   */
  public async inspectEngines(enginesFolder: string) {
    const engineFiles = this.scanFolder(enginesFolder);
    for (const filePath of engineFiles) {
      const EngineModule = await import(filePath);
      const EngineClass = EngineModule.default || Object.values(EngineModule)[0];
      if (!EngineClass) continue;
      const instance = new EngineClass();
      const name = instance.name || EngineClass.name;
      if (!engineManager[name]) {
        // Register new engine dynamically
        const { registerEngine } = await import("../core/engineManager");
        registerEngine(name, instance);
        logger.log(`[InspectionAgent] Engine registered: ${name}`);
      }
    }
  }

  /**
   * Inspect Agents folder, identify new agents, and register them
   */
  public async inspectAgents(agentsFolder: string) {
    const agentFiles = this.scanFolder(agentsFolder);
    for (const filePath of agentFiles) {
      const AgentModule = await import(filePath);
      const AgentClass = AgentModule.default || Object.values(AgentModule)[0];
      if (!AgentClass) continue;
      const instance = new AgentClass();
      const name = instance.name || AgentClass.name;
      if (!agentManager[name]) {
        // Register new agent dynamically
        registerAgent(name, instance);
        wireDBSubscriptions(name);
        logger.log(`[InspectionAgent] Agent registered: ${name}`);
      }
    }
  }

  /**
   * Unregister removed engines/agents
   */
  public cleanup() {
    for (const name of Object.keys(engineManager)) {
      const enginePath = path.join(__dirname, "../engines", name + ".ts");
      if (!fs.existsSync(enginePath)) {
        delete engineManager[name];
        logger.log(`[InspectionAgent] Engine unregistered: ${name}`);
      }
    }

    for (const name of Object.keys(agentManager)) {
      const agentPath = path.join(__dirname, "../agents", name + ".ts");
      if (!fs.existsSync(agentPath)) {
        delete agentManager[name];
        logger.log(`[InspectionAgent] Agent unregistered: ${name}`);
      }
    }
  }

  /**
   * Full inspection run
   */
  public async run(enginesFolder: string, agentsFolder: string) {
    logger.log(`[InspectionAgent] Starting full inspection...`);
    await this.inspectEngines(enginesFolder);
    await this.inspectAgents(agentsFolder);
    this.cleanup();
    logger.log(`[InspectionAgent] Inspection completed.`);
  }
    }
