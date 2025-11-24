// src/engines/MemoryEngine/utils.ts
export function validateString(input: any) {
    if (typeof input !== "string") throw new Error("Memory content must be a string");
    return true;
}

export function ensureUserId(userId: any) {
    if (!userId || typeof userId !== "string") throw new Error("Invalid user ID");
    return true;
}
