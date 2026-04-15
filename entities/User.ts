export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  pfp: string;
  createdAt: string;
  updatedAt: string;
};

export type RegisterUser = Omit<User, "id" | "pfp" | "createdAt" | "updatedAt">;
