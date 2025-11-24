import { engineManager, eventBus } from "./engineManager";
import { agentManager } from "./agentManager";

// Subscribe all agents to DB events
export function wireAgentsToDB() {
  eventBus.subscribe("db:update", async (event: any) => {
    for (const agentName in agentManager) {
      const agent = agentManager[agentName];
      if (typeof agent.handleDBUpdate === "function") {
        try {
          await agent.handleDBUpdate(event);
        } catch (err) {
          console.warn(`[DBEvent] ${agentName} failed to handle update`, err);
        }
      }
    }
  });

  eventBus.subscribe("db:delete", async (event: any) => {
    for (const agentName in agentManager) {
      const agent = agentManager[agentName];
      if (typeof agent.handleDBDelete === "function") {
        try {
          await agent.handleDBDelete(event);
        } catch (err) {
          console.warn(`[DBEvent] ${agentName} failed to handle delete`, err);
        }
      }
    }
  });
}

// Subscribe engines to DB events if they need it
export function wireEnginesToDB() {
  eventBus.subscribe("db:update", async (event: any) => {
    for (const engineName in engineManager) {
      const engine = engineManager[engineName];
      if (typeof engine.handleDBUpdate === "function") {
        try {
          await engine.handleDBUpdate(event);
        } catch (err) {
          console.warn(`[DBEvent] ${engineName} failed to handle update`, err);
        }
      }
    }
  });

  eventBus.subscribe("db:delete", async (event: any) => {
    for (const engineName in engineManager) {
      const engine = engineManager[engineName];
      if (typeof engine.handleDBDelete === "function") {
        try {
          await engine.handleDBDelete(event);
        } catch (err) {
          console.warn(`[DBEvent] ${engineName} failed to handle delete`, err);
        }
      }
    }
  });
}

// Initialize wiring
export function initializeDBWiring() {
  wireAgentsToDB();
  wireEnginesToDB();
  console.log("[DBWiring] All engines and agents wired to DB events");
}
