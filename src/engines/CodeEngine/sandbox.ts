// src/engines/CodeEngine/sandbox.ts
import { logger } from "../../utils/logger";

export function runSandbox(code: string, language: string) {
    // Placeholder sandbox: do not run unsafe code in production
    logger.log(`[Sandbox] Running ${language} code safely`);
    return { stdout: "Executed safely (simulated)", stderr: "" };
}
