// src/core/engineManager.ts
/**
 * NeuroEdge Engine Manager
 * -----------------------
 * Central registry for all engines
 * Provides:
 *  - Doctrine enforcement
 *  - Self-healing
 *  - Event bus support
 *  - Full registration of all 25 engines
 */

import { DoctrineEngine } from "../engines/DoctrineEngine";

// Import all 25 engines
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
import { MedicineEngine } from "../engines/MedicineEngine"; // new
import { PhoneSecurityEngine } from "../engines/PhoneSecurityEngine"; // new
import { GoldEdgeIntegrationEngine } from "../engines/GoldEdgeIntegrationEngine"; // new
import { ARVEngine } from "../engines/ARVEngine"; // new

// Engine registry
export const engineManager: Record<string, any> = {};
const doctrine = new DoctrineEngine();

// global reference for engines to access manager
(globalThis as any).__NE_ENGINE_MANAGER = engineManager;

// -----------------------------
// Register function with Doctrine enforcement & self-healing
// -----------------------------
export function registerEngine(name: string, engineInstance: any) {
  engineManager[name] = new Proxy(engineInstance, {
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
// Event Bus for engine communication
// -----------------------------
export const eventBus: Record<string, Function[]> = {};
export function subscribe(channel: string, callback: Function) {
  if (!eventBus[channel]) eventBus[channel] = [];
  eventBus[channel].push(callback);
}
export function publish(channel: string, data: any) {
  const subscribers = eventBus[channel] || [];
  subscribers.forEach(cb => cb(data));
}

// -----------------------------
// Run multiple engines in sequence
// -----------------------------
export async function runEngineChain(chain: { engine: string; input?: any }[]) {
  let lastOutput: any = null;
  for (const step of chain) {
    const engine = engineManager[step.engine];
    if (!engine) throw new Error(`Engine not registered: ${step.engine}`);
    if (typeof engine.run === "function") {
      lastOutput = await engine.run(step.input ?? lastOutput);
    } else if (typeof engine === "function") {
      lastOutput = await engine(step.input ?? lastOutput);
    } else {
      lastOutput = null;
    }
  }
  return lastOutput;
}

// -----------------------------
// Register all 25 engines
// -----------------------------
const engines = [
  SelfImprovementEngine, PredictiveEngine, CodeEngine, VoiceEngine, VisionEngine,
  ReinforcementEngine, DataIngestEngine, AnalyticsEngine, PlannerEngine, MemoryEngine,
  ConversationEngine, SchedulingEngine, RecommendationEngine, SecurityEngine, MonitoringEngine,
  TranslationEngine, SummarizationEngine, PersonaEngine, CreativityEngine, OrchestrationEngine,
  SearchEngine, MedicineEngine, PhoneSecurityEngine, GoldEdgeIntegrationEngine, ARVEngine
];

const engineNames = [
  "SelfImprovementEngine", "PredictiveEngine", "CodeEngine", "VoiceEngine", "VisionEngine",
  "ReinforcementEngine", "DataIngestEngine", "AnalyticsEngine", "PlannerEngine", "MemoryEngine",
  "ConversationEngine", "SchedulingEngine", "RecommendationEngine", "SecurityEngine", "MonitoringEngine",
  "TranslationEngine", "SummarizationEngine", "PersonaEngine", "CreativityEngine", "OrchestrationEngine",
  "SearchEngine", "MedicineEngine", "PhoneSecurityEngine", "GoldEdgeIntegrationEngine", "ARVEngine"
];

engines.forEach((engine, idx) => {
  registerEngine(engineNames[idx], new engine());
});

// Register Doctrine engine itself
registerEngine("DoctrineEngine", doctrine);
