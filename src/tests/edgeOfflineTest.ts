import { engineManager, runEngineChain } from "../core/engineManager";
import { agentManager } from "../core/agentManager";
import { db } from "../db/dbManager";
import { replicateEdgeToShared } from "../db/replication";
import { eventBus } from "../core/eventBus";
import { logger } from "../utils/logger";

async function main() {
  logger.log("=== NeuroEdge Edge + Offline Test ===");

  // -----------------------------
  // 1. Clear Edge & Shared DB
  // -----------------------------
  await db.clearAll("edge");
  await db.clearAll("shared");
  logger.log("[TEST] Cleared DB");

  // -----------------------------
  // 2. Simulate offline operations
  // -----------------------------
  logger.log("[TEST] Simulate offline mode - engines write only to edge DB");

  const offlineInput = {
    id: "edge001",
    name: "EdgeMed",
    dosage: "5mg",
    manufacturer: "NeuroEdgeLabs",
    folder: "health",
    role: "admin",
  };

  // Run HealthEngine while "offline" (no replication yet)
  const offlineResult = await runEngineChain([
    { engine: "HealthEngine", input: offlineInput }
  ]);
  logger.log("[TEST] Offline HealthEngine result:", offlineResult);

  const edgeRecord = await db.get("medicine", "edge001", "edge");
  logger.log("[TEST] Record exists in edge DB:", edgeRecord);

  const sharedRecord = await db.get("medicine", "edge001", "shared");
  logger.log("[TEST] Record in shared DB should be null:", sharedRecord);

  // -----------------------------
  // 3. Simulate coming online → replicate edge → shared
  // -----------------------------
  logger.log("[TEST] Simulate online mode → replicate edge → shared DB");
  await replicateEdgeToShared("medicine");

  const replicatedSharedRecord = await db.get("medicine", "edge001", "shared");
  logger.log("[TEST] Replicated record in shared DB:", replicatedSharedRecord);

  // -----------------------------
  // 4. Trigger Agent reactions
  // -----------------------------
  logger.log("[TEST] Triggering agents subscribed to db:update");

  eventBus.publish("db:update", {
    collection: "medicine",
    key: "edge001",
    value: replicatedSharedRecord,
    source: "HealthEngine"
  });

  // Give agents some time to process
  await new Promise(resolve => setTimeout(resolve, 1000));

  logger.log("[TEST] Edge + Offline Test Completed Successfully");
}

main().catch(err => {
  console.error("[TEST] Fatal error:", err);
});
