import { EngineBase } from "../EngineBase";
import { survivalCheck } from "./survival_check";
import { performResearch } from "./utils";

/**
 * ResearchEngine
 * Handles deep research queries, web/data analysis, and insight extraction.
 * Fully integrated with Doctrine and survival checks.
 */
export class ResearchEngine extends EngineBase {
    name = "ResearchEngine";

    /**
     * Main execution method.
     * Runs research queries safely if survival checks pass.
     */
    async run(query: string) {
        const check = survivalCheck();

        if (!check.memorySafe || !check.doctrineApproved) {
            return {
                blocked: true,
                reason: "ResearchEngine cannot run due to memory, offline, or doctrine restrictions",
            };
        }

        const results = await performResearch(query);

        return {
            status: "success",
            timestamp: new Date(),
            query,
            results,
        };
    }
}
