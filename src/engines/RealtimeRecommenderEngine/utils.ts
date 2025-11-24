// src/engines/RealtimeRecommenderEngine/utils.ts
export function formatRecommendation(rec: any) {
    return `[${rec.severity.toUpperCase()}] ${rec.message} ${
        rec.suggestedAction ? `(Action: ${rec.suggestedAction})` : ""
    }`;
}

export function filterRecommendations(recs: any[], level: string) {
    return recs.filter(r => r.severity === level);
}
