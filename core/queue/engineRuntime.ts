export class EngineRuntime {
  constructor(engine) {
    this.engine = engine;
  }

  start() {
    this.timer = setInterval(() => {
      if (this.engine.tick) {
        this.engine.tick();
      }
    }, this.engine.tickRate || 100);
  }

  stop() {
    clearInterval(this.timer);
  }
}
