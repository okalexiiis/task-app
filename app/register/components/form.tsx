"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const registerSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  email: z.string().email("Debe ser un correo válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export function RegisterForm() {
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setRegisterError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const errorData = await res.json();
      setRegisterError(errorData.message || "Ocurrió un error");
    }
  };

  return (
    <form
      className="flex flex-col gap-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
          ¿Cómo quieres que te llamemos?
        </label>
        <input
          {...register("username")}
          type="text"
          placeholder="tu_usuario"
          className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
        />
        <div className="min-h-[10px] max-h-[10px]">
          {errors.username && (
            <p className="text-accent text-[10px]">{errors.username.message}</p>
          )}
        </div>
      </div>

      {/* Campo Email */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
          Correo electrónico
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="hola@ejemplo.com"
          className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
        />
        <div className="min-h-[10px] max-h-[10px]">
          {errors.email && (
            <p className="text-accent text-[10px]">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Campo Password */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
          Crea una contraseña
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

      {/* Botón de Acción */}
      <button className="mt-6 bg-accent text-white font-serif italic py-3 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-accent/20">
        Crear mi espacio personal
      </button>

      {registerError && (
        <p className="text-accent text-sm text-center mt-2">{registerError}</p>
      )}

      {/* Footer de navegación */}
      <footer className="text-center mt-2">
        <p className="font-mono text-xs text-secondary">
          ¿Ya tienes un rincón aquí?{" "}
          <Link
            href="/login"
            className="text-accent hover:underline decoration-dotted font-bold"
          >
            Inicia sesión
          </Link>
        </p>
      </footer>
    </form>
  );
}

