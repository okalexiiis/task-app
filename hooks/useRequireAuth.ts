"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

// Úsalo en cualquier página protegida en lugar de repetir la lógica
export function useRequireAuth() {
  const { isAuthenticated, initialized, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [initialized, isAuthenticated, router]);

  return { user, initialized, isAuthenticated };
}
