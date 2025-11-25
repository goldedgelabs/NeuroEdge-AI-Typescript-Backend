// src/core/agentManager.ts
/**
 * NeuroEdge Agent Manager
 * ----------------------
 * Central registry for all agents
 * - Doctrine enforcement
 * - Self-healing
 * - DB event subscription
 */

import { eventBus } from "../core/engineManager";

// Import all agents
import { ARVAgent } from "../agents/ARVAgent";
import { AgentBase } from "../agents/AgentBase";
import { AnalyticsAgent } from "../agents/AnalyticsAgent";
import { AntiTheftAgent } from "../agents/AntiTheftAgent";
import { AutoUpdateAgent } from "../agents/AutoUpdateAgent";
import { BillingAgent } from "../agents/BillingAgent";
import { CollaborationAgent } from "../agents/CollaborationAgent";
import { CorrectionAgent } from "../agents/CorrectionAgent";
import { ContentModerationAgent } from "../agents/ContentModerationAgent";
import { ConversationAgent } from "../agents/ConversationAgent";
import { CreativityAgent } from "../agents/CreativityAgent";
import { CriticAgent } from "../agents/CriticAgent";
import { DataIngestAgent } from "../agents/DataIngestAgent";
import { DataProcessingAgent } from "../agents/DataProcessingAgent";
import { DecisionAgent } from "../agents/DecisionAgent";
import { DeviceProtectionAgent } from "../agents/DeviceProtectionAgent";
import { DiscoveryAgent } from "../agents/DiscoveryAgent";
import { DistributedTaskAgent } from "../agents/DistributedTaskAgent";
import { DoctrineAgent } from "../agents/DoctrineAgent";
import { EdgeDeviceAgent } from "../agents/EdgeDeviceAgent";
import { EvolutionAgent } from "../agents/EvolutionAgent";
import { FeedbackAgent } from "../agents/FeedbackAgent";
import { FounderAgent } from "../agents/FounderAgent";
import { GPUAgent } from "../agents/GPUAgent";
import { GlobalMeshAgent } from "../agents/GlobalMeshAgent";
import { GoldEdgeIntegrationAgent } from "../agents/GoldEdgeIntegrationAgent";
import { HotReloadAgent } from "../agents/HotReloadAgent";
import { InspectionAgent } from "../agents/InspectionAgent";
import { LearningAgent } from "../agents/LearningAgent";
import { LocalStorageAgent } from "../agents/LocalStorageAgent";
import { MarketAssessmentAgent } from "../agents/MarketAssessmentAgent";
import { MetricsAgent } from "../agents/MetricsAgent";
import { MonitoringAgent } from "../agents/MonitoringAgent";
import { OfflineAgent } from "../agents/OfflineAgent";
import { OrchestrationAgent } from "../agents/OrchestrationAgent";
import { PersonalAgent } from "../agents/PersonalAgent";
import { PhoneSecurityAgent } from "../agents/PhoneSecurityAgent";
import { PlannerAgent } from "../agents/PlannerAgent";
import { PluginHelperAgent } from "../agents/PluginHelperAgent";
import { PluginManagerAgent } from "../agents/PluginManagerAgent";
import { PredictiveAgent } from "../agents/PredictiveAgent";
import { RecommendationAgent } from "../agents/RecommendationAgent";
import { ReinforcementAgent } from "../agents/ReinforcementAgent";
import { ResearchAgent } from "../agents/ResearchAgent";
import { SchedulingAgent } from "../agents/SchedulingAgent";
import { SchedulerAgent } from "../agents/SchedulerAgent";
import { SearchAgent } from "../agents/SearchAgent";
import { SecurityClearanceAgent } from "../agents/SecurityClearanceAgent";
import { SecurityAgent } from "../agents/SecurityAgent";
import { SelfHealingAgent } from "../agents/SelfHealingAgent";
import { SelfImprovementAgent } from "../agents/SelfImprovementAgent";
import { SelfProtectionAgent } from "../agents/SelfProtectionAgent";
import { SimulationAgent } from "../agents/SimulationAgent";
import { SummarizationAgent } from "../agents/SummarizationAgent";
import { SupervisorAgent } from "../agents/SupervisorAgent";
import { TelemetryAgent } from "../agents/TelemetryAgent";
import { TranslationAgent } from "../agents/TranslationAgent";
import { ValidationAgent } from "../agents/ValidationAgent";
import { VerifierAgent } from "../agents/VerifierAgent";
import { WorkerAgent } from "../agents/WorkerAgent";

