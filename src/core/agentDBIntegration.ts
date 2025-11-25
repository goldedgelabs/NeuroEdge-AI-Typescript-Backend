// src/core/agentDBIntegration.ts

import { agentManager } from "./agentManager";
import { db } from "../db/dbManager";
import { eventBus } from "./engineManager";
import { logger } from "../utils/logger";

// Wrap agent.run() to automatically persist output to DB and notify subscribers
export function wireAgentsToDB() {
  Object.entries(agentManager).forEach(([agentName, agent]) => {
    if (!agent || typeof agent.run !== "function") return;

    const originalRun = agent.run.bind(agent);

    agent.run = async function(input: any) {
      // Execute the agent's original logic
      const result = await originalRun(input);

      try {
        // Persist output to DB
        if (result && result.id && result.collection) {
          await db.set(result.collection, result.id, result, "edge");
          logger.log(`[AgentDBIntegration] ${agentName} saved record:`, result.id);

          // Publish DB update event
          eventBus.publish("db:update", {
            collection: result.collection,
            key: result.id,
            value: result,
            source: agentName,
          });
        }
      } catch (err) {
        logger.error(`[AgentDBIntegration] Failed to persist DB data for ${agentName}:`, err);
      }

      return result;
    };
  });
}

// Auto-run wiring if imported
wireAgentsToDB();
logger.log("[AgentDBIntegration] All agents wired to DB updates.");
