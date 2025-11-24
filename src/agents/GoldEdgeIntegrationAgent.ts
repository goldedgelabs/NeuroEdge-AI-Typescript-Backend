// src/agents/GoldEdgeIntegrationAgent.ts
import { logger } from "../utils/logger";
import { eventBus } from "../core/engineManager";

export class GoldEdgeIntegrationAgent {
  name = "GoldEdgeIntegrationAgent";
  connectedApps: Record<string, any> = {};

  constructor() {
    logger.info(`${this.name} initialized`);
  }

  registerApp(appName: string, info: any) {
    this.connectedApps[appName] = info;
    logger.log(`[GoldEdgeIntegrationAgent] App registered: ${appName}`, info);
    eventBus["goldEdge:appRegistered"]?.forEach(cb => cb({ appName, info }));
    return { success: true };
  }

  sendData(appName: string, data: any) {
    if (!this.connectedApps[appName]) {
      return { success: false, message: "App not registered" };
    }
    logger.log(`[GoldEdgeIntegrationAgent] Sending data to ${appName}`, data);
    eventBus[`goldEdge:${appName}:data`] = eventBus[`goldEdge:${appName}:data`] || [];
    eventBus[`goldEdge:${appName}:data`].forEach(cb => cb(data));
    return { success: true };
  }

  listApps() {
    return this.connectedApps;
  }
}
