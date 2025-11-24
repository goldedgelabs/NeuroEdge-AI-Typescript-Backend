// src/agents/FileHandlerAgent.ts
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";

export class FileHandlerAgent {
  name = "FileHandlerAgent";

  constructor() {
    logger.info(`${this.name} initialized`);
  }

  // Save a file
  saveFile(filePath: string, content: string | Buffer) {
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
      logger.log(`[${this.name}] File saved: ${filePath}`);
      return { success: true, path: filePath };
    } catch (err) {
      logger.error(`[${this.name}] Failed to save file:`, err);
      return { success: false, error: err };
    }
  }

  // Read a file
  readFile(filePath: string) {
    try {
      const data = fs.readFileSync(filePath);
      logger.log(`[${this.name}] File read: ${filePath}`);
      return { success: true, data };
    } catch (err) {
      logger.error(`[${this.name}] Failed to read file:`, err);
      return { success: false, error: err };
    }
  }

  // Delete a file
  deleteFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.log(`[${this.name}] File deleted: ${filePath}`);
        return { success: true };
      } else {
        logger.warn(`[${this.name}] File not found: ${filePath}`);
        return { success: false, error: "File not found" };
      }
    } catch (err) {
      logger.error(`[${this.name}] Failed to delete file:`, err);
      return { success: false, error: err };
    }
  }

  async recover(err: any) {
    logger.error(`[${this.name}] Recovering from error:`, err);
  }
}
