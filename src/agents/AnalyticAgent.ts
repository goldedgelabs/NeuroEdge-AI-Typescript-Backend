import { AgentBase } from "./AgentBase";
import { eventBus } from "../core/eventBus";
import { db } from "../db/dbManager";

export class AnalyticsAgent extends AgentBase {
  constructor() {
    super({
      id: "analytics-agent",
      name: "Analytics Agent",
      description: "Performs analytics on incoming data, user activity, and system performance.",
      type: "analytics"
    });
  }

  /**
   * Main handler — receives analytics tasks.
   */
  async handle(payload: any): Promise<any> {
    const { action, data } = payload;

    switch (action) {
      case "log-event":
        return this.logEvent(data);

      case "summarize-events":
        return this.summarizeEvents();

      default:
        return { error: "Unknown analytics action" };
    }
  }

  /**
   * Store an analytics event into DB and notify subscribers.
   */
  async logEvent(event: any) {
    const id = Date.now().toString();

    await db.set("analytics_events", id, event, "edge");

    eventBus.publish("analytics:new-event", { id, event });

    return { success: true, id };
  }

  /**
   * Summarize events (simple version)
   */
  async summarizeEvents() {
    const records = await db.getAll("analytics_events", "edge");

    const total = records.length;
    const grouped: Record<string, number> = {};

    for (const record of records) {
      const type = record.type ?? "unknown";
      grouped[type] = (grouped[type] || 0) + 1;
    }

    return { total, grouped };
  }

  /**
   * Optional: subscribe this agent to automatic DB updates
   */
  async init() {
    eventBus.subscribe("db:update", async (e) => {
      if (e.collection === "analytics_events") {
        // Example reactive behavior
        console.log(`[AnalyticsAgent] Event updated: ${e.key}`);
      }
    });
  }
}
