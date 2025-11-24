import { DoctrineAgent } from "../agents/DoctrineAgent";
import { PhoneSecurityAgent } from "../agents/PhoneSecurityAgent";
import { MedicineManagementAgent } from "../agents/MedicineManagementAgent";
import { GoldEdgeIntegrationAgent } from "../agents/GoldEdgeIntegrationAgent";
import { SelfProtectionAgent } from "../agents/SelfProtectionAgent";

export const agentManager: Record<string, any> = {};
const doctrine = new DoctrineAgent();

// global reference
(globalThis as any).__NE_AGENT_MANAGER = agentManager;

export function registerAgent(name: string, agentInstance: any) {
  agentManager[name] = new Proxy(agentInstance, {
    get(target: any, prop: string) {
      const origMethod = target[prop];
      if (typeof origMethod === "function") {
        return async (...args: any[]) => {
          const action = `${name}.${String(prop)}`;
          const folderArg = args[0]?.folder || "";
          const userRole = args[0]?.role || "user";

          let doctrineResult = { success: true };
          if (doctrine && typeof doctrine.enforceAction === "function") {
            doctrineResult = await doctrine.enforceAction(action, folderArg, userRole);
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
    },
  });
}

// -----------------------------
// Event bus integration for DB updates
// -----------------------------
import { eventBus } from "./engineManager";

export function wireDBSubscriptions(agentName: string, agentInstance: any) {
  eventBus.subscribe("db:update", async (payload: any) => {
    if (typeof agentInstance.handleDBUpdate === "function") {
      await agentInstance.handleDBUpdate(payload);
    }
  });

  eventBus.subscribe("db:delete", async (payload: any) => {
    if (typeof agentInstance.handleDBDelete === "function") {
      await agentInstance.handleDBDelete(payload);
    }
  });
}

// -----------------------------
// Register agents
// -----------------------------
registerAgent("PhoneSecurityAgent", new PhoneSecurityAgent());
registerAgent("MedicineManagementAgent", new MedicineManagementAgent());
registerAgent("GoldEdgeIntegrationAgent", new GoldEdgeIntegrationAgent());
registerAgent("SelfProtectionAgent", new SelfProtectionAgent());
registerAgent("DoctrineAgent", doctrine);
