// src/core/neuroedgeSystem.ts
/**
 * NeuroEdge Central Wiring
 * ------------------------
 * - Registers engines and agents
 * - Doctrine enforcement
 * - Self-healing
 * - EventBus
 * - Edge → Shared replication
 */

import { engineManager, registerEngine, eventBus as engineEventBus } from "./engineManager";
import { agentManager, registerAgent } from "./agentManager";
import { db } from "../db/dbManager";

// -----------------------------
// Import Engines
// -----------------------------
import { SelfImprovementEngine } from "../engines/SelfImprovementEngine";
import { PredictiveEngine } from "../engines/PredictiveEngine";
import { CodeEngine } from "../engines/CodeEngine";
import { VoiceEngine } from "../engines/VoiceEngine";
import { VisionEngine } from "../engines/VisionEngine";
import { ReinforcementEngine } from "../engines/ReinforcementEngine";
import { DataIngestEngine } from "../engines/DataIngestEngine";
import { AnalyticsEngine } from "../engines/AnalyticsEngine";
import { PlannerEngine } from "../engines/PlannerEngine";
import { MemoryEngine } from "../engines/MemoryEngine";
import { ConversationEngine } from "../engines/ConversationEngine";
import { SchedulingEngine } from "../engines/SchedulingEngine";
import { RecommendationEngine } from "../engines/RecommendationEngine";
import { SecurityEngine } from "../engines/SecurityEngine";
import { MonitoringEngine } from "../engines/MonitoringEngine";
import { TranslationEngine } from "../engines/TranslationEngine";
import { SummarizationEngine } from "../engines/SummarizationEngine";
import { PersonaEngine } from "../engines/PersonaEngine";
import { CreativityEngine } from "../engines/CreativityEngine";
import { OrchestrationEngine } from "../engines/OrchestrationEngine";
import { SearchEngine } from "../engines/SearchEngine";
import { DoctrineEngine } from "../engines/DoctrineEngine";

// -----------------------------
// Import Agents
// -----------------------------
import { MedicineManagementAgent } from "../agents/MedicineManagementAgent";
import { PhoneSecurityAgent } from "../agents/PhoneSecurityAgent";
import { GoldEdgeIntegrationAgent } from "../agents/GoldEdgeIntegrationAgent";
import { SelfProtectionAgent } from "../agents/SelfProtectionAgent";

// ... import all other 59 agents similarly

// -----------------------------
// Global references
// -----------------------------
(globalThis as any).__NE_ENGINE_MANAGER = engineManager;
(globalThis as any).__NE_AGENT_MANAGER = agentManager;

// -----------------------------
// Register Engines
// -----------------------------
const doctrine = new DoctrineEngine();

registerEngine("SelfImprovementEngine", new SelfImprovementEngine());
registerEngine("PredictiveEngine", new PredictiveEngine());
registerEngine("CodeEngine", new CodeEngine());
registerEngine("VoiceEngine", new VoiceEngine());
registerEngine("VisionEngine", new VisionEngine());
registerEngine("ReinforcementEngine", new ReinforcementEngine());
registerEngine("DataIngestEngine", new DataIngestEngine());
registerEngine("AnalyticsEngine", new AnalyticsEngine());
registerEngine("PlannerEngine", new PlannerEngine());
registerEngine("MemoryEngine", new MemoryEngine());
registerEngine("ConversationEngine", new ConversationEngine());
registerEngine("SchedulingEngine", new SchedulingEngine());
registerEngine("RecommendationEngine", new RecommendationEngine());
registerEngine("SecurityEngine", new SecurityEngine());
registerEngine("MonitoringEngine", new MonitoringEngine());
registerEngine("TranslationEngine", new TranslationEngine());
registerEngine("SummarizationEngine", new SummarizationEngine());
registerEngine("PersonaEngine", new PersonaEngine());
registerEngine("CreativityEngine", new CreativityEngine());
registerEngine("OrchestrationEngine", new OrchestrationEngine());
registerEngine("SearchEngine", new SearchEngine());
registerEngine("DoctrineEngine", doctrine);

// -----------------------------
// Register Agents
// -----------------------------
registerAgent("MedicineManagementAgent", new MedicineManagementAgent());
registerAgent("PhoneSecurityAgent", new PhoneSecurityAgent());
registerAgent("GoldEdgeIntegrationAgent", new GoldEdgeIntegrationAgent());
registerAgent("SelfProtectionAgent", new SelfProtectionAgent());

// ... register all remaining 59 agents similarly

// -----------------------------
// DB Event Subscriptions
// -----------------------------
engineEventBus.subscribe("db:update", async ({ collection, key, value }) => {
  for (const agentName in agentManager) {
    const agent = agentManager[agentName];
    if (typeof agent.handleDBUpdate === "function") {
      await agent.handleDBUpdate({ collection, key, value });
    }
  }
});

engineEventBus.subscribe("db:delete", async ({ collection, key }) => {
  for (const agentName in agentManager) {
    const agent = agentManager[agentName];
    if (typeof agent.handleDBDelete === "function") {
      await agent.handleDBDelete({ collection, key });
    }
  }
});

// -----------------------------
// Edge → Shared DB Replication
// -----------------------------
export async function replicateEdgeToShared(collection: string) {
  const edgeRecords = await db.getAll(collection, "edge");
  for (const record of edgeRecords) {
    await db.set(collection, record.id, record, "shared");
  }
}

// -----------------------------
// Engine → Agent Wiring Examples
// -----------------------------
if (agentManager.MedicineManagementAgent && engineManager.HealthEngine) {
  const healthEngine = engineManager.HealthEngine;
  const medicineAgent = agentManager.MedicineManagementAgent;

  const originalRun = healthEngine.run.bind(healthEngine);
  healthEngine.run = async (input: any) => {
    const output = await originalRun(input);
    await medicineAgent.handleDBUpdate({ collection: "medicine", key: output.id, value: output });
    return output;
  };
}
