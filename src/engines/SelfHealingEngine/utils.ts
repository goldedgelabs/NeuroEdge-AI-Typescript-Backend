// src/engines/SelfHealingEngine/utils.ts
export function formatDiagnosticsReport(report: Record<string, any>) {
    let output = "=== Self-Healing Diagnostics ===\n";
    for (const engine in report) {
        output += `${engine}: ${JSON.stringify(report[engine])}\n`;
    }
    return output;
}

export function validateEngineName(name: string) {
    return typeof name === "string" && name.length > 0;
}
