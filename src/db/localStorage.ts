// src/db/localStorage.ts
import { db } from "./dbManager";

export async function persistToLocal(collection: string, key: string) {
  const record = await db.get(collection, key, "edge");
  if (record) {
    localStorage.setItem(`${collection}:${key}`, JSON.stringify(record));
  }
}

export async function loadFromLocal(collection: string, key: string) {
  const data = localStorage.getItem(`${collection}:${key}`);
  if (data) return JSON.parse(data);
  return null;
}
