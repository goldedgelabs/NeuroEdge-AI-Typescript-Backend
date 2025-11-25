import { AgentBase } from "./AgentBase";
import { eventBus } from "../core/engineManager";

/**
 * MemoryAgent
 * -----------
 * Handles storing, retrieving, and managing data in NeuroEdge memory.
 */
export class MemoryAgent extends AgentBase {
    private memoryStore: Record<string, any> = {};

    constructor() {
        super("MemoryAgent");
        this.subscribeToDBEvents();
    }

    /**
     * Subscribe to database events (if needed)
     */
    private subscribeToDBEvents() {
        eventBus.subscribe("db:update", (event) => this.handleDBUpdate(event));
        eventBus.subscribe("db:delete", (event) => this.handleDBDelete(event));
    }

    /**
     * Handle database updates
     */
    async handleDBUpdate(event: any) {
        const { collection, key, value } = event;
        if (collection !== "memory") return;
        this.memoryStore[key] = value;
        console.log(`[MemoryAgent] Memory updated: ${key}`, value);
    }

    /**
     * Handle database deletion
     */
    async handleDBDelete(event: any) {
        const { collection, key } = event;
        if (collection !== "memory") return;
        delete this.memoryStore[key];
        console.log(`[MemoryAgent] Memory deleted: ${key}`);
    }

    /**
     * Store a memory entry
     */
    async setMemory(key: string, value: any) {
        this.memoryStore[key] = value;
        eventBus.publish("db:update", { collection: "memory", key, value });
        console.log(`[MemoryAgent] Memory saved: ${key}`);
        return { success: true };
    }

    /**
     * Retrieve memory entry
     */
    async getMemory(key: string) {
        return this.memoryStore[key] || null;
    }

    /**
     * Remove a memory entry
     */
    async removeMemory(key: string) {
        delete this.memoryStore[key];
        eventBus.publish("db:delete", { collection: "memory", key });
        console.log(`[MemoryAgent] Memory removed: ${key}`);
        return { success
