// src/engines/AgentsEngine/utils.ts
export function validateTask(task: string) {
    if (!task || task.length === 0) throw new Error("Empty task provided");
    return true;
}
