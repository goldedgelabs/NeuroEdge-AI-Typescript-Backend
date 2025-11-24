// src/agents/FeedbackAgent.ts
import { logger } from "../utils/logger";
import { engineManager, eventBus } from "../core/engineManager";

export class FeedbackAgent {
  name = "FeedbackAgent";

  constructor() {
    logger.info(`${this.name} initialized`);
  }

  // Collect feedback from users or other agents
  async collectFeedback(source: string, feedback: any) {
    logger.log(`[FeedbackAgent] Collecting feedback from: ${source}`, feedback);

    // Optionally process feedback through a relevant engine
    const analyticsEngine = engineManager["AnalyticsEngine"];
    let processed = null;
    if (analyticsEngine && typeof analyticsEngine.run === "function") {
      processed = await analyticsEngine.run({ source, feedback });
    }

    // Emit feedback event
    eventBus["feedback:received"]?.forEach(cb => cb({ source, feedback, processed }));

    logger.info(`[FeedbackAgent] Feedback collected from ${source}`);
    return { success: true, processed };
  }

  // Analyze feedback trends
  async analyzeTrends(feedbackArray: any[]) {
    logger.log(`[FeedbackAgent] Analyzing feedback trends`, feedbackArray);

    const analyticsEngine = engineManager["AnalyticsEngine"];
    let trend = null;
    if (analyticsEngine && typeof analyticsEngine.run === "function") {
      trend = await analyticsEngine.run({ action: "trendAnalysis", feedbackArray });
    }

    logger.info(`[FeedbackAgent] Feedback trend analysis complete`);
    return trend;
  }
}
