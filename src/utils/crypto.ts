// src/utils/crypto.ts
import crypto from "crypto";

export function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function randomToken(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}
