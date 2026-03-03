"use client";
import { useAuthStore } from "@/store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import Image from "next/image";

const profileSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  email: z.string().email("Debe ser un correo válido"),
  pfp: z.string().url("Debe ser una URL válida").or(z.literal("")),
});

const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export default function ProfilePage() {
  const default_pfp =
    "https://i.pinimg.com/736x/a9/5e/7a/a95e7a415633a614613e757bac4246ed.jpg";

  const { user, logout, updateUser, deleteAccount } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      pfp: user?.pfp || "",
    },
  });

  const pfpInputValue = watch("pfp");
  const [pfpPreview, setPfpPreview] = useState(user?.pfp || default_pfp);

  useEffect(() => {
    try {
      if (pfpInputValue) {
        new URL(pfpInputValue);
        setPfpPreview(pfpInputValue);
      } else {
        setPfpPreview(default_pfp);
      }
    } catch (error) {
      // No actualiza si la URL no es válida
    }
  }, [pfpInputValue, default_pfp]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;
    setServerError(null);

    if (data.pfp) {
      const imageExists = await checkImageExists(data.pfp);
      if (!imageExists) {
        setError("pfp", {
          type: "manual",
          message: "No se pudo cargar la imagen desde esta URL.",
        });
        return;
      }
    }

    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (res.ok) {
      const { user: updatedUserData } = await res.json();
      updateUser(updatedUserData);
    } else {
      const errorData = await res.json();
      setServerError(errorData.message || "Error al actualizar el perfil");
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "¿Estás seguro? Esta acción es irreversible y eliminará tu cuenta permanentemente.",
      )
    ) {
      deleteAccount();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Image
            key={pfpPreview}
            src={pfpPreview}
            alt="Foto de perfil"
            width={90}
            height={90}
            className="rounded-full object-cover"
            onError={() => setPfpPreview(default_pfp)}
          />
          <h1 className="text-xl font-serif italic">{user.username}</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          {/* Campo Username */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
              Nombre de Usuario
            </label>
            <input
              {...register("username")}
              className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
            />
            <div className="min-h-[10px] max-h-[10px]">
              {errors.username && (
                <p className="text-accent text-[10px]">
                  {errors.username.message}
                </p>
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
              className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
            />
            <div className="min-h-[10px] max-h-[10px]">
              {errors.email && (
                <p className="text-accent text-[10px]">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Campo PFP */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
              URL de la foto de perfil
            </label>
            <input
              {...register("pfp")}
              className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent transition-all duration-300 placeholder:text-muted/60"
            />
            <div className="min-h-[10px] max-h-[10px]">
              {errors.pfp && (
                <p className="text-accent text-[10px]">{errors.pfp.message}</p>
              )}
            </div>
          </div>

          {serverError && (
            <p className="text-accent text-sm text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={!isDirty}
            className="mt-6 bg-accent text-white font-serif italic py-3 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-accent/20 disabled:bg-muted disabled:hover:brightness-100 disabled:cursor-not-allowed"
          >
            Guardar Cambios
          </button>
        </form>

        <div className="mt-12 border-t border-muted/50 pt-6">
          <h3 className="text-center font-mono text-xs text-secondary uppercase tracking-widest">
            Zona de Peligro
          </h3>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => logout()}
              className="w-full p-2 bg-transparent border border-secondary text-secondary rounded-full text-sm font-mono hover:bg-secondary/10 transition-colors"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full p-2 bg-transparent border border-accent text-accent rounded-full text-sm font-mono hover:bg-accent/10 transition-colors"
            >
              Eliminar Mi Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
