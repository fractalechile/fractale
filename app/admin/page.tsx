import { supabaseAdmin } from "@/lib/supabase-admin";
import { fechaLarga, listarEventos } from "@/lib/eventos";

export const dynamic = "force-dynamic";
export const metadata = { title: "Eventos · Administración FRACTALE" };

const cuantos = async (tabla: string, eventoId: string, campo?: string) => {
  let q = supabaseAdmin.from(tabla).select("id", { count: "exact", head: true }).eq("evento_id", eventoId);
  if (campo) q = q.eq(campo, true);
  return (await q).count ?? 0;
};

export default async function Carpetas() {
  const eventos = await listarEventos();
  const filas = await Promise.all(eventos.map(async (e) => {
    const [visitas, presoterapia, salto, compras, inscritos] = await Promise.all([
      cuantos("visitas_stand", e.id),
      cuantos("visitas_stand", e.id, "uso_presoterapia"),
      cuantos("visitas_stand", e.id, "uso_plataforma_salto"),
      cuantos("visitas_stand", e.id, "compro_suplementos"),
      cuantos("inscritos", e.id),
    ]);
    return { e, visitas, presoterapia, salto, compras, inscritos };
  }));
  const suma = (k: "visitas" | "presoterapia" | "salto" | "compras" | "inscritos") =>
    filas.reduce((total, f) => total + f[k], 0);

  return (
    <main className="panel">
      <header className="panel-top">
        <div>
          <p className="eyebrow mini">Administración FRACTALE</p>
          <h1 className="title">Eventos</h1>
        </div>
        <a className="btn btn-blue btn-sm" href="/admin/eventos">Crear o gestionar</a>
      </header>

      <section className="cifras" style={{ marginTop: 24 }}>
        <div><b>{eventos.length}</b><span>Eventos</span></div>
        <div><b>{suma("visitas")}</b><span>Visitas al stand</span></div>
        <div><b>{suma("presoterapia")}</b><span>Presoterapia</span></div>
        <div><b>{suma("salto")}</b><span>Plataforma de salto</span></div>
        <div><b>{suma("compras")}</b><span>Compraron</span></div>
        <div><b>{suma("inscritos")}</b><span>Inscritos</span></div>
      </section>

      <div className="carpetas">
        {filas.map(({ e, visitas, presoterapia, salto, compras, inscritos }) => (
          <a key={e.id} className={e.stand_actual ? "carpeta actual" : "carpeta"} href={`/admin/visitas?evento=${e.slug}`}>
            <small>{fechaLarga(e.fecha)}{e.stand_actual ? " · En el stand" : ""}</small>
            <h2>{e.nombre}</h2>
            <div className="carpeta-cifras">
              <div><b>{visitas}</b><span>Visitas</span></div>
              <div><b>{presoterapia}</b><span>Presoterapia</span></div>
              <div><b>{salto}</b><span>Salto</span></div>
              <div><b>{compras}</b><span>Compras</span></div>
              <div><b>{inscritos}</b><span>Inscritos</span></div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
