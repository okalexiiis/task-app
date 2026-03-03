import Header from "@/components/layout/Header";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/layout/AuthProvider";

export const metadata: Metadata = {
  title: "nidito",
  description:
    "aplicacion de tareas hecha por alexiiis para mi mujer, pa que se ponga las pilas asi no mas quedo pariente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
