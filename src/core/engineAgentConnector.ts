// src/core/engineAgentConnector.ts
import { engineManager, eventBus } from "./engineManager";
import { agentManager } from "./agentManager";

/**
 * Wire engines to agents
 * Each engine triggers relevant agents automatically
 */

// Example: HealthEngine triggers MedicineManagementAgent
export function wireEnginesToAgents() {

  // -------------------
  // 1. SelfImprovementEngine → SelfImprovementAgent
  // -------------------
  eventBus.subscribe("SelfImprovementEngine:update", async (payload: any) => {
    const agent = agentManager["SelfImprovementAgent"];
    if (agent && typeof agent.handleUpdate === "function") {
      await agent.handleUpdate(payload);
    }
  });

  // -------------------
  // 2. PlannerEngine → PlannerAgent
  // -------------------
  eventBus.subscribe("PlannerEngine:plan", async (planData: any) => {
    const agent = agentManager["PlannerAgent"];
    if (agent && typeof agent.handlePlan === "function") {
      await agent.handlePlan(planData);
    }
  });

  // -------------------
  // 3. AnalyticsEngine → AnalyticsAgent, MetricsAgent, TelemetryAgent
  // -------------------
  eventBus.subscribe("AnalyticsEngine:analyze", async (data: any) => {
    const analytics = agentManager["AnalyticsAgent"];
    const metrics = agentManager["MetricsAgent"];
    const telemetry = agentManager["TelemetryAgent"];

    if (analytics?.handleData) await analytics.handleData(data);
    if (metrics?.handleData) await metrics.handleData(data);
    if (telemetry?.handleData) await telemetry.handleData(data);
  });

  // -------------------
  // 4. SecurityEngine → SecurityAgent, SecurityCheckAgent, SelfProtectionAgent
  // -------------------
  eventBus.subscribe("SecurityEngine:alert", async (alertData: any) => {
    const security = agentManager["SecurityAgent"];
    const check = agentManager["SecurityCheckAgent"];
    const selfProtect = agentManager["SelfProtectionAgent"];

    if (security?.handleAlert) await security.handleAlert(alertData);
    if (check?.verify) await check.verify(alertData);
    if (selfProtect?.protect) await selfProtect.protect(alertData);
  });

  // -------------------
  // 5. Medicine-related engines → MedicineManagementAgent
  // -------------------
  eventBus.subscribe("HealthEngine:medicine", async (medData: any) => {
    const medAgent = agentManager["MedicineManagementAgent"];
    if (medAgent?.handleMedicineUpdate) await medAgent.handleMedicineUpdate(medData);
  });

  // -------------------
  // 6. PhoneSecurityEngine → PhoneSecurityAgent
  // -------------------
  eventBus.subscribe("PhoneSecurityEngine:alert", async (phoneEvent: any) => {
    const phoneAgent = agentManager["PhoneSecurityAgent"];
    if (phoneAgent?.handlePhoneEvent) await phoneAgent.handlePhoneEvent(phoneEvent);
  });

  // -------------------
  // 7. OrchestrationEngine → Multiple orchestration agents
  // -------------------
  eventBus.subscribe("OrchestrationEngine:execute", async (task: any) => {
    const orchestrator = agentManager["OrchestratorAgent"];
    const orchestrate = agentManager["OrchestrationAgent"];

    if (orchestrator?.handleTask) await orchestrator.handleTask(task);
    if (orchestrate?.run) await orchestrate.run(task);
  });

  // -------------------
  // 8. All engines publish general events
  // -------------------
  Object.keys(engineManager).forEach((engineName) => {
    const engine = engineManager[engineName];
    if (engine?.run) {
      const originalRun = engine.run.bind(engine);
      engine.run = async (input: any) => {
        const output = await originalRun(input);
        // Publish a generic event for this engine
        publish(`${engineName}:run`, output);
        return output;
      };
    }
  });

  console.log("[NeuroEdge] Engine → Agent wiring complete.");
}
