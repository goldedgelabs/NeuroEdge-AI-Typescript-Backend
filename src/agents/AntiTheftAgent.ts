// src/agents/AntiTheftAgent.ts
import { logger } from "../utils/logger";
import { eventBus } from "../core/engineManager";

export class AntiTheftAgent {
  name = "AntiTheftAgent";
  stolenDevices: Record<string, any> = {};

  constructor() {
    logger.info(`${this.name} initialized`);
  }

  reportDevice(deviceId: string, owner: string, details?: any) {
    this.stolenDevices[deviceId] = { owner, details, reportedAt: new Date() };
    logger.warn(`[AntiTheftAgent] Device reported stolen: ${deviceId} (${owner})`);

    // Broadcast alert to the mesh
    eventBus["antiTheft:alert"]?.forEach(cb => cb({ deviceId, owner, details }));
    return { success: true };
  }

  removeDevice(deviceId: string) {
    if (this.stolenDevices[deviceId]) {
      delete this.stolenDevices[deviceId];
      logger.log(`[AntiTheftAgent] Device removed from stolen list: ${deviceId}`);
      return { success: true };
    }
    return { success: false, message: "Device not found" };
  }

  listStolenDevices() {
    return this.stolenDevices;
  }
    }
