export interface UserData {
  id: string;
  name: string;
  email: string;
  preferences?: Record<string, any>;
  createdAt: number;
  updatedAt?: number;
}

export const UserDataModel: Record<string, UserData> = {};
