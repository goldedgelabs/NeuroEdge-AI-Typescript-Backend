// src/engines/SimulationEngine/utils.ts
export function analyzeRisks(prediction: any) {
    // Analyze risk levels and categorize
    if (prediction.predictedImpact > 80) return "High";
    if (prediction.predictedImpact > 50) return "Medium";
    return "Low";
}

export function recommendMitigations(prediction: any) {
    // Suggest steps to reduce risk or improve outcome
    return prediction.risks.map((risk: string) => `Mitigation for ${risk}`);
}
