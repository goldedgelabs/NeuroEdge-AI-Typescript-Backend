import { logger } from "../utils/logger";

export class SharedDB {
  private collections: Record<string, Record<string, any>> = {};

  public get(collection: string, key?: string) {
    if (!this.collections[collection]) return null;
    if (key) return this.collections[collection][key] ?? null;
    return this.collections[collection];
  }

  public set(collection: string, key: string, value: any) {
    if (!this.collections[collection]) this.collections[collection] = {};
    this.collections[collection][key] = value;
    logger.info(`SharedDB: set ${collection}.${key}`);
  }

  public bulkInsert(data: Record<string, any>) {
    Object.keys(data).forEach((collection) => {
      if (!this.collections[collection]) this.collections[collection] = {};
      Object.assign(this.collections[collection], data[collection]);
    });
    logger.info("SharedDB: bulk insert complete");
  }
}

export const sharedDB = new SharedDB();
