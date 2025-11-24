export function survivalCheck(engine: any) {
  // Basic health checks for the engine
  return { healthy: true, engine: engine.constructor.name };
}
