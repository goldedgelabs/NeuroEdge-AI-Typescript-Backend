// src/engines/DataEngine/utils.ts
export function isString(input: any) {
    return typeof input === "string";
}

export function validateContent(input: any) {
    if (!isString(input)) throw new Error("Invalid content");
    return true;
}
