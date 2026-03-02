import { RegisterForm } from "./components/form";

export default function Page() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background text-primary selection:bg-accent/20">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6">
        {/* Cabecera: El "Hook" emocional */}
        <header className="text-center space-y-2">
          <h1 className="font-serif text-3xl italic tracking-tight">
            Comienza algo nuevo
          </h1>
          <p className="font-mono text-xs text-secondary leading-relaxed">
            crea una cuenta para personalizar <br /> tu espacio en{" "}
            <span className="text-accent font-bold underline decoration-dotted">
              Nidito
            </span>
          </p>
        </header>

        <RegisterForm />
      </div>
    </div>
  );
}
