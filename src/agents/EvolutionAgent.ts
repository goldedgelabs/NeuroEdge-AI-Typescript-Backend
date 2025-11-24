// src/agents/EvolutionAgent.ts
import { logger } from "../utils/logger";
import { engineManager, eventBus } from "../core/engineManager";

export class EvolutionAgent {
  name = "EvolutionAgent";

  constructor() {
    logger.info(`${this.name} initialized`);
  }

  // Trigger adaptive improvements for engines or agents
  async evolveComponent(componentName: string, changes: any) {
    logger.log(`[EvolutionAgent] Evolving component: ${componentName}`, changes);

    const component = engineManager[componentName];
    if (!component) {
      logger.warn(`[EvolutionAgent] Component not found: ${componentName}`);
      return { success: false, message: "Component not found" };
    }

    if (typeof component.applyEvolution === "function") {
      await component.applyEvolution(changes);
      logger.info(`[EvolutionAgent] Evolution applied to ${componentName}`);
    } else {
      logger.warn(`[EvolutionAgent] Component ${componentName} cannot evolve automatically`);
    }

    // Emit evolution event for other agents
    eventBus["evolution:applied"]?.forEach(cb => cb({ componentName, changes }));

    return { success: true };
  }

  // Evaluate overall system evolution status
  async evaluateEvolution(systemState: any) {
    logger.log(`[EvolutionAgent] Evaluating system evolution`, systemState);

    const analyticsEngine = engineManager["AnalyticsEngine"];
    let evaluation = null;
    if (analyticsEngine && typeof analyticsEngine.run === "function") {
      evaluation = await analyticsEngine.run({ action: "evolutionEvaluation", systemState });
    }

    logger.info(`[EvolutionAgent] Evolution evaluation complete`);
    return evaluation;
  }
  }
