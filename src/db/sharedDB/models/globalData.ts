export interface GlobalDataRecord {
  id: string;
  key: string;
  value: any;
  updatedAt: number;
}

export const GlobalDataModel: Record<string, GlobalDataRecord> = {};
