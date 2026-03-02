import { create } from "zustand";
import { Users } from "@/data/users";
import { User } from "@/entities/User";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  initialized: false,

  login: (username, password) => {
    const user = Users.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      set({ user, isAuthenticated: true, initialized: true });
      return true;
    }

    set({ initialized: true });
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
