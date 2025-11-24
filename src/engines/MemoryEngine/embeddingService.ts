// src/engines/MemoryEngine/embeddingService.ts

export async function createEmbedding(text: string): Promise<number[]> {
    // Placeholder embedding generation
    return text.split("").map(c => c.charCodeAt(0) / 255);
}
