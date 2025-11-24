const edgeStorage: Record<string, Record<string, any>> = {};

export const edgeDB = {
  async get(collection: string, key: string) {
    return edgeStorage[collection]?.[key] ?? null;
  },

  async set(collection: string, key: string, value: any) {
    if (!edgeStorage[collection]) edgeStorage[collection] = {};
    edgeStorage[collection][key] = value;
    return value;
  },

  async delete(collection: string, key: string) {
    if (edgeStorage[collection]) delete edgeStorage[collection][key];
  },

  async getAll(collection: string) {
    return Object.values(edgeStorage[collection] ?? {});
  }
};
