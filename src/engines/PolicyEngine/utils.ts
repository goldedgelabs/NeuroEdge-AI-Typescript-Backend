// src/engines/PolicyEngine/utils.ts
export function loadDoctrine(path: string) {
    // Load Doctrine rules from JSON or YAML
    const fs = require("fs");
    if (!fs.existsSync(path)) return {};
    const data = fs.readFileSync(path, "utf-8");
    return JSON.parse(data);
}

export function isSensitiveAction(actionType: string) {
    const sensitive = ["deleteCoreFile", "modifyEngineBase", "exposeSecrets"];
    return sensitive.includes(actionType);
}
