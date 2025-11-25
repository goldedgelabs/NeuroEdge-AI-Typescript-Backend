// src/utils/id.ts
export function generateId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
}
