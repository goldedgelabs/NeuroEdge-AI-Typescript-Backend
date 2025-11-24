// src/engines/ResearchAnalyticsEngine/utils.ts
export function formatReport(report: any) {
    return `=== Research Report ===
Summary: ${report.summary}
Prediction: ${report.prediction}`;
}

export function validateScenarioInput(input: string) {
    if (!input || input.length < 3) return false;
    return true;
}
