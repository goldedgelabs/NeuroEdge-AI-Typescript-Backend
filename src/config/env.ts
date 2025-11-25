// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",
  DB_MODE: process.env.DB_MODE || "edge",
  ENABLE_REPLICATION: process.env.ENABLE_REPLICATION === "true",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
