import { logger } from "../utils/logger";
import { subscribe } from "../core/engineManager";

export class MedicineManagementAgent {
  name = "MedicineManagementAgent";

  constructor() {
    logger.log(`[Agent Initialized] ${this.name}`);
    // Subscribe to medicine updates
    subscribe("db:update", this.handleDBUpdate.bind(this));
  }

  async handleDBUpdate({ collection, key, value, target }: any) {
    if (collection === "medicine") {
      logger.log(`[${this.name}] Medicine updated: ${key}`, value);
      // Trigger agent-specific logic
      await this.processMedicineUpdate(value);
    }
  }

  async processMedicineUpdate(medicine: any) {
    // Example: Notify doctors, update predictive engine, log, etc.
    logger.log(`[${this.name}] Processing medicine update:`, medicine);
  }

  async addMedicine(medicine: any) {
    // Optional helper to add medicine and trigger DB update
    // Example: db.set("medicine", medicine.id, medicine)
    logger.log(`[${this.name}] Adding new medicine:`, medicine);
  }

  async recover(err: any) {
    logger.error(`[${this.name}] Recovered from error:`, err);
    return { recovered: true };
  }
}
