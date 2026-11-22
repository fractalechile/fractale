import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stand Giro del Lago · FRACTALE" };

type Visita = {
  numero: number | null;
  nombre: string;
  email: string;
  telefono: string | null;
  sexo: string | null;
  edad: number | null;
  ciudad: string | null;
  distancia: string | null;
  uso_presoterapia: boolean;
  uso_plataforma_salto: boolean;
  salto_cm: number | null;
  compro_suplementos: boolean;
  suplementos: string[];
  acepta_comunicaciones: boolean;
  created_at: string;
};

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "—");

const hora = (s: string) =>
  new Date(s).toLocaleString("es-CL", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
    timeZone: "America/Santiago",
  });

function cuenta(valores: (string | null)[]) {
  const mapa = new Map<string, number>();
  for (const v of valores) {
    if (!v) continue;
    mapa.set(v, (mapa.get(v) ?? 0) + 1);
  }
  return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function PanelGiro() {
  const { data: ev } = await supabaseAdmin
    .from("eventos").select("id,nombre,fecha,lugar").eq("slug", "giro-del-lago-2026").single();
  if (!ev) return <main className="hoja"><h1 className="title">No existe el evento.</h1></main>;

  const { data } = await supabaseAdmin
    .from("visitas_stand").select("*").eq("evento_id", ev.id)
    .order("numero", { ascending: false }).range(0, 4999);
  const visitas = (data ?? []) as Visita[];
  const total = visitas.length;

  const presoterapia = visitas.filter((v) => v.uso_presoterapia).length;
  const salto = visitas.filter((v) => v.uso_plataforma_salto).length;
  const compras = visitas.filter((v) => v.compro_suplementos).length;
  const correo = visitas.filter((v) => v.acepta_comunicaciones).length;

  const saltos = visitas.map((v) => v.salto_cm).filter((n): n is number => typeof n === "number");
  const saltoMedio = saltos.length ? (saltos.reduce((a, b) => a + b, 0) / saltos.length).toFixed(1) : null;
  const saltoMax = saltos.length ? Math.max(...saltos).toFixed(1) : null;

  const edades = visitas.map((v) => v.edad).filter((n): n is number => typeof n === "number");
  const edadMedia = edades.length ? Math.round(edades.reduce((a, b) => a + b, 0) / edades.length) : null;

  const suplementos = cuenta(visitas.flatMap((v) => v.suplementos ?? []));

  return (
    <main className="panel">
      <header className="panel-top">
        <div>
          <p className="eyebrow mini">{ev.lugar} · {ev.fecha}</p>
          <h1 className="title">{ev.nombre}</h1>
        </div>
        <a className="btn btn-line btn-sm" href="/api/admin/export-stand">Descargar CSV</a>
      </header>

      <section className="cifras">
        <div><b>{total}</b><span>Registros</span></div>
        <div><b>{presoterapia}</b><span>Presoterapia · {pct(presoterapia, total)}</span></div>
        <div><b>{salto}</b><span>Salto · {pct(salto, total)}</span></div>
        <div><b>{compras}</b><span>Compraron · {pct(compras, total)}</span></div>
        <div><b>{correo}</b><span>Autorizan correo · {pct(correo, total)}</span></div>
        <div><b>{saltoMedio ?? "—"}</b><span>Salto medio (cm){saltoMax ? ` · máx ${saltoMax}` : ""}</span></div>
      </section>

      <section className="listas">
        <div>
          <h2>Distancia</h2>
          <ul>{cuenta(visitas.map((v) => v.distancia)).map(([k, n]) => (
            <li key={k}><span>{k}</span><b>{n}</b></li>))}
            {!visitas.length && <li><span>Sin datos todavía</span><b>0</b></li>}
          </ul>
        </div>
        <div>
          <h2>Sexo{edadMedia ? ` · edad media ${edadMedia}` : ""}</h2>
          <ul>{cuenta(visitas.map((v) => v.sexo)).map(([k, n]) => (
            <li key={k}><span>{k}</span><b>{n}</b></li>))}
            {!visitas.length && <li><span>Sin datos todavía</span><b>0</b></li>}
          </ul>
        </div>
        <div>
          <h2>Ciudades</h2>
          <ul>{cuenta(visitas.map((v) => v.ciudad)).slice(0, 8).map(([k, n]) => (
            <li key={k}><span>{k}</span><b>{n}</b></li>))}
            {!visitas.length && <li><span>Sin datos todavía</span><b>0</b></li>}
          </ul>
        </div>
        <div>
          <h2>Suplementos</h2>
          <ul>{suplementos.map(([k, n]) => (<li key={k}><span>{k}</span><b>{n}</b></li>))}
            {!suplementos.length && <li><span>Sin compras todavía</span><b>0</b></li>}
          </ul>
        </div>
      </section>

      <h2 className="tabla-tit">Registros</h2>
      <div className="tabla-marco">
        <table className="tabla">
          <thead>
            <tr>
              <th>#</th><th>Nombre</th><th>Ciudad</th><th>Distancia</th>
              <th>Servicios</th><th>Salto</th><th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {visitas.map((v) => (
              <tr key={`${v.numero}-${v.created_at}`}>
                <td><b>{v.numero ?? "—"}</b></td>
                <td>{v.nombre}<small>{v.email}</small></td>
                <td>{v.ciudad ?? "—"}</td>
                <td>{v.distancia ?? "—"}</td>
                <td>
                  {[
                    v.uso_presoterapia && "Presoterapia",
                    v.uso_plataforma_salto && "Salto",
                    v.compro_suplementos && `Compró${v.suplementos?.length ? `: ${v.suplementos.join(", ")}` : ""}`,
                  ].filter(Boolean).join(" · ") || "—"}
                </td>
                <td>{v.salto_cm != null ? `${v.salto_cm} cm` : "—"}</td>
                <td>{hora(v.created_at)}</td>
              </tr>
            ))}
            {!visitas.length && (
              <tr><td colSpan={7} className="vacio">Todavía no hay registros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
