import Image from "next/image";
import Link from "next/link";
import { User } from "@/entities/User";

interface NavBarProps {
  user: User;
}

export default function NavBar({ user }: NavBarProps) {
  const today = new Date();
  const dayName = today.toLocaleDateString("es-ES", { weekday: "long" });
  const dateStr = today.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <nav className="flex items-end justify-between pt-11 px-10 pb-6">
      <div className="flex flex-col gap-1">
        <span className="font-serif italic text-[13px] text-secondary tracking-[0.04em]">
          {dayName}
        </span>
        <h1 className="font-serif text-[34px] font-bold leading-none tracking-[-0.025em]">
          Hola, <span className="text-accent">{user.username}</span>
        </h1>
        <p className="text-[10px] font-light text-secondary tracking-[0.14em] uppercase mt-1.5">
          {dateStr}
        </p>
      </div>

      <Link
        href="/profile"
        className="block w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-primary relative shrink-0 transition-all duration-200 hover:rotate-3 hover:scale-105 hover:shadow-custom"
      >
        <Image
          src={user.pfp}
          alt={`${user.username} profile picture`}
          fill
          className="object-cover"
        />
      </Link>
    </nav>
  );
}
