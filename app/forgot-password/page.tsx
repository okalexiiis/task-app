"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/Toast";

type ToastType = "success" | "error" | "warning";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const showToast = (message: string, type: ToastType) => {
    setToast(null);
    setTimeout(() => setToast({ message, type }), 50);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Error en el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background text-primary selection:bg-accent/20">
        <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6">
          <header className="text-center space-y-2">
            <h1 className="font-serif text-3xl italic tracking-tight">
              Revisa tu correo
            </h1>
            <p className="font-mono text-sm text-secondary">
              Te hemos enviado un enlace para restablecer tu contraseña
            </p>
          </header>
          <Link
            href="/login"
            className="mt-4 bg-accent text-white font-serif italic py-3 px-8 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-accent/20"
          >
            Volver al inicio de sesión
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
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="font-mono text-sm text-secondary">
            Ingresa tu correo y te enviaremos un enlace para restablecerla
          </p>
        </header>

        <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-accent text-white font-serif italic py-3 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-accent/20 disabled:bg-muted"
          >
            {loading ? "Enviando..." : "Enviar enlace"}
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