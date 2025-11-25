import { engineManager, runEngineChain } from "../core/engineManager";
import { agentManager } from "../core/agentManager";
import { db } from "../db/dbManager";
import { replicateEdgeToShared } from "../db/replication";
import { eventBus } from "../core/eventBus";
import { logger } from "../utils/logger";

async function main() {
  logger.log("=== NeuroEdge Full System Test ===");

  // -----------------------------
  // 1. Reset DB
  // -----------------------------
  await db.clearAll("edge");
  await db.clearAll("shared");
  logger.log("[TEST] Cleared edge and shared DB");

  // -----------------------------
  // 2. Subscribe Agents to DB events
  // -----------------------------
  Object.values(agentManager).forEach(agent => {
    if (typeof agent.handleDBUpdate === "function") {
      eventBus.subscribe("db:update", async (event: any) => {
        await agent.handleDBUpdate(event);
      });
    }
    if (typeof agent.handleDBDelete === "function") {
      eventBus.subscribe("db:delete", async (event: any) => {
        await agent.handleDBDelete(event);
      });
    }
  });
  logger.log("[TEST] Agents subscribed to DB events");

  // -----------------------------
  // 3. Test Engine → DB → Agent flow
  // -----------------------------
  const testInput = {
    id: "med001",
    name: "TestMed",
    dosage: "10mg",
    manufacturer: "NeuroEdgeLabs",
    folder: "health",
    role: "admin",
  };

  logger.log("[TEST] Running HealthEngine → should trigger MedicineManagementAgent");
  const result = await runEngineChain([
    { engine: "HealthEngine", input: testInput }
  ]);
  logger.log("[TEST] HealthEngine output:", result);

  // -----------------------------
  // 4. Test Edge → Shared Replication
  // -----------------------------
  await replicateEdgeToShared("medicine");
  const sharedMed = await db.get("medicine", "med001", "shared");
  logger.log("[TEST] Replicated to shared DB:", sharedMed);

  // -----------------------------
  // 5. Test runEngineChain across multiple engines
  // -----------------------------
  const chainOutput = await runEngineChain([
    { engine: "PlannerEngine", input: { task: "PlanTest" } },
    { engine: "RecommendationEngine" },
    { engine: "AnalyticsEngine" },
    { engine: "PredictiveEngine" },
  ]);
  logger.log("[TEST] runEngineChain output:", chainOutput);

  // -----------------------------
  // 6. Doctrine enforcement test
  // -----------------------------
  try {
    const blocked = await engineManager["HealthEngine"].run({ folder: "restricted", role: "user" });
    logger.log("[TEST] Doctrine enforcement (should be blocked if rules exist):", blocked);
  } catch (err) {
    logger.error("[TEST] Doctrine enforcement error:", err);
  }

  // -----------------------------
  // 7. Self-healing test
  // -----------------------------
  try {
    await engineManager["PredictiveEngine"].run({ causeError: true });
  } catch (err) {
    logger.log("[TEST] PredictiveEngine self-healing triggered:", err);
  }

  logger.log("=== NeuroEdge Full System Test Completed ===");
}

// Execute the test
main().catch(err => {
  console.error("[TEST] Fatal error:", err);
});
