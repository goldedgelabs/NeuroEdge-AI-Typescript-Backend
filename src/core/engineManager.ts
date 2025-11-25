/**
 * NeuroEdge Engine Manager
 * -----------------------
 * Central registry for all 42 engines
 */

import { DoctrineEngine } from "../engines/DoctrineEngine/index";

// Import all 42 engines (alphabetical order)
import { AgentsEngine } from "../engines/AgentsEngine/index";
import { CodeEngine } from "../engines/CodeEngine/index";
import { DataEngine } from "../engines/DataEngine/index";
import { DataIngestEngine } from "../engines/DataIngestEngine/index";
import { DecisionEngine } from "../engines/DecisionEngine/index";
import { DeviceProtectionEngine } from "../engines/DeviceProtectionEngine/index";
import { DoctrineEngine as DoctrineE } from "../engines/DoctrineEngine/index";
import { GamingCreativeEngine } from "../engines/GamingCreativeEngine/index";
import { GoldEdgeIntegrationEngine } from "../engines/GoldEdgeIntegrationEngine/index";
import { HealthEngine } from "../engines/HealthEngine/index";
import { MarketEngine } from "../engines/MarketEngine/index";
import { MedicineManagementEngine } from "../engines/MedicineManagementEngine/index";
import { MemoryEngine } from "../engines/MemoryEngine/index";
import { MonitoringEngine } from "../engines/MonitoringEngine/index";
import { MultiModalEngine } from "../engines/MultiModalEngine/index";
import { PersonaEngine } from "../engines/PersonaEngine/index";
import { PhoneSecurityEngine } from "../engines/PhoneSecurityEngine/index";
import { PlannerEngine } from "../engines/PlannerEngine/index";
import { PolicyEngine } from "../engines/PolicyEngine/index";
import { RealTimeRecommenderEngine } from "../engines/RealTimeRecommenderEngine/index";
import { ReasoningEngine } from "../engines/ReasoningEngine/index";
import { RecommendationEngine } from "../engines/RecommendationEngine/index";
import { ResearchAnalyticsEngine } from "../engines/ResearchAnalyticsEngine/index";
import { ResearchEngine } from "../engines/ResearchEngine/index";
import { SchedulingEngine } from "../engines/SchedulingEngine/index";
import { SecurityEngine } from "../engines/SecurityEngine/index";
import { SelfImprovementEngine } from "../engines/SelfImprovementEngine/index";
import { SimulationEngine } from "../engines/SimulationEngine/index";
import { SummarizationEngine } from "../engines/SummarizationEngine/index";
import { VisionEngine } from "../engines/VisionEngine/index";
import { VoiceEngine } from "../engines/VoiceEngine/index";
import { ReinforcementEngine } from "../engines/ReinforcementEngine/index";
import { AnalyticsEngine } from "../engines/AnalyticsEngine/index";
import { PlannerHelperEngine } from "../engines/PlannerHelperEngine/index";
import { OrchestrationEngine } from "../engines/OrchestrationEngine/index";
import { TranslationEngine } from "../engines/TranslationEngine/index";
import { CreativityEngine } from "../engines/CreativityEngine/index";
import { PredictiveEngine } from "../engines/PredictiveEngine/index";
import { MonitoringAnalyticsEngine } from "../engines/MonitoringAnalyticsEngine/index";
import { HealthAnalyticsEngine } from "../engines/HealthAnalyticsEngine/index";
import { GPUAnalyticsEngine } from "../engines/GPUAnalyticsEngine/index";
import { TelemetryEngine } from "../engines/TelemetryEngine/index";

export const engineManager: Record<string, any> = {};
const doctrine = new DoctrineEngine();

// Global reference for all engines
(globalThis as any).__NE_ENGINE_MANAGER = engineManager;

export function registerEngine(name: string, engineInstance: any) {
  engineManager[name] = new Proxy(engineInstance, {
    get(target: any, prop: string) {
      const origMethod = target[prop];
      if (typeof origMethod === "function") {
        return async (...args: any[]) => {
          const action = `${name}.${String(prop)}`;
          const folderArg = args[0]?.folder || "";
          const userRole = args[0]?.role || "user";

          let doctrineResult = { success: true };
          if (doctrine && typeof (doctrine as any).enforceAction === "function") {
            doctrineResult = await (doctrine as any).enforceAction(action, folderArg, userRole);
          }

          if (!doctrineResult.success) {
            console.warn(`[Doctrine] Action blocked: ${action}`);
            return { blocked: true, message: doctrineResult.message };
          }

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
// Register all 42 engines
// -----------------------------
const engines: any[] = [
  AgentsEngine,
  AnalyticsEngine,
  CodeEngine,
  CreativityEngine,
  DataEngine,
  DataIngestEngine,
  DecisionEngine,
  DeviceProtectionEngine,
  DoctrineE,
  GamingCreativeEngine,
  GoldEdgeIntegrationEngine,
  GPUAnalyticsEngine,
  HealthEngine,
  HealthAnalyticsEngine,
  MarketEngine,
  MedicineManagementEngine,
  MemoryEngine,
  MonitoringEngine,
  MonitoringAnalyticsEngine,
  MultiModalEngine,
  OrchestrationEngine,
  PersonaEngine,
  PhoneSecurityEngine,
  PlannerEngine,
  PlannerHelperEngine,
  PolicyEngine,
  PredictiveEngine,
  RealTimeRecommenderEngine,
  ReasoningEngine,
  RecommendationEngine,
  ResearchAnalyticsEngine,
  ResearchEngine,
  ReinforcementEngine,
  SchedulingEngine,
  SecurityEngine,
  SelfImprovementEngine,
  SimulationEngine,
  SummarizationEngine,
  TelemetryEngine,
  TranslationEngine,
  VisionEngine,
  VoiceEngine
];

engines.forEach(EngineClass => {
  registerEngine(EngineClass.name, new EngineClass());
});

registerEngine("DoctrineEngine", doctrine);
