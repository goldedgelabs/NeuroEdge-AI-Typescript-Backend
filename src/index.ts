/**
 * NeuroEdge Core Bootstrap
 * -----------------------
 * 1. Registers all engines and agents
 * 2. Sets up event bus
 * 3. Wires database (local + distributed)
 * 4. Enables offline-first & edge-ready operations
 * 5. Prepares runEngineChain and inter-agent interactions
 */

import { engineManager, registerEngine, runEngineChain, eventBus as engineEventBus } from "./core/engineManager";
import { agentManager, registerAgent } from "./core/agentManager";
import { wireEnginesToAgents } from "./core/engineAgentConnector";
import { initializeDBWiring } from "./core/dbEventWiring";
import { logger } from "./utils/logger";

// -----------------------------
// Engines (42 engines)
// -----------------------------
import { SelfImprovementEngine } from "./engines/SelfImprovementEngine";
import { PredictiveEngine } from "./engines/PredictiveEngine";
import { CodeEngine } from "./engines/CodeEngine";
import { VoiceEngine } from "./engines/VoiceEngine";
import { VisionEngine } from "./engines/VisionEngine";
import { ReinforcementEngine } from "./engines/ReinforcementEngine";
import { DataIngestEngine } from "./engines/DataIngestEngine";
import { AnalyticsEngine } from "./engines/AnalyticsEngine";
import { PlannerEngine } from "./engines/PlannerEngine";
import { MemoryEngine } from "./engines/MemoryEngine";
import { ConversationEngine } from "./engines/ConversationEngine";
import { SchedulingEngine } from "./engines/SchedulingEngine";
import { RecommendationEngine } from "./engines/RecommendationEngine";
import { SecurityEngine } from "./engines/SecurityEngine";
import { MonitoringEngine } from "./engines/MonitoringEngine";
import { TranslationEngine } from "./engines/TranslationEngine";
import { SummarizationEngine } from "./engines/SummarizationEngine";
import { PersonaEngine } from "./engines/PersonaEngine";
import { CreativityEngine } from "./engines/CreativityEngine";
import { OrchestrationEngine } from "./engines/OrchestrationEngine";
import { SearchEngine } from "./engines/SearchEngine";
import { DoctrineEngine } from "./engines/DoctrineEngine";
import { ARVEngine } from "./engines/ARVEngine";
import { MedicineManagementEngine } from "./engines/MedicineManagementEngine";
import { GoldEdgeIntegrationEngine } from "./engines/GoldEdgeIntegrationEngine";
import { PhoneSecurityEngine } from "./engines/PhoneSecurityEngine";
import { HealthEngine } from "./engines/HealthEngine";
import { DeviceProtectionEngine } from "./engines/DeviceProtectionEngine";
import { RealTimeRecommenderEngine } from "./engines/RealTimeRecommenderEngine";
import { MarketEngine } from "./engines/MarketEngine";
import { ResearchEngine } from "./engines/ResearchEngine";
import { MultiModalEngine } from "./engines/MultiModalEngine";
import { PolicyEngine } from "./engines/PolicyEngine";
import { SimulationEngine } from "./engines/SimulationEngine";
import { GamingCreativeEngine } from "./engines/GamingCreativeEngine";
import { EvolutionEngine } from "./engines/EvolutionEngine";
import { LearningEngine } from "./engines/LearningEngine";
import { GlobalMeshEngine } from "./engines/GlobalMeshEngine";
import { FounderEngine } from "./engines/FounderEngine";
import { ARVAnalyticsEngine } from "./engines/ARVAnalyticsEngine";
import { AnalyticsResearchEngine } from "./engines/AnalyticsResearchEngine";
import { ResearchAnalyticsEngine } from "./engines/ResearchAnalyticsEngine";
import { SelfProtectionEngine } from "./engines/SelfProtectionEngine";

