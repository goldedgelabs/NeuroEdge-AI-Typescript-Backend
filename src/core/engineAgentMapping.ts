// src/core/engineAgentMapping.ts
import { engineManager } from "./engineManager";
import { agentManager } from "./agentManager";
import { eventBus } from "./eventBus";
import { logger } from "../utils/logger";

// -----------------------------
// Full Engine → Agent Mapping
// -----------------------------
const engineAgentMap: Record<string, string[]> = {
  // A
  AnalyticsEngine: ["AnalyticsAgent", "MetricsAgent", "TelemetryAgent"],
  AutoUpdateEngine: ["AutoUpdateAgent", "SelfProtectionAgent"],

  // B
  BillingEngine: ["BillingAgent", "MetricsAgent"],

  // C
  CodeEngine: ["WorkerAgent", "SelfImprovementAgent"],
  ConversationEngine: ["ConversationAgent", "PersonaAgent", "TranslationAgent", "RecommendationAgent"],
  CreativityEngine: ["CreativityAgent", "ContentModerationAgent", "CorrectionAgent"],

  // D
  DataIngestEngine: ["DataIngestAgent", "MemoryAgent", "AnalyticsAgent"],
  DecisionEngine: ["DecisionAgent", "PredictiveAgent", "PlanningAgent"],
  DeviceProtectionEngine: ["DeviceProtectionAgent", "SecurityAgent", "PhoneSecurityAgent", "SelfProtectionAgent"],
  DoctrineEngine: ["DoctrineAgent", "InspectionAgent", "SelfImprovementAgent", "SecurityCheckAgent"],
  DistributedTaskEngine: ["DistributedTaskAgent", "WorkerAgent"],

  // E
  EdgeDeviceEngine: ["EdgeDeviceAgent", "TelemetryAgent", "MonitoringAgent"],
  EvolutionEngine: ["EvolutionAgent", "SelfImprovementAgent", "LearningAgent"],

  // F
  FounderEngine: ["FounderAgent", "PluginManagerAgent"],

  // G
  GoldEdgeIntegrationEngine: ["GoldEdgeIntegrationAgent", "PluginHelperAgent"],

  // H
  HealthEngine: ["MedicineManagementAgent", "MonitoringAgent", "SelfHealingAgent"],
  HotReloadEngine: ["HotReloadAgent", "PluginHelperAgent"],

  // L
  LearningEngine: ["LearningAgent", "SelfImprovementAgent"],

  // M
  MarketEngine: ["MarketAssessmentAgent", "AnalyticsAgent"],
  MedicineManagementEngine: ["MedicineManagementAgent", "SelfImprovementAgent"],
  MemoryEngine: ["MemoryAgent", "AnalyticsAgent"],
  MonitoringEngine: ["MonitoringAgent", "SecurityCheckAgent", "SelfProtectionAgent"],
  MultiModalEngine: ["VisionAgent", "VoiceAgent", "AnalyticsAgent"],

  // P
  PersonaEngine: ["PersonaAgent", "ConversationAgent", "TranslationAgent"],
  PhoneSecurityEngine: ["PhoneSecurityAgent", "SecurityCheckAgent"],
  PlannerEngine: ["PlannerAgent", "PlannerHelperAgent", "OrchestrationAgent"],
  PolicyEngine: ["SecurityClearanceAgent", "DoctrineAgent", "AnalyticsAgent"],

  // R
  RealTimeRecommenderEngine: ["RecommendationAgent", "SchedulerAgent", "TelemetryAgent"],
  ReasoningEngine: ["CriticAgent", "AnalyticsAgent"],
  RecommendationEngine: ["RecommendationAgent", "SchedulingAgent", "PlannerHelperAgent"],
  ResearchAnalyticsEngine: ["ResearchAgent", "AnalyticsAgent", "MetricsAgent"],
  ResearchEngine: ["ResearchAgent", "AnalyticsAgent"],

  // S
  SchedulingEngine: ["SchedulingAgent", "SchedulerAgent", "TelemetryAgent"],
  SecurityEngine: ["SecurityAgent", "SecurityCheckAgent", "DeviceProtectionAgent"],
  SelfImprovementEngine: ["SelfImprovementAgent", "LearningAgent", "SelfHealingAgent"],
  SimulationEngine: ["SimulationAgent", "AnalyticsAgent"],
  SummarizationEngine: ["SummarizationAgent", "ResearchAgent", "AnalyticsAgent"],

  // V
  VisionEngine: ["VisionAgent", "AnalyticsAgent"],
};

// -----------------------------
// Subscribe to engine outputs
// -----------------------------
eventBus.subscribe("engine:output", async (payload) => {
  const { engine, output } = payload;
  const agentsToTrigger = engineAgentMap[engine] || [];

  for (const agentName of agentsToTrigger) {
    const agent = agentManager[agentName];
    if (agent?.handleEngineOutput) {
      try {
        await agent.handleEngineOutput(output);
        logger.log(`[Mapping] Engine ${engine} triggered ${agentName}`);
      } catch (err) {
        logger.error(`[Mapping] Failed to trigger ${agentName} from ${engine}:`, err);
      }
    }
  }
});

// -----------------------------
// Add new mapping dynamically
// -----------------------------
export function addEngineAgentMapping(engine: string, agent: string) {
  if (!engineAgentMap[engine]) engineAgentMap[engine] = [];
  if (!engineAgentMap[engine].includes(agent)) engineAgentMap[engine].push(agent);
  logger.log(`[Mapping] Added mapping ${engine} → ${agent}`);
}

// -----------------------------
// Global reference
// -----------------------------
(globalThis as any).__NE_ENGINE_AGENT_MAPPING = {
  engineAgentMap,
  addEngineAgentMapping,
};
