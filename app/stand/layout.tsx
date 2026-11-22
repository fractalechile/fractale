import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fractale Recovery",
  description: "Registra tu visita al stand de recovery de FRACTALE: presoterapia, plataforma de salto y suplementos.",
};

export default function LayoutStand({ children }: { children: React.ReactNode }) {
  return children;
}
