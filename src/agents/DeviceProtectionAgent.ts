import { AgentBase } from "./AgentBase";
import { DeviceProtectionEngine } from "../engines/DeviceProtectionEngine";
import { SecurityEngine } from "../engines/SecurityEngine";
import { MonitoringEngine } from "../engines/MonitoringEngine";

export class DeviceProtectionAgent extends AgentBase {
    private protectionEngine: DeviceProtectionEngine;
    private securityEngine: SecurityEngine;
    private monitoringEngine: MonitoringEngine;

    constructor() {
        super("DeviceProtectionAgent");
        this.protectionEngine = new DeviceProtectionEngine();
        this.securityEngine = new SecurityEngine();
        this.monitoringEngine = new MonitoringEngine();
    }

    /**
     * Run continuous device health + threat monitoring.
     */
    async monitorDevice() {
        return await this.monitoringEngine.scan();
    }

    /**
     * Handle threat detection.
     */
    async mitigateThreat(threat: any) {
        return await this.protectionEngine.mitigate(threat);
    }

    /**
     * Full protection workflow.
     */
    async protect() {
        const status = await this.monitorDevice();

        if (status?.threatDetected) {
            await this.mitigateThreat(status.threat);
        }

        return status;
    }
}
