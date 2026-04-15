"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/Toast";
import { z } from "zod";

type ToastType = "success" | "error" | "warning";

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres");

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(
    null
  );
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setValidToken(false);
    } else {
      setValidToken(true);
    }
  }, [token]);

  const showToast = (message: string, type: ToastType) => {
    setToast(null);
    setTimeout(() => setToast({ message, type }), 50);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordResult = passwordSchema.safeParse(newPassword);
    if (!passwordResult.success) {
      showToast("La contraseña debe tener al menos 8 caracteres", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?reset=success");
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Error en el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  if (validToken === null) {
    return null;
  }

  if (validToken === false) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background text-primary selection:bg-accent/20">
        <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6 text-center">
          <h1 className="font-serif text-3xl italic tracking-tight">
            Enlace inválido
          </h1>
          <p className="font-mono text-sm text-secondary">
            Este enlace de recuperación no es válido o ha expirado
          </p>
          <Link
            href="/forgot-password"
            className="mt-4 bg-accent text-white font-serif italic py-3 px-8 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-accent/20"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background text-primary selection:bg-accent/20">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6">
        <header className="text-center space-y-2">
          <h1 className="font-serif text-3xl italic tracking-tight">
            Nueva contraseña
          </h1>
          <p className="font-mono text-sm text-secondary">
            Ingresa tu nueva contraseña
          </p>
        </header>

        <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-accent text-white font-serif italic py-3 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-accent/20 disabled:bg-muted"
          >
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>

          <div className="text-center mt-2">
            <Link
              href="/login"
              className="font-mono text-xs text-secondary hover:text-accent transition-colors"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}