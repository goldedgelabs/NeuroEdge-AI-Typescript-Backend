// src/engines/DataEngine/vectorStore.ts
interface VectorEntry {
    id: string;
    vector: number[];
}

const store: VectorEntry[] = [];

export function addVector(id: string, vector: number[]) {
    store.push({ id, vector });
}

export function queryVectors(vector: number[], topK = 5) {
    // Placeholder: cosine similarity search
    return store.slice(0, topK);
}
