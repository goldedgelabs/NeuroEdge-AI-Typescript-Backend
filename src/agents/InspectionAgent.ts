// src/agents/InspectionAgent.ts

import { readdirSync, statSync } from "fs";
import { join } from "path";
import { engineManager } from "../core/engineManager";
import { agentManager } from "../core/agentManager";
import { db } from "../db/dbManager";
import { eventBus } from "../core/engineManager";
import { logger } from "../utils/logger";

export class InspectionAgent {
  name = "InspectionAgent";

  constructor() {
    logger.log(`[${this.name}] Initialized`);
  }

  /**
   * Scan a folder recursively and return .ts files
   */
  scanFolder(folderPath: string): string[] {
    const files: string[] = [];
    const items = readdirSync(folderPath);

    items.forEach(item => {
      const fullPath = join(folderPath, item);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        files.push(...this.scanFolder(fullPath));
      } else if (stats.isFile() && fullPath.endsWith(".ts")) {
        files.push(fullPath);
      }
    });

    return files;
  }

  /**
   * Load and register all engines
   */
  async registerEngines(enginesFolder: string) {
    const files = this.scanFolder(enginesFolder);
    for (const file of files) {
      const module = await import(file);
      const EngineClass = module.default || Object.values(module)[0];
      if (!EngineClass) continue;

      const engineName = EngineClass.name;
      if (!engineManager[engineName]) {
        const instance = new EngineClass();
        engineManager[engineName] = instance;
        logger.log(`[InspectionAgent] Registered Engine: ${engineName}`);
      }
    }
  }

  /**
   * Load and register all agents
   */
  async registerAgents(agentsFolder: string) {
    const files = this.scanFolder(agentsFolder);
    for (const file of files) {
      const module = await import(file);
      const AgentClass = module.default || Object.values(module)[0];
      if (!AgentClass) continue;

      const agentName = AgentClass.name;
      if (!agentManager[agentName]) {
        const instance = new AgentClass();
        agentManager[agentName] = instance;
        logger.log(`[InspectionAgent] Registered Agent: ${agentName}`);
      }
    }
  }

  /**
   * Handle DB update events
   */
  async handleDBUpdate(event: any) {
    logger.log(`[InspectionAgent] DB Update:`, event);
    // Example: trigger specific agent reactions
    // e.g., resync new engines/agents after DB update
  }

  /**
   * Handle DB delete events
   */
  async handleDBDelete(event: any) {
    logger.log(`[InspectionAgent] DB Delete:`, event);
    // Example: unregister removed engines/agents
  }

  /**
   * Wire event bus subscriptions
   */
  subscribeToEvents() {
    eventBus.subscribe("db:update", this.handleDBUpdate.bind(this));
    eventBus.subscribe("db:delete", this.handleDBDelete.bind(this));
  }

  /**
   * Full initialization routine
   */
  async initialize({ agentsFolder, enginesFolder }: { agentsFolder: string; enginesFolder: string }) {
    await this.registerEngines(enginesFolder);
    await this.registerAgents(agentsFolder);
    this.subscribeToEvents();
    logger.log(`[${this.name}] Initialization complete. Engines and Agents synced.`);
  }
  }
