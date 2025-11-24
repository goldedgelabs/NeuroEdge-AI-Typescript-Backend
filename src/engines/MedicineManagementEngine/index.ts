import { EngineBase } from "../EngineBase";
import { logger } from "../../utils/logger";
import { eventBus } from "../../core/engineManager";

export class MedicineManagementEngine extends EngineBase {
  constructor() {
    super();
    this.survivalCheck();
  }

  survivalCheck() {
    logger.info("MedicineManagementEngine survival check OK");
  }

  async run(input?: any) {
    logger.log("MedicineManagementEngine running with input:", input);
    // Example: subscription update, new medicine, AfyaLink data
    eventBus["MedicineManagement"]?.forEach(cb => cb(input));
    return { success: true, action: "MedicineDataUpdated" };
  }

  async recover(err: any) {
    logger.warn("MedicineManagementEngine recovered from error:", err);
  }
}
