// src/engines/MultiModalEngine/utils.ts

export function validateInputs(inputs: any) {
    if (!inputs) throw new Error("No inputs provided for fusion");
    return true;
}
