"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";

type ToastProps = {
  message: string;
  type: "success" | "error" | "warning";
  duration?: number;
  onClose: () => void;
};

export default function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Component mounts, start fade-in
    const fadeInTimer = setTimeout(() => setIsVisible(true), 50);

    // Start fade-out before unmounting
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
      // Unmount after fade-out animation
      const unmountTimer = setTimeout(onClose, 300);
      return () => clearTimeout(unmountTimer);
    }, duration);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [duration, onClose]);

  const baseClasses =
    "fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md text-white transition-all duration-300 ease-out-quad border-2 font-semibold shadow-custom";

  // Using theme colors from globals.css
  const typeClasses = {
    success: "bg-primary border-primary text-[var(--background)]",
    error: "bg-accent border-accent text-white",
    warning: "bg-secondary border-secondary text-primary",
  };

  const toastClasses = clsx(baseClasses, typeClasses[type], {
    "opacity-100 translate-y-0": isVisible,
    "opacity-0 translate-y-4": !isVisible,
  });

  return <div className={toastClasses}>{message}</div>;
}