// Agent registry
export const agentManager: Record<string, any> = {};
const doctrine = new DoctrineAgent();

// -----------------------------
// Register agents with Doctrine & self-healing
// -----------------------------
export function registerAgent(name: string, agentInstance: any) {
  agentManager[name] = new Proxy(agentInstance, {
    get(target: any, prop: string) {
      const origMethod = target[prop];
      if (typeof origMethod === "function") {
        return async (...args: any[]) => {
          const action = `${name}.${String(prop)}`;
          const folderArg = args[0]?.folder || "";
          const userRole = args[0]?.role || "user";

          // Doctrine enforcement
          let doctrineResult = { success: true };
          if (doctrine && typeof doctrine.enforceAction === "function") {
            doctrineResult = await doctrine.enforceAction(action, folderArg, userRole);
          }
          if (!doctrineResult.success) {
            console.warn(`[Doctrine] Action blocked: ${action}`);
            return { blocked: true, message: doctrineResult.message };
          }

          // Run original method with self-healing
          try {
            return await origMethod.apply(target, args);
          } catch (err) {
            if (typeof target.recover === "function") {
              await target.recover(err);
            }
            return { error: "Recovered from failure" };
          }
        };
      }
      return origMethod;
    }
  });
}

// -----------------------------
// Subscribe all agents to DB events
// -----------------------------
eventBus.subscribe("db:update", async (event: any) => {
  for (const agent of Object.values(agentManager)) {
    if (typeof agent.handleDBUpdate === "function") {
      await agent.handleDBUpdate(event);
    }
  }
});

eventBus.subscribe("db:delete", async (event: any) => {
  for (const agent of Object.values(agentManager)) {
    if (typeof agent.handleDBDelete === "function") {
      await agent.handleDBDelete(event);
    }
  }
});

// -----------------------------
// Register all 63 agents
// -----------------------------
[
  ARVAgent,
  AgentBase,
  AnalyticsAgent,
  AntiTheftAgent,
  AutoUpdateAgent,
  BillingAgent,
  CollaborationAgent,
  CorrectionAgent,
  ContentModerationAgent,
  ConversationAgent,
  CreativityAgent,
  CriticAgent,
  DataIngestAgent,
  DataProcessingAgent,
  DecisionAgent,
  DeviceProtectionAgent,
  DiscoveryAgent,
  DistributedTaskAgent,
  DoctrineAgent,
  EdgeDeviceAgent,
  EvolutionAgent,
  FeedbackAgent,
  FounderAgent,
  GPUAgent,
  GlobalMeshAgent,
  GoldEdgeIntegrationAgent,
  HotReloadAgent,
  InspectionAgent,
  LearningAgent,
  LocalStorageAgent,
  MarketAssessmentAgent,
  MetricsAgent,
  MonitoringAgent,
  OfflineAgent,
  OrchestrationAgent,
  PersonalAgent,
  PhoneSecurityAgent,
  PlannerAgent,
  PluginHelperAgent,
  PluginManagerAgent,
  PredictiveAgent,
  RecommendationAgent,
  ReinforcementAgent,
  ResearchAgent,
  SchedulingAgent,
  SchedulerAgent,
  SearchAgent,
  SecurityClearanceAgent,
  SecurityAgent,
  SelfHealingAgent,
  SelfImprovementAgent,
  SelfProtectionAgent,
  SimulationAgent,
  SummarizationAgent,
  SupervisorAgent,
  TelemetryAgent,
  TranslationAgent,
  ValidationAgent,
  VerifierAgent,
  WorkerAgent
].forEach((AgentClass: any) => {
  const name = AgentClass.name.replace(".ts", "");
  registerAgent(name, new AgentClass());
});
