import fs from "fs";
import path from "path";
import { engineManager, registerEngine, eventBus } from "../core/engineManager";
import { agentManager, registerAgent } from "../core/agentManager";
import { db } from "../db/dbManager";
import { logger } from "../utils/logger";

export class InspectionAgent {
  name = "InspectionAgent";

  constructor() {
    logger.log(`[InspectionAgent] Initialized`);
  }

  /** Scan folder recursively for .ts files */
  scanFolder(folderPath: string): string[] {
    let results: string[] = [];
    const items = fs.readdirSync(folderPath);

    for (const item of items) {
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(this.scanFolder(fullPath));
      } else if (fullPath.endsWith(".ts")) {
        results.push(fullPath);
      }
    }

    return results;
  }

  /** Dynamically register all engines */
  inspectEngines(folderPath: string) {
    const files = this.scanFolder(folderPath);

    files.forEach(file => {
      const EngineClass = require(file).default || require(file);
      if (!EngineClass) return;

      const engineName = EngineClass.name;
      if (!engineManager[engineName]) {
        logger.log(`[InspectionAgent] Registering Engine: ${engineName}`);
        registerEngine(engineName, new EngineClass());
      }
    });
  }

  /** Dynamically register all agents */
  inspectAgents(folderPath: string) {
    const files = this.scanFolder(folderPath);

    files.forEach(file => {
      const AgentClass = require(file).default || require(file);
      if (!AgentClass) return;

      const agentName = AgentClass.name;
      if (!agentManager[agentName]) {
        logger.log(`[InspectionAgent] Registering Agent: ${agentName}`);
        const agentInstance = new AgentClass();

        // Auto-wire DB events
        if (typeof agentInstance.handleDBUpdate === "function") {
          eventBus.subscribe("db:update", async (event: any) => {
            await agentInstance.handleDBUpdate(event);
          });
        }

        if (typeof agentInstance.handleDBDelete === "function") {
          eventBus.subscribe("db:delete", async (event: any) => {
            await agentInstance.handleDBDelete(event);
          });
        }

        registerAgent(agentName, agentInstance);
      }
    });
  }

  /** Full system inspection and wiring */
  runInspection() {
    logger.log(`[InspectionAgent] Running full system inspection...`);

    const enginesFolder = path.resolve(__dirname, "../engines");
    const agentsFolder = path.resolve(__dirname, "../agents");

    this.inspectEngines(enginesFolder);
    this.inspectAgents(agentsFolder);

    logger.log(`[InspectionAgent] Inspection and auto-wiring complete.`);
  }

  /** Unregister engine dynamically */
  unregisterEngine(name: string) {
    if (engineManager[name]) {
      delete engineManager[name];
      logger.log(`[InspectionAgent] Engine unregistered: ${name}`);
    }
  }

  /** Unregister agent dynamically */
  unregisterAgent(name: string) {
    if (agentManager[name]) {
      delete agentManager[name];
      logger.log(`[InspectionAgent] Agent unregistered: ${name}`);
    }
  }

  /** Replicate edge DB data to shared DB automatically */
  async replicateEdgeToShared(collection: string) {
    const edgeRecords = await db.getAll(collection, "edge");
    for (const record of edgeRecords) {
      await db.set(collection, record.id, record, "shared");
    }
    logger.log(`[InspectionAgent] Replicated ${collection} from edge → shared`);
  }
}
