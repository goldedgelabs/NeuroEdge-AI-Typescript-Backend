import { EngineBase } from "../EngineBase";

export class DecisionEngine extends EngineBase {
  constructor() {
    super("DecisionEngine");
  }

  /**
   * Run a decision-making process
   * input: { options: [], criteria: {} }
   */
  async run(input: any) {
    console.log(`[DecisionEngine] Running decision with input:`, input);

    const options: any[] = input?.options || [];
    const criteria: Record<string, any> = input?.criteria || {};

    // Simple scoring example
    const scoredOptions = options.map(option => {
      let score = 0;
      for (const key in criteria) {
        if (option[key] !== undefined) {
          score += option[key] * criteria[key];
        }
      }
      return { option, score };
    });

    // Sort descending by score
    scoredOptions.sort((a, b) => b.score - a.score);

    return {
      bestOption: scoredOptions[0]?.option || null,
      scoredOptions,
    };
  }

  async handleDBUpdate(event: any) {
    console.log(`[DecisionEngine] DB Update event:`, event);
    // Optional: reevaluate decisions
  }

  async handleDBDelete(event: any) {
    console.log(`[DecisionEngine] DB Delete event:`, event);
    // Optional: cleanup related decision cache
  }
}
