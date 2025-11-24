// src/engines/VoiceEngine/utils.ts

export function validateAudioBuffer(buffer: any) {
    if (!Buffer.isBuffer(buffer)) throw new Error("Invalid audio input");
    return true;
}
