// src/engines/DataEngine/index.ts
import { EngineBase } from "../EngineBase";
import { survivalCheck } from "./survival_check";
import { addVector, queryVectors } from "./vectorStore";
import { createEmbedding } from "./embeddingService";
import { buildKnowledgeGraph, queryGraph } from "./knowledgeGraph";
import { logger } from "../../utils/logger";

export class DataEngine extends EngineBase {
    name = "DataEngine";

    constructor() {
        super();
        logger.log(`[${this.name}] Initialized`);
        const status = survivalCheck();
        if (!status.online) logger.warn(`[${this.name}] Offline mode activated`);
    }

    async storeData(id: string, content: string) {
        const embedding = await createEmbedding(content);
        addVector(id, embedding);
        buildKnowledgeGraph(id, content);
        return { id, embedding };
    }

    async queryData(query: string) {
        const embedding = await createEmbedding(query);
        const results = queryVectors(embedding);
        const graphResults = queryGraph(query);
        return { results, graphResults };
    }
}
