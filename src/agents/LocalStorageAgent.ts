import { AgentBase } from "./AgentBase";
import { eventBus } from "../core/engineManager";

/**
 * LocalStorageAgent
 * ---------------------
 * Handles encrypted local storage for private users,
 * manages read/write operations, caching, and offline support.
 */
export class LocalStorageAgent extends AgentBase {
    private storage: Record<string, any> = {};

    constructor() {
        super("LocalStorageAgent");
        this.subscribeToEvents();
    }

    /**
     * Subscribe to relevant events
     */
    private subscribeToEvents() {
        eventBus.subscribe("storage:set", (data) => this.setItem(data.key, data.value, data.options));
        eventBus.subscribe("storage:get", (data) => this.getItem(data.key));
        eventBus.subscribe("storage:delete", (data) => this.removeItem(data.key));
    }

    /**
     * Store item locally
     */
    async setItem(key: string, value: any, options?: { encrypted?: boolean }) {
        if (options?.encrypted) {
            // Simple placeholder encryption
            this.storage[key] = btoa(JSON.stringify(value));
        } else {
            this.storage[key] = value;
        }
        console.log(`[LocalStorageAgent] Set item: ${key}`);
        return { success: true };
    }

    /**
     * Retrieve item
     */
    async getItem(key: string) {
        let value = this.storage[key];
        try {
            // Attempt decryption if possible
            value = JSON.parse(atob(value));
        } catch {
            // value is plain
        }
        console.log(`[LocalStorageAgent] Get item: ${key}`, value);
        return { key, value };
    }

    /**
     * Remove item
     */
    async removeItem(key: string) {
        delete this.storage[key];
        console.log(`[LocalStorageAgent] Removed item: ${key}`);
        return { success: true };
    }

    /**
     * General run method
     */
    async run(input: any) {
        console.log(`[LocalStorageAgent] Run called with input:`, input);
        return { success: true };
    }

    /**
     * Recovery from errors
     */
    async recover(err: any) {
        console.warn(`[LocalStorageAgent] Recovering from error`, err);
    }
}
