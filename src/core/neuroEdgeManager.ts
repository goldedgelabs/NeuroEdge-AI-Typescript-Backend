// src/core/neuroEdgeManager.ts
/**
 * NeuroEdge Full Manager
 * ----------------------
 * Central manager that integrates:
 *  - All Engines (42+)
 *  - All Agents (63+)
 *  - DB integration
 *  - Event bus
 *  - Doctrine enforcement
 *  - Self-healing
 *  - Automatic engine → agent triggering
 */

import { engineManager } from "./engineManager";
import { agentManager } from "./agentManager";
import { db } from "../db/dbManager";
import { eventBus } from "./eventBus";
import { logger } from "../utils/logger";

// -----------------------------
// Engine → Agent Trigger
// -----------------------------
// Example: HealthEngine updates medicine → triggers MedicineManagementAgent
eventBus.subscribe("engine:output", async (payload) => {
  const { engine, output } = payload;

  // Example mapping, you can expand
  if (engine === "HealthEngine" && output?.collection === "medicine") {
    const agent = agentManager["MedicineManagementAgent"];
    if (agent?.handleEngineOutput) {
      await agent.handleEngineOutput(output);
      logger.log(`[NeuroEdgeManager] Engine ${engine} triggered MedicineManagementAgent`);
    }
  }

  // Add more mappings as needed for other engines → agents
});

// -----------------------------
// Engine proxy override to emit engine:output
// -----------------------------
Object.keys(engineManager).forEach((engineName) => {
  const originalEngine = engineManager[engineName];

  engineManager[engineName] = new Proxy(originalEngine, {
    get(target: any, prop: string) {
      const origMethod = target[prop];
      if (typeof origMethod === "function") {
        return async (...args: any[]) => {
          const result = await origMethod.apply(target, args);

          // Emit to eventBus for agents
          if (result !== undefined) {
            eventBus.publish("engine:output", { engine: engineName, method: prop, output: result });
          }

          return result;
        };
      }
      return origMethod;
    },
  });
});

// -----------------------------
// Agent → DB integration (already in agentManager)
// -----------------------------
// Each agent writes to DB automatically via its proxy
// And fires db:update events handled by other agents or engine triggers

// -----------------------------
// EventBus for engine-agent sync
// -----------------------------
export async function triggerEngineChain(chain: { engine: string; input?: any }[]) {
  let lastOutput: any = null;
  for (const step of chain) {
    const engine = engineManager[step.engine];
    if (!engine) throw new Error(`Engine not registered: ${step.engine}`);
    if (typeof engine.run === "function") {
      lastOutput = await engine.run(step.input ?? lastOutput);
    } else if (typeof engine === "function") {
      lastOutput = await engine(step.input ?? lastOutput);
    } else {
      lastOutput = null;
    }
  }
  return lastOutput;
}

// -----------------------------
// Automatic DB replication (Edge → Shared)
// -----------------------------
export async function replicateEdgeToShared(collection: string) {
  const edgeRecords = await db.getAll(collection, "edge");
  for (const record of edgeRecords) {
    await db.set(collection, record.id, record, "shared");
    eventBus.publish("db:replicate", { collection, key: record.id, value: record });
    logger.log(`[NeuroEdgeManager] Replicated ${collection}:${record.id} to shared DB`);
  }
}

// -----------------------------
// Global reference
// -----------------------------
(globalThis as any).__NE_FULL_MANAGER = {
  engineManager,
  agentManager,
  triggerEngineChain,
  replicateEdgeToShared,
  eventBus,
};
