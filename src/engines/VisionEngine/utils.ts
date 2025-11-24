// src/engines/VisionEngine/utils.ts

export function isBuffer(input: any) {
    return Buffer.isBuffer(input);
}

export function validateImage(input: any) {
    if (!isBuffer(input) && typeof input !== "string") {
        throw new Error("Invalid image input");
    }
    return true;
}
