import { AgentBase } from "./AgentBase";
import { eventBus } from "../core/engineManager";

export class VerifierAgent extends AgentBase {
  constructor() {
    super("VerifierAgent");
  }

  /**
   * Verifies results, data integrity, or computations from other agents/engines.
   */
  async run(input: { data: any; expected?: any }) {
    const { data, expected } = input || {};

    if (!data) {
      return { error: "VerifierAgent requires a 'data' field." };
    }

    let verified = true;
    let details: string[] = [];

    if (expected !== undefined) {
      verified = JSON.stringify(data) === JSON.stringify(expected);
      if (!verified) {
        details.push(`Data does not match expected value.`);
      }
    }

    console.log(`[VerifierAgent] Verification result:`, verified);

    // Publish verification event
    eventBus.publish("verification:completed", { data, verified, details });

    return { success: true, verified, details };
  }

  async recover(err: any) {
    console.error(`[VerifierAgent] Error during verification:`, err);
  }
}
