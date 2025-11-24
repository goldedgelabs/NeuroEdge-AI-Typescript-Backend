// src/agents/SelfProtectionAgent.ts
import { logger } from "../utils/logger";
import { eventBus } from "../core/engineManager";

export class SelfProtectionAgent {
  name = "SelfProtectionAgent";
  monitoredModules: string[] = ["NeuroEdgeCore", "EngineBase", "AgentManager"];
  checkInterval: number; // ms
  intervalRef: any;

  constructor(checkInterval = 5000) { // default: check every 5 seconds
    this.checkInterval = checkInterval;
    logger.info(`${this.name} initialized, monitoring modules...`);
    this.startMonitoring();
  }

  startMonitoring() {
    this.intervalRef = setInterval(() => this.monitorModules(), this.checkInterval);
  }

  stopMonitoring() {
    clearInterval(this.intervalRef);
  }

  monitorModules() {
    for (const mod of this.monitoredModules) {
      try {
        // Check if module exists
        const loaded = require.resolve(`../${mod}`);
        if (!loaded) throw new Error("Module not found");
      } catch (err) {
        logger.warn(`[SelfProtectionAgent] Module missing: ${mod}. Reinstalling...`);
        this.reinstallModule(mod);
      }
    }
  }

  reinstallModule(moduleName: string) {
    // Auto-reinstall logic (could fetch from trusted repo or backup)
    logger.log(`[SelfProtectionAgent] Reinstalling module: ${moduleName}`);
    // Placeholder: integrate with actual installer or updater
    eventBus["selfProtection:moduleRestored"]?.forEach(cb => cb({ moduleName, timestamp: new Date() }));
  }

  reportTampering(details: any) {
    logger.error(`[SelfProtectionAgent] Tampering detected`, details);
    eventBus["selfProtection:tamperAlert"]?.forEach(cb => cb(details));
  }
}
