// src/engines/CodeEngine/optimizer.ts

export function optimizeCode(code: string) {
    // Basic example: remove empty lines and extra spaces
    const optimized = code
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join("\n");
    return optimized;
}
