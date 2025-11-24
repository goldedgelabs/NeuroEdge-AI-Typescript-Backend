// src/engines/CodeEngine/utils.ts

export function detectLanguage(code: string) {
    if (code.includes("console.log")) return "javascript";
    if (code.includes("print(")) return "python";
    return "unknown";
}
