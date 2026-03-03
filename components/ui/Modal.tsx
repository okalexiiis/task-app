"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Evita el scroll del fondo
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isMounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      // Backdrop
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in"
    >
      <div
        // Contenedor del Modal
        onClick={(e) => e.stopPropagation()}
        className={twMerge(
          "bg-background rounded-lg shadow-xl w-full max-w-md m-4 animate-slide-up",
          className,
        )}
      >
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-4 border-b border-muted">
          {title && (
            <h2 className="text-lg font-serif italic text-primary">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="text-secondary hover:text-accent transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")!,
  );
}
