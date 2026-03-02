"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"),

  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: { username: string; password: string }) => {
    console.log(data);
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

      <button className="mt-4 bg-accent text-white font-serif italic py-3 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-accent/20">
        Entrar a mi espacio
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
