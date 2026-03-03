import { create } from "zustand";
import { User } from "@/entities/User";

interface AuthState {
  user: Omit<User, "password"> | null;
  isAuthenticated: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: Omit<User, "password">) => void;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  initialized: false,

  init: async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isAuthenticated: true, initialized: true });
      } else {
        set({ user: null, isAuthenticated: false, initialized: true });
      }
    } catch {
      set({ user: null, isAuthenticated: false, initialized: true });
    }
  },

  login: async (username, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      set({ user: data.user, isAuthenticated: true, initialized: true });
      return true;
    }
    return false;
  },

  logout: async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    set({ user: null, isAuthenticated: false });
    // Redirigir a login
    window.location.href = "/login";
  },

  updateUser: (user) => {
    set({ user });
  },

  deleteAccount: async () => {
    const { user } = get();
    if (!user) return;

    await fetch(`/api/users/${user.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    set({ user: null, isAuthenticated: false });
    window.location.href = "/login";
  },
}));
