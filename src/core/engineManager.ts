// src/core/engineManager.ts
/**
 * NeuroEdge Engine Manager
 * -----------------------
 * Central registry for all engines
 * Provides:
 *  - Doctrine enforcement
 *  - Self-healing
 *  - Inter-engine communication
 *  - Runtime loop attachment
 *  - Hot-Swap Support
 *  - runEngineChain helper
 */

import { DoctrineEngine } from "../engines/DoctrineEngine/index";
import { EngineRuntime } from "../runtime/EngineRuntime"; // <-- ensure this path is correct

// Import engines (25+)
import { SelfImprovementEngine } from "../engines/SelfImprovementEngine/index";
import { PredictiveEngine } from "../engines/PredictiveEngine/index";
import { CodeEngine } from "../engines/CodeEngine/index";
import { VoiceEngine } from "../engines/VoiceEngine/index";
import { VisionEngine } from "../engines/VisionEngine/index";
import { ReinforcementEngine } from "../engines/ReinforcementEngine/index";
import { DataIngestEngine } from "../engines/DataIngestEngine/index";
import { AnalyticsEngine } from "../engines/AnalyticsEngine/index";
import { PlannerEngine } from "../engines/PlannerEngine/index";
import { MemoryEngine } from "../engines/MemoryEngine/index";
import { ConversationEngine } from "../engines/ConversationEngine/index";
import { SchedulingEngine } from "../engines/SchedulingEngine/index";
import { RecommendationEngine } from "../engines/RecommendationEngine/index";
import { SecurityEngine } from "../engines/SecurityEngine/index";
import { MonitoringEngine } from "../engines/MonitoringEngine/index";
import { TranslationEngine } from "../engines/TranslationEngine/index";
import { SummarizationEngine } from "../engines/SummarizationEngine/index";
import { PersonaEngine } from "../engines/PersonaEngine/index";
import { CreativityEngine } from "../engines/CreativityEngine/index";
import { OrchestrationEngine } from "../engines/OrchestrationEngine/index";
import { SearchEngine } from "../engines/SearchEngine/index";

// New engines
import { HealthEngine } from "../engines/HealthEngine/index";
import { DeviceProtectionEngine } from "../engines/DeviceProtectionEngine/index";
import { GoldEdgeIntegrationEngine } from "../engines/GoldEdgeIntegrationEngine/index";

export const engineManager: Record<string, any> = {};
const doctrine = new DoctrineEngine();

// Preserve state for hot-swapping
const engineStateStore: Record<string, any> = {};

// Global reference for engines to access manager
(globalThis as any).__NE_ENGINE_MANAGER = engineManager;


/* ============================================================
   REGISTER ENGINE INSTANCE (Proxy + Doctrine + Self-Healing)
   ============================================================ */
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
          if (typeof doctrine.enforceAction === "function") {
            doctrineResult = await doctrine.enforceAction(action, folderArg, userRole);
          }

          if (!doctrineResult.success) {
            console.warn(`[Doctrine] Action blocked: ${action}`);
            return { blocked: true, message: doctrineResult.message };
          }

          // Execute method with self-healing
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


/* ============================================================
   REGISTER ENGINE BY CLASS (Instance + Runtime + Proxy)
   ============================================================ */
export function registerEngineClass(EngineClass: any) {
  const instance = new EngineClass();
  const name = EngineClass.name;

  // Attach runtime loop
  if (EngineRuntime) {
    instance.runtime = new EngineRuntime(instance);
    instance.runtime.start();
  }

  registerEngine(name, instance);
  return instance;
}


/* ============================================================
   HOT SWAP ENGINE (zero downtime)
   ============================================================ */
export async function hotSwapEngine(oldName: string, NewEngineClass: any) {
  const oldEngine = engineManager[oldName];
  if (!oldEngine) throw new Error(`[HotSwap] Engine not found: ${oldName}`);

  console.log(`\n[HotSwap] Swapping engine: ${oldName}`);

  // Step 1: Export state
  if (typeof oldEngine.exportState === "function") {
    engineStateStore[oldName] = await oldEngine.exportState();
  }

  // Step 2: Stop runtime
  try {
    if (oldEngine.runtime?.stop) await oldEngine.runtime.stop();
  } catch (_) {}

  // Step 3: Create new engine instance
  const newEngine = new NewEngineClass();

  // Step 4: Restore state
  if (engineStateStore[oldName] && typeof newEngine.importState === "function") {
    await newEngine.importState(engineStateStore[oldName]);
  }

  // Step 5: Restart runtime
  if (EngineRuntime) {
    newEngine.runtime = new EngineRuntime(newEngine);
    newEngine.runtime.start();
  }

  // Step 6: Re-register engine (proxy + doctrine)
  registerEngine(oldName, newEngine);

  console.log(`[HotSwap] Engine hot-swapped successfully: ${oldName}`);
  return newEngine;
}


/* ============================================================
   EVENT BUS
   ============================================================ */
export const eventBus: Record<string, Function[]> = {};

export function subscribe(channel: string, callback: Function) {
  if (!eventBus[channel]) eventBus[channel] = [];
  eventBus[channel].push(callback);
}

export function publish(channel: string, data: any) {
  const subscribers = eventBus[channel] || [];
  subscribers.forEach(cb => cb(data));
}


/* ============================================================
   RUN ENGINE CHAIN
   ============================================================ */
export async function runEngineChain(chain: { engine: string; input?: any }[]) {
  let lastOutput: any = null;

  for (const step of chain) {
    const engine = engineManager[step.engine];
    if (!engine) throw new Error(`Engine not registered: ${step.engine}`);

    if (typeof engine.run === "function") {
      lastOutput = await engine.run(step.input ?? lastOutput);
    } else if (typeof engine === "function") {
      lastOutput = await engine(step.input ?? lastOutput);
    }
  }
  return lastOutput;
}


/* ============================================================
   AUTO REGISTER ALL ENGINES
   ============================================================ */
const allEngines = [
  SelfImprovementEngine, PredictiveEngine, CodeEngine, VoiceEngine, VisionEngine,
  ReinforcementEngine, DataIngestEngine, AnalyticsEngine, PlannerEngine, MemoryEngine,
  ConversationEngine, SchedulingEngine, RecommendationEngine, SecurityEngine, MonitoringEngine,
  TranslationEngine, SummarizationEngine, PersonaEngine, CreativityEngine, OrchestrationEngine,
  SearchEngine, HealthEngine, DeviceProtectionEngine, GoldEdgeIntegrationEngine
];

allEngines.forEach(EngineClass => registerEngineClass(EngineClass));
