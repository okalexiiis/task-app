import { User } from "@/entities/User";

interface NavBarProps {
  user: Omit<User, "password"> | null;
  children?: React.ReactNode; // Vuelve a aceptar children
}

export default function NavBar({ user, children }: NavBarProps) {
  const today = new Date();
  const dayName = today.toLocaleDateString("es-ES", { weekday: "long" });
  const dateStr = today.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between pt-11 px-4 sm:px-10 pb-6 gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-serif italic text-[13px] text-secondary tracking-[0.04em]">
          {dayName}
        </span>
        <h1 className="text-2xl sm:text-[34px] font-bold leading-none tracking-[-0.025em]">
          Hola,{" "}
          <span className="text-accent">{user?.username || "SIN USUARIO"}</span>
        </h1>
        <p className="text-[10px] font-light text-secondary tracking-[0.14em] uppercase mt-1.5">
          {dateStr}
        </p>
      </div>

      {/* Renderiza el botón que se le pase */}
      <div className="flex items-center justify-center h-fit gap-4">
        {children}
      </div>
    </nav>
  );
}
