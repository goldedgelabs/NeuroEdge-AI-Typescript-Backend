export interface LogEntry {
  id: string;
  timestamp: number;
  level: "log" | "info" | "warn" | "error";
  message: string;
  context?: any;
}

export const LogsModel: Record<string, LogEntry> = {};
