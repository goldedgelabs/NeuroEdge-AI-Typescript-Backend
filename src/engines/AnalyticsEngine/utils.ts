// src/engines/AnalyticsEngine/utils.ts
export function aggregateMetrics(metrics: Record<string, number>) {
    const total = Object.values(metrics).reduce((acc, val) => acc + val, 0);
    return { total, breakdown: metrics };
}

export function summarizeEvents(events: Record<string, any[]>) {
    return Object.entries(events).map(([type, data]) => ({
        type,
        count: data.length,
        sample: data.slice(0, 3)
    }));
}
