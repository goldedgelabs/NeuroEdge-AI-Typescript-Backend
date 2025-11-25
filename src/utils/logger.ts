// src/utils/logger.ts
export const logger = {
  log: (msg: string, data?: any) => {
    console.log(`[LOG] ${msg}`, data || "");
  },
  warn: (msg: string, data?: any) => {
    console.warn(`[WARN] ${msg}`, data || "");
  },
  error: (msg: string, data?: any) => {
    console.error(`[ERROR] ${msg}`, data || "");
  },
  success: (msg: string, data?: any) => {
    console.log(`[SUCCESS] ${msg}`, data || "");
  },
};
