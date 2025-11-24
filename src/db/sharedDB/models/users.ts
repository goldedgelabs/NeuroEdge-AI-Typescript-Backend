export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "founder";
  createdAt: number;
  updatedAt?: number;
}

export const UsersModel: Record<string, User> = {};
