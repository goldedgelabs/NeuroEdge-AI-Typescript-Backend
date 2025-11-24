// src/agents/DataIngestAgent.ts
import { engineManager } from "../core/engineManager";
import { logger } from "../utils/logger";

export class DataIngestAgent {
  name = "DataIngestAgent";

  constructor() {
    logger.log(`[DataIngestAgent] Initialized`);
  }

  // Ingest data from multiple sources
  async ingest(sources: any[]) {
    logger.info(`[DataIngestAgent] Ingesting data from ${sources.length} sources`);

    const aggregatedData: any[] = [];
    for (const source of sources) {
      try {
        // Example: call DataIngestEngine for each source
        const data = await engineManager.DataIngestEngine?.run?.({ source });
        aggregatedData.push(data);
      } catch (err) {
        logger.error(`[DataIngestAgent] Failed to ingest from source`, source, err);
      }
    }

    // Optionally store or pass to AnalyticsEngine
    if (engineManager.AnalyticsEngine) {
      await engineManager.AnalyticsEngine.run({ data: aggregatedData });
    }

    return aggregatedData;
  }

  async recover(err: any) {
    logger.warn(`[DataIngestAgent] Recovering from error`, err);
  }

  async talkTo(agentName: string, method: string, payload: any) {
    const agent = (globalThis as any).__NE_AGENT_MANAGER?.[agentName];
    if (agent && typeof agent[method] === "function") {
      return await agent[method](payload);
    }
    return null;
  }
}
