// src/core/agentEngineBridge.ts
import { engineManager } from "./engineManager";
import { eventBus } from "./eventBus";
import { logger } from "../utils/logger";

// Mapping: which engines listen to which agent events
const agentToEngineMap: Record<string, string[]> = {
  MedicineManagementAgent: ["HealthEngine", "PredictiveEngine"],
  PhoneSecurityAgent: ["DeviceProtectionEngine", "SecurityEngine"],
  GoldEdgeIntegrationAgent: ["GoldEdgeIntegrationEngine", "AnalyticsEngine"],
  SelfProtectionAgent: ["DeviceProtectionEngine"],
  // Add more mappings as needed
};

export function wireAgentsToEngines() {
  for (const agentName of Object.keys(agentToEngineMap)) {
    const engines = agentToEngineMap[agentName];
    
    eventBus.subscribe(`${agentName}:update`, async (payload: any) => {
      logger.log(`[Agent→Engine] ${agentName} updated → triggering engines: ${engines.join(", ")}`);
      
      for (const engineName of engines) {
        const engine = engineManager[engineName];
        if (engine && typeof engine.run === "function") {
          try {
            await engine.run(payload);
          } catch (err) {
            logger.error(`[Agent→Engine] Error running ${engineName} due to ${agentName} update:`, err);
          }
        }
      }
    });
  }
}
