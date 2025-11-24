// src/engines/AgentsEngine/agentOrchestrator.ts
import { PlannerAgent } from "./agents/PlannerAgent";
import { CriticAgent } from "./agents/CriticAgent";
import { WorkerAgent } from "./agents/WorkerAgent";
import { VerifierAgent } from "./agents/VerifierAgent";
import { AIStudentAgent } from "./agents/AIStudentAgent";
import { logger } from "../../utils/logger";

const agents = {
    planner: new PlannerAgent(),
    critic: new CriticAgent(),
    worker: new WorkerAgent(),
    verifier: new VerifierAgent(),
    aiStudent: new AIStudentAgent()
};

export async function orchestrateTask(task: string, context: any) {
    const steps: any[] = [];

    try {
        const plan = agents.planner.run(task);
        steps.push({ agent: "PlannerAgent", output: plan });

        const critique = agents.critic.critique(plan);
        steps.push({ agent: "CriticAgent", output: critique });

        const execution = agents.worker.execute(critique);
        steps.push({ agent: "WorkerAgent", output: execution });

        const verified = agents.verifier.verify(execution);
        steps.push({ agent: "VerifierAgent", output: verified });

        const aiLearning = agents.aiStudent.learn(execution);
        steps.push({ agent: "AIStudentAgent", output: aiLearning });

        return { finalResult: execution, reasoningSteps: steps };
    } catch (err) {
        logger.error("Agent orchestration failed:", err);
        return { finalResult: null, reasoningSteps: steps, error: err };
    }
}
