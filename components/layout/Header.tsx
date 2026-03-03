"use client";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="py-4 px-6 border-b border-muted/50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-mono text-lg font-bold text-accent">
          Nidito
        </Link>
        <nav>
          <ul className="flex items-center gap-4 font-mono text-sm">
            {isAuthenticated ? (
              <>
                <li>
                  <button
                    onClick={() => logout()}
                    className="text-secondary hover:text-accent transition-colors cursor-pointer text-xs"
                  >
                    Salir
                  </button>
                </li>
                <li>
                  <Link href="/profile">
                    <Image
                      src={user?.pfp || "/default-pfp.png"}
                      alt="Foto de perfil"
                      width={36}
                      height={36}
                      className="rounded-full object-cover border-2 border-transparent hover:border-accent transition-colors"
                    />
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-accent transition-colors"
                  >
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="bg-accent text-white px-3 py-1 rounded-full hover:brightness-110 transition-all text-xs"
                  >
                    Crear cuenta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
