import { engineManager, eventBus } from "./engineManager";
import { agentManager } from "./agentManager";

// Add default DB handlers to all engines
function addDefaultDBHandlersToEngines() {
  for (const engineName in engineManager) {
    const engine = engineManager[engineName];
    if (!engine.handleDBUpdate) {
      engine.handleDBUpdate = async (event: any) => {
        console.log(`[DBEvent][Engine:${engineName}] update`, event.collection, event.key);
      };
    }
    if (!engine.handleDBDelete) {
      engine.handleDBDelete = async (event: any) => {
        console.log(`[DBEvent][Engine:${engineName}] delete`, event.collection, event.key);
      };
    }
  }
}

// Add default DB handlers to all agents
function addDefaultDBHandlersToAgents() {
  for (const agentName in agentManager) {
    const agent = agentManager[agentName];
    if (!agent.handleDBUpdate) {
      agent.handleDBUpdate = async (event: any) => {
        console.log(`[DBEvent][Agent:${agentName}] update`, event.collection, event.key);
      };
    }
    if (!agent.handleDBDelete) {
      agent.handleDBDelete = async (event: any) => {
        console.log(`[DBEvent][Agent:${agentName}] delete`, event.collection, event.key);
      };
    }
  }
}

// Subscribe all agents to DB events
function wireAgentsToDB() {
  eventBus.subscribe("db:update", async (event: any) => {
    for (const agentName in agentManager) {
      const agent = agentManager[agentName];
      try {
        await agent.handleDBUpdate(event);
      } catch (err) {
        console.warn(`[DBEvent][Agent:${agentName}] failed to handle update`, err);
      }
    }
  });

  eventBus.subscribe("db:delete", async (event: any) => {
    for (const agentName in agentManager) {
      const agent = agentManager[agentName];
      try {
        await agent.handleDBDelete(event);
      } catch (err) {
        console.warn(`[DBEvent][Agent:${agentName}] failed to handle delete`, err);
      }
    }
  });
}

// Subscribe all engines to DB events
function wireEnginesToDB() {
  eventBus.subscribe("db:update", async (event: any) => {
    for (const engineName in engineManager) {
      const engine = engineManager[engineName];
      try {
        await engine.handleDBUpdate(event);
      } catch (err) {
        console.warn(`[DBEvent][Engine:${engineName}] failed to handle update`, err);
      }
    }
  });

  eventBus.subscribe("db:delete", async (event: any) => {
    for (const engineName in engineManager) {
      const engine = engineManager[engineName];
      try {
        await engine.handleDBDelete(event);
      } catch (err) {
        console.warn(`[DBEvent][Engine:${engineName}] failed to handle delete`, err);
      }
    }
  });
}

// Main initializer
export function initializeDBWiring() {
  addDefaultDBHandlersToAgents();
  addDefaultDBHandlersToEngines();
  wireAgentsToDB();
  wireEnginesToDB();
  console.log("[DBWiring] All engines and agents wired with default DB handlers");
                                         }
