const sharedStorage: Record<string, Record<string, any>> = {};

export const sharedDB = {
  async get(collection: string, key: string) {
    return sharedStorage[collection]?.[key] ?? null;
  },

  async set(collection: string, key: string, value: any) {
    if (!sharedStorage[collection]) sharedStorage[collection] = {};
    sharedStorage[collection][key] = value;
    return value;
  },

  async getAll(collection: string) {
    return Object.values(sharedStorage[collection] ?? {});
  }
};
