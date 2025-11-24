// src/core/engineAgentConnector.ts
/**
 * NeuroEdge Engine → Agent Connector
 * -----------------------------------
 * Wires all 25 engines to their respective agents.
 * Each action triggers subscribed agent methods via eventBus.
 */

import { engineManager, eventBus } from "./engineManager";
import { agentManager } from "./agentManager";

// Helper to subscribe engine actions to agent methods
function connectEngineToAgent(engineName: string, agentName: string, methodName: string) {
  const channel = `${engineName}:${methodName}`;
  eventBus.subscribe(channel, async (payload: any) => {
    const agent = agentManager[agentName];
    if (agent && typeof agent[methodName] === "function") {
      try {
        await agent[methodName](payload);
      } catch (err) {
        console.error(`[Engine-Agent Connector] Error in ${agentName}.${methodName}`, err);
      }
    }
  });
}

// -------------------------
// Engine → Agent Mapping
// -------------------------

// 1. SelfImprovementEngine
connectEngineToAgent("SelfImprovementEngine", "SelfImprovementAgent", "handleUpdate");
connectEngineToAgent("SelfImprovementEngine", "LearningAgent", "handleLearning");
connectEngineToAgent("SelfImprovementEngine", "EvolutionAgent", "handleLearning");

// 2. PredictiveEngine
connectEngineToAgent("PredictiveEngine", "PredictiveAgent", "handlePrediction");
connectEngineToAgent("PredictiveEngine", "AnalyticsAgent", "handleData");
connectEngineToAgent("PredictiveEngine", "MetricsAgent", "handleData");

// 3. CodeEngine
connectEngineToAgent("CodeEngine", "CodeAgent", "handleCode");
connectEngineToAgent("CodeEngine", "PluginAgent", "handlePlugin");
connectEngineToAgent("CodeEngine", "CreativityAgent", "handleCode");

// 4. VoiceEngine
connectEngineToAgent("VoiceEngine", "VoiceAgent", "handleVoice");
connectEngineToAgent("VoiceEngine", "PersonaAgent", "handlePersonaVoice");

// 5. VisionEngine
connectEngineToAgent("VisionEngine", "VisionAgent", "handleVision");
connectEngineToAgent("VisionEngine", "AnalyticsAgent", "handleData");
connectEngineToAgent("VisionEngine", "MonitoringAgent", "handleData");

// 6. ReinforcementEngine
connectEngineToAgent("ReinforcementEngine", "ReinforcementAgent", "handleReinforcement");
connectEngineToAgent("ReinforcementEngine", "LearningAgent", "handleLearning");

// 7. DataIngestEngine
connectEngineToAgent("DataIngestEngine", "DataIngestAgent", "handleIngest");
connectEngineToAgent("DataIngestEngine", "AnalyticsAgent", "handleData");
connectEngineToAgent("DataIngestEngine", "TelemetryAgent", "handleData");

// 8. AnalyticsEngine
connectEngineToAgent("AnalyticsEngine", "AnalyticsAgent", "handleData");
connectEngineToAgent("AnalyticsEngine", "MetricsAgent", "handleData");
connectEngineToAgent("AnalyticsEngine", "TelemetryAgent", "handleData");

// 9. PlannerEngine
connectEngineToAgent("PlannerEngine", "PlannerAgent", "handlePlan");
connectEngineToAgent("PlannerEngine", "PlannerHelperAgent", "handlePlan");
connectEngineToAgent("PlannerEngine", "SchedulerAgent", "handleSchedule");

// 10. MemoryEngine
connectEngineToAgent("MemoryEngine", "MemoryAgent", "handleMemory");
connectEngineToAgent("MemoryEngine", "ConversationAgent", "handleContext");

// 11. ConversationEngine
connectEngineToAgent("ConversationEngine", "ConversationAgent", "handleConversation");
connectEngineToAgent("ConversationEngine", "PersonaAgent", "handlePersonaConversation");

// 12. SchedulingEngine
connectEngineToAgent("SchedulingEngine", "SchedulingAgent", "handleSchedule");
connectEngineToAgent("SchedulingEngine", "SchedulerAgent", "handleSchedule");

// 13. RecommendationEngine
connectEngineToAgent("RecommendationEngine", "RecommendationAgent", "handleRecommendation");
connectEngineToAgent("RecommendationEngine", "PersonaAgent", "handleRecommendation");

// 14. SecurityEngine
connectEngineToAgent("SecurityEngine", "SecurityAgent", "handleAlert");
connectEngineToAgent("SecurityEngine", "SecurityCheckAgent", "verify");
connectEngineToAgent("SecurityEngine", "SelfProtectionAgent", "protect");

// 15. MonitoringEngine
connectEngineToAgent("MonitoringEngine", "MonitoringAgent", "handleMonitor");
connectEngineToAgent("MonitoringEngine", "MetricsAgent", "handleMonitor");
connectEngineToAgent("MonitoringEngine", "TelemetryAgent", "handleMonitor");

// 16. TranslationEngine
connectEngineToAgent("TranslationEngine", "TranslatorAgent", "handleTranslation");
connectEngineToAgent("TranslationEngine", "PersonaAgent", "handleTranslation");

// 17. SummarizationEngine
connectEngineToAgent("SummarizationEngine", "SummarizationAgent", "handleSummarize");
connectEngineToAgent("SummarizationEngine", "ConversationAgent", "handleContext");

// 18. PersonaEngine
connectEngineToAgent("PersonaEngine", "PersonaAgent", "handlePersona");
connectEngineToAgent("PersonaEngine", "ConversationAgent", "handleConversation");

// 19. CreativityEngine
connectEngineToAgent("CreativityEngine", "CreativityAgent", "handleCreativity");
connectEngineToAgent("CreativityEngine", "CodeAgent", "handleCode");

// 20. OrchestrationEngine
connectEngineToAgent("OrchestrationEngine", "OrchestrationAgent", "run");
connectEngineToAgent("OrchestrationEngine", "OrchestratorAgent", "handleTask");
connectEngineToAgent("OrchestrationEngine", "SchedulerAgent", "handleSchedule");

// 21. SearchEngine
connectEngineToAgent("SearchEngine", "SearchAgent", "handleSearch");

// 22. DoctrineEngine
connectEngineToAgent("DoctrineEngine", "DoctrineAgent", "enforceAction");

// 23. MedicineEngine (new)
connectEngineToAgent("MedicineEngine", "MedicineManagementAgent", "handleMedicineUpdate");
connectEngineToAgent("MedicineEngine", "AnalyticsAgent", "handleData");

// 24. PhoneSecurityEngine (new)
connectEngineToAgent("PhoneSecurityEngine", "PhoneSecurityAgent", "handlePhoneEvent");
connectEngineToAgent("PhoneSecurityEngine", "SelfProtectionAgent", "protect");

// 25. GoldEdgeIntegrationEngine (new)
connectEngineToAgent("GoldEdgeIntegrationEngine", "GoldEdgeIntegrationAgent", "integrateApp");
connectEngineToAgent("GoldEdgeIntegrationEngine", "PluginAgent", "handlePlugin");
connectEngineToAgent("GoldEdgeIntegrationEngine", "CreativityAgent", "handlePlugin");

// -------------------------
// All engines now wired to their respective agents
// -------------------------

console.log("[NeuroEdge] Engine → Agent wiring complete");
