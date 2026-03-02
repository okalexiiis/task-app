import { LoginForm } from "./components/form";

export default function LoginPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background text-primary selection:bg-accent/20">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6">
        {/* Cabecera con contraste de fuentes */}
        <header className="text-center space-y-2">
          <h1 className="font-serif text-3xl italic tracking-tight">
            Bienvenido de vuelta
          </h1>
          <p className="font-mono text-sm text-secondary">
            comienza a organizar tu día en{" "}
            <span className="text-accent font-bold underline decoration-dotted">
              Nidito
            </span>
          </p>
        </header>

        <LoginForm />
      </div>
    </div>
  );
}
