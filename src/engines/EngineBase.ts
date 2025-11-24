// src/engines/EngineBase.ts
export class EngineBase {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async run(input: any): Promise<any> {
    return input; // default placeholder
  }

  // -----------------------------
  // DB Event Handlers (optional)
  // -----------------------------
  async handleDBUpdate(event: any) {
    // Default: log event, can be overridden in child engine
    console.log(`[Engine:${this.name}] DB Update received`, event);
  }

  async handleDBDelete(event: any) {
    console.log(`[Engine:${this.name}] DB Delete received`, event);
  }

  async recover(error: any) {
    console.warn(`[Engine:${this.name}] Recovered from error:`, error);
  }
}
