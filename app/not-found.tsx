import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background text-primary selection:bg-accent/20">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6 text-center">
        <h1 className="font-serif text-9xl italic tracking-tighter text-accent/20">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl italic tracking-tight">
           ups, nada por aquí
          </h2>
          <p className="font-mono text-sm text-secondary">
            La página que buscas no existe o se mudó a otro lugar.
          </p>
        </div>
        <Link
          href="/"
          className="mt-4 bg-accent text-white font-serif italic py-3 px-8 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-accent/20"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}