import { AgentBase } from "./AgentBase";
import { SearchEngine } from "../engines/SearchEngine";
import { AnalyticsEngine } from "../engines/AnalyticsEngine";

export class DiscoveryAgent extends AgentBase {
    private searchEngine: SearchEngine;
    private analyticsEngine: AnalyticsEngine;

    constructor() {
        super("DiscoveryAgent");
        this.searchEngine = new SearchEngine();
        this.analyticsEngine = new AnalyticsEngine();
    }

    /**
     * Discover new content or resources based on input query
     */
    async discover(query: string) {
        const results = await this.searchEngine.run({ query });
        const insights = await this.analyticsEngine.analyze(results);
        return { results, insights };
    }

    /**
     * Auto-discover routine
     */
    async autoDiscover() {
        const trendingQueries = await this.analyticsEngine.getTrendingQueries();
        const discoveries = [];
        for (const query of trendingQueries) {
            const res = await this.discover(query);
            discoveries.push(res);
        }
        return discoveries;
    }
}
