// src/bootstrap.ts

import { InspectionAgent } from "./agents/InspectionAgent";
import { engineManager } from "./core/engineManager";
import { agentManager } from "./core/agentManager";
import { db } from "./db/dbManager";
import { logger } from "./utils/logger";

// Optional: configure paths here
const AGENTS_FOLDER = "./src/agents";
const ENGINES_FOLDER = "./src/engines";

async function bootstrap() {
  logger.log("[Bootstrap] Starting NeuroEdge backend...");

  // 1. Initialize InspectionAgent (auto-registers engines & agents)
  const inspectionAgent = new InspectionAgent();
  await inspectionAgent.initialize({
    agentsFolder: AGENTS_FOLDER,
    enginesFolder: ENGINES_FOLDER
  });

  // 2. Initialize event bus (already wired by engineManager and agentManager)
  logger.log("[Bootstrap] Event bus ready.");

  // 3. Initialize database (edge + shared for offline-first)
  await db.initialize(); // Assuming dbManager has initialize method
  logger.log("[Bootstrap] DB initialized and ready.");

  // 4. Optionally, run initial edge → shared replication
  const collections = ["medicine", "predictions", "logs", "analytics"];
  for (const collection of collections) {
    const records = await db.getAll(collection, "edge");
    for (const record of records) {
      await db.set(collection, record.id, record, "shared");
    }
  }
  logger.log("[Bootstrap] Edge → Shared replication complete.");

  // 5. Initialize Doctrine (already part of engineManager)
  logger.log("[Bootstrap] Doctrine enforcement active.");

  // 6. Self-healing checks for engines & agents
  Object.values(engineManager).forEach((engine: any) => {
    if (typeof engine.survivalCheck === "function") engine.survivalCheck();
  });

  Object.values(agentManager).forEach((agent: any) => {
    if (typeof agent.survivalCheck === "function") agent.survivalCheck();
  });

  logger.log("[Bootstrap] NeuroEdge backend fully initialized.");
  return { engineManager, agentManager, inspectionAgent };
}

// Auto-run bootstrap if executed directly
if (require.main === module) {
  bootstrap().then(() => {
    logger.log("[Bootstrap] NeuroEdge is live!");
  }).catch(err => {
    logger.error("[Bootstrap] Initialization failed:", err);
  });
}

export default bootstrap;
