/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Toast from "@/components/Toast";
import { useAuthStore } from "@/store/auth.store";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";

type ToastType = "success" | "error" | "warning";

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
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast(null);
    setTimeout(() => setToast({ message, type }), 50);
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  const {
    register,
    handleSubmit,
    control,
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

  const pfpInputValue = useWatch({ control, name: "pfp" });
  const [hasPfpLoadError, setHasPfpLoadError] = useState(false);

  const pfpUrl = useMemo(() => {
    if (!pfpInputValue) return user?.pfp || default_pfp;
    try {
      new URL(pfpInputValue);
      return pfpInputValue;
    } catch {
      return default_pfp;
    }
  }, [pfpInputValue, user?.pfp, default_pfp]);

  const prevPfpUrlRef = useRef(pfpUrl);
  if (prevPfpUrlRef.current !== pfpUrl) {
    prevPfpUrlRef.current = pfpUrl;
    if (hasPfpLoadError) setHasPfpLoadError(false);
  }

  // Resetea el estado de error si la URL cambia
  const imageSrc = hasPfpLoadError ? default_pfp : pfpUrl;

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;

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
      showToast("¡Perfil actualizado con éxito!", "success");
    } else {
      const errorData = await res.json();
      showToast(errorData.message || "Error al actualizar el perfil", "error");
    }
  };

  const handleConfirmDelete = () => {
    deleteAccount();
    setDeleteModalOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Image
            key={imageSrc}
            src={imageSrc}
            alt="Foto de perfil"
            width={90}
            height={90}
            className="rounded-full object-cover"
            onError={() => setHasPfpLoadError(true)}
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
              className="w-full p-2 bg-transparent border border-secondary text-secondary rounded-full text-sm font-mono hover:bg-secondary/10 transition-colors cursor-pointer"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="w-full p-2 bg-transparent border border-accent text-accent rounded-full text-sm font-mono hover:bg-accent/10 transition-colors cursor-pointer"
            >
              Eliminar Mi Cuenta
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <div>
          <p className="text-secondary mb-6">
            ¿Estás seguro? Esta acción es irreversible y eliminará tu cuenta
            permanentemente.
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-transparent border border-secondary text-secondary rounded-full text-sm font-mono hover:bg-secondary/10 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-accent border border-accent text-white rounded-full text-sm font-mono hover:brightness-110 transition-all cursor-pointer"
            >
              Eliminar Permanentemente
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
