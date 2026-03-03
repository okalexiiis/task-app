// AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    init();
  }, [init]);

  // No renderiza NADA hasta que init() haya terminado
  if (!initialized) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="text-secondary text-sm animate-pulse">
          cargando...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
