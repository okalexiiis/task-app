export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  pfp: string;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RegisterUser = Omit<User, "id" | "pfp" | "resetToken" | "resetTokenExpiry" | "createdAt" | "updatedAt">;
