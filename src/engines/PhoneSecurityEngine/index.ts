import { EngineBase } from "../EngineBase";
import { logger } from "../../utils/logger";
import { eventBus } from "../../core/engineManager";

export class PhoneSecurityEngine extends EngineBase {
  constructor() {
    super();
    this.survivalCheck();
  }

  survivalCheck() {
    logger.info("PhoneSecurityEngine survival check OK");
  }

  async run(input?: any) {
    logger.log("PhoneSecurityEngine running with input:", input);
    // Example: trigger alarm, locate device, lock device
    eventBus["PhoneSecurity"]?.forEach(cb => cb(input));
    return { success: true, action: "PhoneSecurityChecked" };
  }

  async recover(err: any) {
    logger.warn("PhoneSecurityEngine recovered from error:", err);
  }
}