// -----------------------------
// Agents (63 agents)
// -----------------------------
import { PlannerAgent } from "./agents/PlannerAgent";
import { CriticAgent } from "./agents/CriticAgent";
import { WorkerAgent } from "./agents/WorkerAgent";
import { VerifierAgent } from "./agents/VerifierAgent";
import { SupervisorAgent } from "./agents/SupervisorAgent";
import { SelfHealingAgent } from "./agents/SelfHealingAgent";
import { PredictiveAgent } from "./agents/PredictiveAgent";
import { AnalyticsAgent } from "./agents/AnalyticsAgent";
import { MemoryAgent } from "./agents/MemoryAgent";
import { TranslationAgent } from "./agents/TranslationAgent";
import { ConversationAgent } from "./agents/ConversationAgent";
import { MonitoringAgent } from "./agents/MonitoringAgent";
import { SchedulingAgent } from "./agents/SchedulingAgent";
import { RecommendationAgent } from "./agents/RecommendationAgent";
import { OrchestrationAgent } from "./agents/OrchestrationAgent";
import { CreativityAgent } from "./agents/CreativityAgent";
import { SecurityAgent } from "./agents/SecurityAgent";
import { VisionAgent } from "./agents/VisionAgent";
import { VoiceAgent } from "./agents/VoiceAgent";
import { ReinforcementAgent } from "./agents/ReinforcementAgent";
import { DoctrineAgent } from "./agents/DoctrineAgent";
import { PersonaAgent } from "./agents/PersonaAgent";
import { ARVAgent } from "./agents/ARVAgent";
import { SelfImprovementAgent } from "./agents/SelfImprovementAgent";
import { DataIngestAgent } from "./agents/DataIngestAgent";
import { SummarizationAgent } from "./agents/SummarizationAgent";
import { SearchAgent } from "./agents/SearchAgent";
import { OrchestratorAgent } from "./agents/OrchestratorAgent";
import { SchedulerAgent } from "./agents/SchedulerAgent";
import { PlannerHelperAgent } from "./agents/PlannerHelperAgent";
import { MetricsAgent } from "./agents/MetricsAgent";
import { TelemetryAgent } from "./agents/TelemetryAgent";
import { FileHandlerAgent } from "./agents/FileHandlerAgent";
import { BillingAgent } from "./agents/BillingAgent";
import { FounderAgent } from "./agents/FounderAgent";
import { PluginAgent } from "./agents/PluginAgent";
import { GPUAgent } from "./agents/GPUAgent";
import { OfflineAgent } from "./agents/OfflineAgent";
import { AutoUpdateAgent } from "./agents/AutoUpdateAgent";
import { HotReloadAgent } from "./agents/HotReloadAgent";
import { SecurityCheckAgent } from "./agents/SecurityCheckAgent";
import { DistributedTaskAgent } from "./agents/DistributedTaskAgent";
import { PluginManagerAgent } from "./agents/PluginManagerAgent";
import { LocalStorageAgent } from "./agents/LocalStorageAgent";
import { EdgeDeviceAgent } from "./agents/EdgeDeviceAgent";
import { CollaborationAgent } from "./agents/CollaborationAgent";
import { ResearchAgent } from "./agents/ResearchAgent";
import { SimulationAgent } from "./agents/SimulationAgent";
import { FeedbackAgent } from "./agents/FeedbackAgent";
import { EvolutionAgent } from "./agents/EvolutionAgent";
import { LearningAgent } from "./agents/LearningAgent";
import { GlobalMeshAgent } from "./agents/GlobalMeshAgent";
import { PhoneSecurityAgent } from "./agents/PhoneSecurityAgent";
import { MedicineManagementAgent } from "./agents/MedicineManagementAgent";
import { GoldEdgeIntegrationAgent } from "./agents/GoldEdgeIntegrationAgent";
import { SelfProtectionAgent } from "./agents/SelfProtectionAgent";

