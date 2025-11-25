import { engineManager, runEngineChain } from "../core/engineManager";
import { agentManager } from "../core/agentManager";
import { db } from "../db/dbManager";
import { replicateEdgeToShared } from "../db/replication";
import { eventBus } from "../core/eventBus";
import { logger } from "../utils/logger";

async function main() {
  logger.log("=== NeuroEdge Full Integration & Stress Test ===");

  // -----------------------------
  // 1. Clear all DBs
  // -----------------------------
  await db.clearAll("edge");
  await db.clearAll("shared");
  logger.log("[TEST] Cleared all Edge & Shared DB");

  // -----------------------------
  // 2. Generate dummy inputs for all engines
  // -----------------------------
  const dummyInputs: Record<string, any> = {};
  Object.keys(engineManager).forEach(engineName => {
    dummyInputs[engineName] = {
      id: `${engineName}_001`,
      data: `Test data for ${engineName}`,
      folder: "test",
      role: "admin"
    };
  });

  // -----------------------------
  // 3. Run all engines in sequence
  // -----------------------------
  logger.log("[TEST] Running all 42 engines sequentially...");

  for (const engineName of Object.keys(engineManager)) {
    if (typeof engineManager[engineName].run === "function") {
      const result = await engineManager[engineName].run(dummyInputs[engineName]);
      logger.log(`[TEST] Engine ${engineName} run result:`, result);
    }
  }

  // -----------------------------
  // 4. Check edge DB and replicate
  // -----------------------------
  logger.log("[TEST] Replicating edge DB → shared DB");
  const collections = await db.listCollections("edge");
  for (const col of collections) {
    await replicateEdgeToShared(col);
  }

  // -----------------------------
  // 5. Fire db:update events to all agents
  // -----------------------------
  logger.log("[TEST] Triggering db:update events for agents");
  const edgeData = await db.getAllCollections("edge");
  for (const collection of Object.keys(edgeData)) {
    for (const record of edgeData[collection]) {
      eventBus.publish("db:update", {
        collection,
        key: record.id,
        value: record,
        source: "StressTest"
      });
    }
  }

  // -----------------------------
  // 6. Simulate agent self-healing and Doctrine enforcement
  // -----------------------------
  logger.log("[TEST] Triggering agent self-healing and doctrine enforcement");
  for (const agentName of Object.keys(agentManager)) {
    const agent = agentManager[agentName];
    if (typeof agent.recover === "function") {
      await agent.recover(new Error("Simulated failure"));
    }
  }

  // -----------------------------
  // 7. Check final state in shared DB
  // -----------------------------
  const finalShared = await db.getAllCollections("shared");
  logger.log("[TEST] Final state in Shared DB:", finalShared);

  logger.log("=== Full Integration & Stress Test Completed Successfully ===");
}

main().catch(err => {
  console.error("[TEST] Fatal error:", err);
});
