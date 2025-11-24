import { EngineManager } from "../engines/engineManager";

class EQ {
  private processing = false;
  private tasks = [];

  add(task) {
    this.tasks.push(task);
  }

  async run() {
    if (this.processing) return;
    this.processing = true;

    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      const engine = EngineManager.get(task.engineId);

      if (engine?.onTask) {
        await engine.onTask(task);
      }
    }

    this.processing = false;
  }
}

export const EngineQueue = new EQ();

setInterval(() => EngineQueue.run(), 30);
