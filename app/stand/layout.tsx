import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fractale Recovery · Giro del Lago 2026",
  description: "Registra tu visita al stand de recovery de FRACTALE en el Giro del Lago: presoterapia, plataforma de salto y suplementos.",
};

export default function LayoutStand({ children }: { children: React.ReactNode }) {
  return children;
}
