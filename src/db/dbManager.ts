import fs from "fs";
import path from "path";
import { publish } from "../core/engineManager";

// Paths
const EDGE_PATH = path.join(__dirname, "edge");
const SHARED_PATH = path.join(__dirname, "shared");

// Ensure folders exist
if (!fs.existsSync(EDGE_PATH)) fs.mkdirSync(EDGE_PATH, { recursive: true });
if (!fs.existsSync(SHARED_PATH)) fs.mkdirSync(SHARED_PATH, { recursive: true });

type DBScope = "edge" | "shared";

export const db = {
  async set(collection: string, key: string, value: any, scope: DBScope = "edge") {
    const filePath = path.join(scope === "edge" ? EDGE_PATH : SHARED_PATH, `${collection}.json`);
    let data: Record<string, any> = {};
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    data[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    // Publish DB event
    publish("db:update", { collection, key, value, target: scope });
  },

  async get(collection: string, key: string, scope: DBScope = "edge") {
    const filePath = path.join(scope === "edge" ? EDGE_PATH : SHARED_PATH, `${collection}.json`);
    if (!fs.existsSync(filePath)) return null;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return data[key] ?? null;
  },

  async delete(collection: string, key: string, scope: DBScope = "edge") {
    const filePath = path.join(scope === "edge" ? EDGE_PATH : SHARED_PATH, `${collection}.json`);
    if (!fs.existsSync(filePath)) return false;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    delete data[key];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    // Publish DB deletion event
    publish("db:delete", { collection, key, target: scope });
    return true;
  },

  async getAll(collection: string, scope: DBScope = "edge") {
    const filePath = path.join(scope === "edge" ? EDGE_PATH : SHARED_PATH, `${collection}.json`);
    if (!fs.existsSync(filePath)) return [];
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return Object.values(data);
  },

  async listCollections(scope: DBScope = "edge") {
    const folderPath = scope === "edge" ? EDGE_PATH : SHARED_PATH;
    return fs.readdirSync(folderPath).map(file => file.replace(".json", ""));
  }
};
