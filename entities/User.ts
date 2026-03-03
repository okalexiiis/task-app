export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  //color: string;
  //font: string;
  pfp: string;
  createdAt: string;
  updatedAt: string;
};

export type RegisterUser = Omit<
  User,
  "id" | "pfp" | "createdAt" | "updatedAt"
>;

