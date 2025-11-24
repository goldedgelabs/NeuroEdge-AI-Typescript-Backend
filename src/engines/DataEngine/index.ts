import { EngineBase } from "../EngineBase";

export class DataEngine extends EngineBase {
  constructor() {
    super("DataEngine");
  }

  async run(input: any) {
    console.log(`[DataEngine] Processing data:`, input);

    // Example: normalize, validate, or enrich data
    const normalizedData = input?.data?.map((item: any) => ({
      ...item,
      processedAt: new Date().toISOString(),
    })) || [];

    return {
      originalCount: input?.data?.length || 0,
      normalizedCount: normalizedData.length,
      normalizedData,
    };
  }

  async handleDBUpdate(event: any) {
    console.log(`[DataEngine] DB Update event:`, event);
    // Optional: react to changes in shared DB
  }

  async handleDBDelete(event: any) {
    console.log(`[DataEngine] DB Delete event:`, event);
    // Optional: cleanup caches
  }
}
