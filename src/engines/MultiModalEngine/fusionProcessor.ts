// src/engines/MultiModalEngine/fusionProcessor.ts
import { VoiceEngine } from "../VoiceEngine";
import { VisionEngine } from "../VisionEngine";
import { DataEngine } from "../DataEngine";
import { logger } from "../../utils/logger";

const voiceEngine = new VoiceEngine();
const visionEngine = new VisionEngine();
const dataEngine = new DataEngine();

export async function fuseInputs(inputs: {
    text?: string;
    audioBuffer?: Buffer;
    imageBuffer?: Buffer;
    data?: any;
}) {
    const results: any = {};

    if (inputs.audioBuffer) {
        try {
            const speechText = await voiceEngine.speechToText(inputs.audioBuffer);
            results.audioText = speechText.text;
        } catch (err) {
            logger.error("VoiceEngine fusion error:", err);
            results.audioText = null;
        }
    }

    if (inputs.imageBuffer) {
        try {
            const visionResult = await visionEngine.analyzeImage(inputs.imageBuffer);
            results.imageAnalysis = visionResult;
        } catch (err) {
            logger.error("VisionEngine fusion error:", err);
            results.imageAnalysis = null;
        }
    }

    if (inputs.text) {
        results.text = inputs.text;
    }

    if (inputs.data) {
        results.data = await dataEngine.process(inputs.data);
    }

    // Example simple fusion logic
    results.fusedSummary = `${results.text || ""} ${results.audioText || ""} ${results.imageAnalysis?.caption || ""}`;

    return results;
        }
