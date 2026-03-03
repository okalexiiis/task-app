"use client";
import { loginSchema } from "@/lib/schemas/auth/login";
import { useAuthStore } from "@/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const router = useRouter();
  const [loginErrors, setLoginErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onChangeHandler = () => setLoginErrors(null);

  const onSubmit = async (data: { username: string; password: string }) => {
    setLoading(true);
    setLoginErrors(null);
    try {
      const res = await login(data.username, data.password);
      console.log(res);

      if (!res) {
        setLoginErrors("Credenciales equivocadas.");
        return;
      }

      router.push("/"); // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoginErrors(error?.message || "Error en el servidor");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="flex flex-col gap-6 w-full group font-mono"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
          Usuario
        </label>
        <input
          {...register("username")}
          onChange={onChangeHandler}
          type="text"
          placeholder="tu_nombre"
          className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
        />
        <div className="min-h-[10px] max-h-[10px]">
          {errors.username && (
            <p className="text-accent text-[10px]">{errors.username.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
          Contraseña
        </label>
        <input
          {...register("password")}
          onChange={onChangeHandler}
          type="password"
          placeholder="••••••••"
          className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
        />
        <div className="min-h-[10px] max-h-[10px]">
          {errors.password && (
            <p className="text-accent text-[10px]">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        {" "}
        <div className="min-h-[10px] max-h-[10px]">
          {loginErrors && (
            <p className="text-accent text-[10px]">{loginErrors}</p>
          )}
        </div>
      </div>

      <button
        disabled={loading}
        className="mt-4 bg-accent text-white font-serif italic py-3 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-accent/20"
      >
        {loading ? "Entrando..." : "Entrar a mi espacio"}{" "}
      </button>

      <footer className="text-center mt-2">
        <p className="font-mono text-xs text-secondary">
          ¿Eres nuevo aquí?{" "}
          <Link
            href="/register"
            className="text-accent hover:underline decoration-dotted font-bold"
          >
            Crea una cuenta
          </Link>
        </p>
      </footer>
    </form>
  );
}
