import type { Metadata } from "next";
import Barra from "../barra";
import Formulario from "./formulario";
import { eventoDelStand, fechaLarga } from "@/lib/eventos";

// El QR del stand apunta siempre aquí; el evento se elige en /admin/eventos.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const ev = await eventoDelStand();
  return {
    title: ev ? `Fractale Recovery · ${ev.nombre}` : "Fractale Recovery",
    description: "Registra tu visita al stand de recovery de FRACTALE: presoterapia, plataforma de salto y suplementos.",
  };
}

export default async function Stand() {
  const ev = await eventoDelStand();
  if (!ev)
    return (
      <>
        <Barra />
        <main className="listo">
          <h1 className="title">Pronto en un evento cerca tuyo.</h1>
          <p>Hoy el stand de Fractale Recovery no está activo.</p>
          <div className="ctas"><a className="btn btn-line" href="/">Volver a la portada</a></div>
        </main>
      </>
    );

  return (
    <Formulario
      evento={{
        slug: ev.slug,
        nombre: ev.nombre,
        fecha: fechaLarga(ev.fecha),
        lugar: ev.lugar,
        distancias: ev.distancias,
      }}
    />
  );
}
