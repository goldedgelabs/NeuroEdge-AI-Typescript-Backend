// src/core/engineAgentConnector.ts
/**
 * NeuroEdge Engine ↔ Agent Connector
 * -----------------------------------
 * Automatically wires engines to agents using enginePublisher.
 * Ensures:
 *  - Doctrine enforcement
 *  - Self-healing
 *  - Event-driven communication
 */

import { enableAutoPublish } from "./enginePublisher";
import { agentManager, eventBus } from "./engineManager";

// Mapping: which agent listens to which engine
const engineAgentMap: Record<string, string[]> = {
  // Example
  MedicineEngine: ["MedicineManagementAgent"],
  PhoneSecurityEngine: ["PhoneSecurityAgent"],
  GoldEdgeIntegrationEngine: ["GoldEdgeIntegrationAgent"],
  SelfImprovementEngine: ["LearningAgent", "EvolutionAgent"],
  PredictiveEngine: ["AnalyticsAgent", "MetricsAgent"],
  HealthEngine: ["MedicineManagementAgent", "FeedbackAgent"],
  PlannerEngine: ["PlannerHelperAgent", "SchedulerAgent"],
  VoiceEngine: ["VoiceAgent", "ConversationAgent"],
  VisionEngine: ["VisionAgent"],
  SecurityEngine: ["SecurityCheckAgent", "SecurityAgent"],
  TranslationEngine: ["TranslatorAgent"],
  SummarizationEngine: ["SummarizationAgent"],
  PersonaEngine: ["PersonaAgent"],
  CreativityEngine: ["CreativityAgent"],
  OrchestrationEngine: ["OrchestrationAgent", "OrchestratorAgent"],
  SearchEngine: ["SearchAgent"],
  DoctrineEngine: ["DoctrineAgent"],
  MonitoringEngine: ["MonitoringAgent", "TelemetryAgent"],
  DataIngestEngine: ["DataIngestAgent", "FileHandlerAgent"],
  AnalyticsEngine: ["AnalyticsAgent", "MetricsAgent"],
  ReinforcementEngine: ["ReinforcementAgent"],
  MemoryEngine: ["MemoryAgent"],
  RecommendationEngine: ["RecommendationAgent"],
  SchedulingEngine: ["SchedulingAgent"],
  ARVEngine: ["ARVAgent"],
  SelfHealingEngine: ["SelfHealingAgent", "SupervisorAgent"]
};

// Wire engines to agents using eventBus
export function connectEnginesToAgents() {
  for (const [engineName, agents] of Object.entries(engineAgentMap)) {
    // Enable auto-publish for this engine
    enableAutoPublish(engineName);

    // Subscribe each agent to the engine events
    agents.forEach((agentName) => {
      const channel = `${engineName}:run`;
      eventBus.subscribe(channel, async (payload: any) => {
        const agent = agentManager[agentName];
        if (agent && typeof agent.handleEngineEvent === "function") {
          try {
            await agent.handleEngineEvent(engineName, payload);
          } catch (err) {
            if (typeof agent.recover === "function") {
              await agent.recover(err);
            }
          }
        }
      });
    });
  }
        }
