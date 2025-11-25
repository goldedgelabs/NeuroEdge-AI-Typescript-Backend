import { AgentBase } from "./AgentBase";
import { eventBus, agentManager } from "../core/engineManager";

export class PluginAgent extends AgentBase {
  constructor() {
    super("PluginAgent");
  }

  /**
   * Run method for handling plugin actions
   * input example: { pluginName: string, action: string, payload: any }
   */
  async run(input?: any) {
    if (!input) return { error: "No input provided" };

    const { pluginName, action, payload } = input;

    console.log(`[PluginAgent] Handling plugin: ${pluginName}, action: ${action}`);

    // Notify PluginManagerAgent if exists
    const pluginManager = agentManager["PluginManagerAgent"];
    if (pluginManager && typeof pluginManager.run === "function") {
      const result = await pluginManager.run({ pluginName, action, payload });
      return result;
    }

    // Fallback or custom plugin handling
    return { message: `Plugin ${pluginName} handled action ${action}`, payload };
  }

  async recover(err: any) {
    console.error(`[PluginAgent] Recovering from error:`, err);
  }
}
