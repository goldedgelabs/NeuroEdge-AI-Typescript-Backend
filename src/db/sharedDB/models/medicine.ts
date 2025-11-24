export interface SharedMedicine {
  id: string;
  name: string;
  dosage: string;
  manufacturer: string;
  available: boolean;
  createdAt: number;
  updatedAt?: number;
}

export const SharedMedicineModel: Record<string, SharedMedicine> = {};
