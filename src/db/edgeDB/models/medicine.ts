export interface AnalyticsRecord {
  id: string;
  engine: string;
  agent?: string;
  timestamp: number;
  input: any;
  output: any;
}

export const AnalyticsModel: Record<string, AnalyticsRecord> = {};
