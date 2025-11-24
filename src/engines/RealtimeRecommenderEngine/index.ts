// src/engines/RealtimeRecommenderEngine/index.ts
import { EngineBase } from "../EngineBase";

interface Recommendation {
    message: string;
    severity: "low" | "medium" | "high";
    suggestedAction?: string;
}

export class RealtimeRecommenderEngine extends EngineBase {
    name = "RealtimeRecommenderEngine";

    constructor() {
        super();
    }

    analyzeSystemState(state: any): Recommendation[] {
        const recommendations: Recommendation[] = [];

        // Example checks
        if (state.cpuUsage > 80) {
            recommendations.push({
                message: "High CPU usage detected. Consider scaling workers.",
                severity: "high",
                suggestedAction: "scaleWorkers",
            });
        }

        if (!state.auditUpToDate) {
            recommendations.push({
                message: "Policy audit logs are stale.",
                severity: "medium",
                suggestedAction: "refreshAuditLogs",
            });
        }

        if (state.memoryFragmented) {
            recommendations.push({
                message: "Memory fragmentation detected. Recommend cleanup or restart.",
                severity: "medium",
                suggestedAction: "memoryCleanup",
            });
        }

        return recommendations;
    }

    broadcastRecommendations(state: any, callback: (rec: Recommendation) => void) {
        const recs = this.analyzeSystemState(state);
        recs.forEach(callback);
        return recs;
    }
}
