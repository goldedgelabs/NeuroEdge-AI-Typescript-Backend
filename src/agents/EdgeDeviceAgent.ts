import { AgentBase } from "./AgentBase";
import { eventBus } from "../core/engineManager";

/**
 * EdgeDeviceAgent
 * ---------------------
 * Manages edge devices in the network.
 * Handles device registration, status, and execution of tasks locally.
 */
export class EdgeDeviceAgent extends AgentBase {
    constructor() {
        super("EdgeDeviceAgent");
        this.subscribeToEvents();
    }

    /**
     * Subscribe to relevant events on the eventBus
     */
    private subscribeToEvents() {
        eventBus.subscribe("task:started", (data) => this.onTaskStarted(data));
        eventBus.subscribe("task:completed", (data) => this.onTaskCompleted(data));
    }

    /**
     * Handle when a distributed task starts
     */
    private onTaskStarted(data: any) {
        console.log(`[EdgeDeviceAgent] Task started on edge device:`, data);
        // Logic to allocate task locally or on nearby edge devices
    }

    /**
     * Handle when a distributed task completes
     */
    private onTaskCompleted(data: any) {
        console.log(`[EdgeDeviceAgent] Task completed on edge device:`, data);
        // Logic to update device status or logs
    }

    /**
     * Check the status of a connected edge device
     */
    async checkDeviceStatus(deviceId: string) {
        console.log(`[EdgeDeviceAgent] Checking status for device: ${deviceId}`);
        // Placeholder: simulate device status
        return { deviceId, status: "online" };
    }

    /**
     * Recover from errors
     */
    async recover(err: any) {
        console.warn(`[EdgeDeviceAgent] Recovering from error`, err);
    }
}
