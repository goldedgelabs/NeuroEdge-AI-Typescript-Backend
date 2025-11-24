// src/engines/MemoryEngine/memoryStore.ts
interface MemoryEntry {
    content: string;
    embedding: number[];
    metadata?: any;
}

const memoryDB: Record<string, MemoryEntry[]> = {};

export function addMemory(userId: string, content: string, embedding: number[], metadata?: any) {
    if (!memoryDB[userId]) memoryDB[userId] = [];
    memoryDB[userId].push({ content, embedding, metadata });
}

export function getMemory(userId: string, queryEmbedding: number[], topK = 5) {
    const userMemory = memoryDB[userId] || [];
    // Placeholder: simple similarity search (replace with cosine similarity or vector DB)
    return userMemory.slice(0, topK);
}

export function deleteMemory(userId: string) {
    delete memoryDB[userId];
        }