// -----------------------------
// 1. REGISTER ENGINES
// -----------------------------
const allEngines = [
  SelfImprovementEngine, PredictiveEngine, CodeEngine, VoiceEngine, VisionEngine,
  ReinforcementEngine, DataIngestEngine, AnalyticsEngine, PlannerEngine, MemoryEngine,
  ConversationEngine, SchedulingEngine, RecommendationEngine, SecurityEngine, MonitoringEngine,
  TranslationEngine, SummarizationEngine, PersonaEngine, CreativityEngine, OrchestrationEngine,
  SearchEngine, DoctrineEngine, ARVEngine, MedicineManagementEngine, GoldEdgeIntegrationEngine,
  PhoneSecurityEngine, HealthEngine, DeviceProtectionEngine, RealTimeRecommenderEngine,
  MarketEngine, ResearchEngine, MultiModalEngine, PolicyEngine, SimulationEngine,
  GamingCreativeEngine, EvolutionEngine, LearningEngine, GlobalMeshEngine, FounderEngine,
  ARVAnalyticsEngine, AnalyticsResearchEngine, ResearchAnalyticsEngine, SelfProtectionEngine
];

allEngines.forEach(E => registerEngine(E.name, new E()));

// -----------------------------
// 2. REGISTER AGENTS
// -----------------------------
const allAgents = [
  PlannerAgent, CriticAgent, WorkerAgent, VerifierAgent, SupervisorAgent, SelfHealingAgent,
  PredictiveAgent, AnalyticsAgent, MemoryAgent, TranslationAgent, ConversationAgent,
  MonitoringAgent, SchedulingAgent, RecommendationAgent, OrchestrationAgent, CreativityAgent,
  SecurityAgent, VisionAgent, VoiceAgent, ReinforcementAgent, DoctrineAgent, PersonaAgent,
  ARVAgent, SelfImprovementAgent, DataIngestAgent, SummarizationAgent, SearchAgent,
  OrchestratorAgent, SchedulerAgent, PlannerHelperAgent, MetricsAgent, TelemetryAgent,
  FileHandlerAgent, BillingAgent, FounderAgent, PluginAgent, GPUAgent, OfflineAgent,
  AutoUpdateAgent, HotReloadAgent, SecurityCheckAgent, DistributedTaskAgent, PluginManagerAgent,
  LocalStorageAgent, EdgeDeviceAgent, CollaborationAgent, ResearchAgent, SimulationAgent,
  FeedbackAgent, EvolutionAgent, LearningAgent, GlobalMeshAgent, PhoneSecurityAgent,
  MedicineManagementAgent, GoldEdgeIntegrationAgent, SelfProtectionAgent
];

allAgents.forEach(A => registerAgent(A.name, new A()));

// -----------------------------
// 3. DATABASE INIT
// -----------------------------
import { LocalDB } from "./db/local/LocalDB";
import { DistributedDB } from "./db/distributed/DistributedDB";
import { Replicator } from "./db/replication/Replicator";

const localDB = new LocalDB();
const distributedDB = new DistributedDB();
const replicator = new Replicator(localDB, distributedDB);

// Connect DB events to engine/agent managers
engineEventBus.subscribe("db:update", (data: any) => {
  Object.values(agentManager).forEach(agent => agent.handleDBUpdate?.(data));
});
engineEventBus.subscribe("db:delete", (data: any) => {
  Object.values(agentManager).forEach(agent => agent.handleDBDelete?.(data));
});

// Initialize DB wiring
initializeDBWiring();

// Offline-first setup
agentManager["OfflineAgent"]?.run?.({ db: localDB });

// -----------------------------
// 4. CONNECT ENGINES → AGENTS
// -----------------------------
wireEnginesToAgents();

// -----------------------------
// 5. READY-TO-RUN NEUROEDGE
// -----------------------------
logger.log("[NeuroEdge] Core bootstrap complete. Engines and Agents are live.");
(globalThis as any).__NE_CORE_BOOTSTRAP = true;

// -----------------------------
// 6. EXAMPLE ENGINE CHAIN RUN
// -----------------------------
(async () => {
  const result = await runEngineChain([
    { engine: "PlannerEngine", input: { goal: "Plan NeuroEdge rollout" } },
    { engine: "AnalyticsEngine", input: { data: [1,2,3] } },
  ]);
  console.log("Engine chain result:", result);
})();
