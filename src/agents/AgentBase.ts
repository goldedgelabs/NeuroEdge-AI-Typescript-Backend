// src/agents/AgentBase.ts
export class AgentBase {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async handleDBUpdate(event: any) {
    console.log(`[Agent:${this.name}] DB Update received`, event);
  }

  async handleDBDelete(event: any) {
    console.log(`[Agent:${this.name}] DB Delete received`, event);
  }

  async recover(error: any) {
    console.warn(`[Agent:${this.name}] Recovered from error:`, error);
  }
}
