export abstract class EngineBase {
  name: string = "EngineBase";

  abstract run(input: any): Promise<any>;

  // Default self-healing hook
  async recover(error?: any) {
    console.warn(`[${this.name}] Self-healing triggered`, error);
    // Example: reload model, reset memory, restart services
    return true;
  }
}
