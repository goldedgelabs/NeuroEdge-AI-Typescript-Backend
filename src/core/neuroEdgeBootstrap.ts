// src/core/neuroEdgeBootstrap.ts
/**
 * NeuroEdge Bootstrap
 * -------------------
 * Central initialization of:
 *  - 25 Engines (Doctrine-aware, self-healing)
 *  - 56 Agents (Doctrine-aware, self-healing)
 *  - EventBus wiring
 *  - DB events
 *  - Edge → Shared replication
 */

import { engineManager, registerEngine, eventBus } from "./engineManager";
import { agentManager, registerAgent } from "./agentManager";
import { connectEnginesToAgents } from "./engineAgentConnector";
import { db } from "../db/dbManager";

// -----------------------------
// 1️⃣ Register Engines
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
import { ARVEngine } from "../engines/ARVEngine";
import { SelfHealingEngine } from "../engines/SelfHealingEngine";
import { MedicineEngine } from "../engines/MedicineEngine";
import { PhoneSecurityEngine } from "../engines/PhoneSecurityEngine";
import { GoldEdgeIntegrationEngine } from "../engines/GoldEdgeIntegrationEngine";

// Register all 25 engines
[
  SelfImprovementEngine,
  PredictiveEngine,
  CodeEngine,
  VoiceEngine,
  VisionEngine,
  ReinforcementEngine,
  DataIngestEngine,
  AnalyticsEngine,
  PlannerEngine,
  MemoryEngine,
  ConversationEngine,
  SchedulingEngine,
  RecommendationEngine,
  SecurityEngine,
  MonitoringEngine,
  TranslationEngine,
  SummarizationEngine,
  PersonaEngine,
  CreativityEngine,
  OrchestrationEngine,
  SearchEngine,
  DoctrineEngine,
  ARVEngine,
  SelfHealingEngine,
  MedicineEngine,
  PhoneSecurityEngine,
  GoldEdgeIntegrationEngine
].forEach((EngineClass) => {
  const instance = new EngineClass();
  registerEngine(instance.constructor.name, instance);
});

// -----------------------------
// 2️⃣ Register Agents
// -----------------------------
import { PhoneSecurityAgent } from "../agents/PhoneSecurityAgent";
import { MedicineManagementAgent } from "../agents/MedicineManagementAgent";
import { GoldEdgeIntegrationAgent } from "../agents/GoldEdgeIntegrationAgent";
import { SelfProtectionAgent } from "../agents/SelfProtectionAgent";
import { DoctrineAgent } from "../agents/DoctrineAgent";
// ... import all other 56 agents here ...

[
  PhoneSecurityAgent,
  MedicineManagementAgent,
  GoldEdgeIntegrationAgent,
  SelfProtectionAgent,
  DoctrineAgent
  // ... all other agents
].forEach((AgentClass) => {
  const instance = new AgentClass();
  registerAgent(instance.constructor.name, instance);
});

// -----------------------------
// 3️⃣ Connect Engines ↔ Agents
// -----------------------------
connectEnginesToAgents();

// -----------------------------
// 4️⃣ Subscribe Agents to DB Events
// -----------------------------
eventBus.subscribe("db:update", async ({ collection, key, value }) => {
  for (const agentName in agentManager) {
    const agent = agentManager[agentName];
    if (agent && typeof agent.handleDBUpdate === "function") {
      await agent.handleDBUpdate({ collection, key, value });
    }
  }
});

eventBus.subscribe("db:delete", async ({ collection, key }) => {
  for (const agentName in agentManager) {
    const agent = agentManager[agentName];
    if (agent && typeof agent.handleDBDelete === "function") {
      await agent.handleDBDelete({ collection, key });
    }
  }
});

// -----------------------------
// 5️⃣ Edge → Shared Replication (Offline-first)
// -----------------------------
async function replicateEdgeToShared() {
  const collections = await db.listCollections("edge");
  for (const collection of collections) {
    const edgeRecords = await db.getAll(collection, "edge");
    for (const record of edgeRecords) {
      await db.set(collection, record.id, record, "shared");
    }
  }
}

// Optionally replicate periodically
setInterval(replicateEdgeToShared, 60_000); // every 60s

// -----------------------------
// 6️⃣ Expose NeuroEdge Bootstrap API
// -----------------------------
export async function bootstrapNeuroEdge() {
  console.log("[NeuroEdge] Bootstrapping system...");
  connectEnginesToAgents();
  await replicateEdgeToShared();
  console.log("[NeuroEdge] System ready!");
  }
