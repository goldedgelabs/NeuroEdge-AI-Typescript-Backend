// src/agents/InspectionAgent.ts
import { engineManager } from "../core/engineManager";
import { agentManager } from "../core/agentManager";
import { db } from "../db/dbManager";
import { eventBus } from "../core/eventBus";
import { logger } from "../utils/logger";

export class InspectionAgent {
  name = "InspectionAgent";

  constructor() {
    logger.log(`[InspectionAgent] Initialized`);
  }

  /**
   * Scan all agents and engines, register them, wire events automatically
   */
  async inspectAndWire() {
    logger.log(`[InspectionAgent] Starting inspection...`);

    // 1. Inspect agents
    for (const agentName of Object.keys(agentManager)) {
      const agent = agentManager[agentName];
      if (!agent) continue;

      // Automatically wire DB updates to eventBus
      if (!agent.__wired) {
        for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(agent))) {
          if (typeof agent[method] === "function") {
            const orig = agent[method].bind(agent);
            agent[method] = async (...args: any[]) => {
              const result = await orig(...args);

              // If returns collection/id, update DB and publish
              if (result?.collection && result?.id) {
                await db.set(result.collection, result.id, result, "edge");
                eventBus.publish(`${agentName}:update`, result);
                logger.log(`[InspectionAgent] ${agentName}.${method} updated DB → eventBus`);
              }

              return result;
            };
          }
        }
        agent.__wired = true; // mark as wired
      }
    }

    // 2. Inspect engines
    for (const engineName of Object.keys(engineManager)) {
      const engine = engineManager[engineName];
      if (!engine) continue;

      // Automatically wire DB updates from engine methods
      if (!engine.__wired) {
        for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(engine))) {
          if (typeof engine[method] === "function") {
            const orig = engine[method].bind(engine);
            engine[method] = async (...args: any[]) => {
              const result = await orig(...args);
              if (result?.collection && result?.id) {
                await db.set(result.collection, result.id, result, "edge");
                eventBus.publish(`${engineName}:update`, result);
                logger.log(`[InspectionAgent] ${engineName}.${method} updated DB → eventBus`);
              }
              return result;
            };
          }
        }
        engine.__wired = true;
      }
    }

    logger.log(`[InspectionAgent] Inspection and wiring complete`);
  }
}
