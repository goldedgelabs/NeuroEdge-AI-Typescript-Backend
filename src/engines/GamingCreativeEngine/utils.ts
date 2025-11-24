// src/engines/GamingCreativeEngine/utils.ts
export function formatCreativeOutput(type: string, content: string) {
    return `[${type.toUpperCase()}] ${content}`;
}

export function generatePreview(content: string, mode: "text" | "audio" | "video" | "game" = "text") {
    return `Preview (${mode}): ${content.substring(0, 100)}...`;
}
