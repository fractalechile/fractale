import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { eventoDelStand, eventoPorSlug, fechaLarga, listarEventos } from "@/lib/eventos";

export const dynamic = "force-dynamic";
export const metadata = { title: "Visitas del stand · FRACTALE" };

type Visita = {
  id: string;
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

const SERVICIOS = [
  ["uso_presoterapia", "Presoterapia"],
  ["uso_plataforma_salto", "Salto"],
  ["compro_suplementos", "Compró"],
] as const;

const SUPLEMENTOS = ["Creatina", "Pre Workout", "Rezet", "Essential", "Focus"];

/** Anota el salto de alguien que ya se había registrado. */
async function guardarSalto(datos: FormData) {
  "use server";
  const id = String(datos.get("id"));
  const bruto = String(datos.get("cm") ?? "").replace(",", ".").trim();
  const cm = bruto === "" ? null : Number(bruto);
  if (cm !== null && (Number.isNaN(cm) || cm < 0 || cm > 150)) return;

  await supabaseAdmin
    .from("visitas_stand")
    .update({ salto_cm: cm, ...(cm !== null ? { uso_plataforma_salto: true } : {}) })
    .eq("id", id);
  revalidatePath("/admin/visitas");
}

/** Marca o desmarca un servicio, para quien vuelve al stand más tarde. */
async function alternarServicio(datos: FormData) {
  "use server";
  const id = String(datos.get("id"));
  const campo = String(datos.get("campo"));
  if (!SERVICIOS.some(([c]) => c === campo)) return;
  const puesto = datos.get("valor") === "1";

  // Al desmarcar la compra se vacía la lista, para que no queden suplementos
  // colgando de una compra que ya no existe.
  const cambio: Record<string, unknown> = { [campo]: !puesto };
  if (campo === "compro_suplementos" && puesto) cambio.suplementos = [];

  await supabaseAdmin.from("visitas_stand").update(cambio).eq("id", id);
  revalidatePath("/admin/visitas");
}

/** Agrega o quita un suplemento de la compra. */
async function alternarSuplemento(datos: FormData) {
  "use server";
  const id = String(datos.get("id"));
  const nombre = String(datos.get("nombre"));
  if (!SUPLEMENTOS.includes(nombre)) return;

  const { data: fila } = await supabaseAdmin
    .from("visitas_stand").select("suplementos").eq("id", id).single();
  const actuales: string[] = fila?.suplementos ?? [];
  const lista = actuales.includes(nombre)
    ? actuales.filter((x) => x !== nombre)
    : [...actuales, nombre];

  await supabaseAdmin
    .from("visitas_stand")
    .update({ suplementos: lista, compro_suplementos: lista.length > 0 })
    .eq("id", id);
  revalidatePath("/admin/visitas");
}

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

export default async function PanelVisitas({
  searchParams,
}: { searchParams: Promise<{ evento?: string }> }) {
  const { evento: slug } = await searchParams;
  const eventos = await listarEventos();
  const ev = slug ? await eventoPorSlug(slug) : await eventoDelStand();
  if (!ev)
    return (
      <main className="hoja">
        <h1 className="title">No existe el evento.</h1>
        <p><a className="more" href="/admin/eventos">Ver eventos</a></p>
      </main>
    );

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
      <nav className="eventos-nav" aria-label="Eventos">
        {eventos.map((e) => (
          <a key={e.slug} href={`/admin/visitas?evento=${e.slug}`}
            className={e.slug === ev.slug ? "on" : undefined}>
            {e.nombre}{e.stand_actual ? " · en el stand" : ""}
          </a>
        ))}
        <a href="/admin/eventos" className="gestion">Gestionar eventos</a>
      </nav>

      <header className="panel-top">
        <div>
          <p className="eyebrow mini">{ev.lugar ? `${ev.lugar} · ` : ""}{fechaLarga(ev.fecha)}</p>
          <h1 className="title">{ev.nombre}</h1>
        </div>
        <a className="btn btn-line btn-sm" href={`/api/admin/export-stand?evento=${ev.slug}`}>Descargar CSV</a>
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
                  <div className="marcas">
                    {SERVICIOS.map(([campo, etiqueta]) => {
                      const puesto = Boolean(v[campo]);
                      return (
                        <form action={alternarServicio} key={campo}>
                          <input type="hidden" name="id" value={v.id} />
                          <input type="hidden" name="campo" value={campo} />
                          <input type="hidden" name="valor" value={puesto ? "1" : "0"} />
                          <button className={puesto ? "marca on" : "marca"}>
                            {puesto ? "✓ " : ""}{etiqueta}
                          </button>
                        </form>
                      );
                    })}
                  </div>
                  {v.compro_suplementos && (
                    <div className="marcas suples">
                      {SUPLEMENTOS.map((nombre) => {
                        const puesto = (v.suplementos ?? []).includes(nombre);
                        return (
                          <form action={alternarSuplemento} key={nombre}>
                            <input type="hidden" name="id" value={v.id} />
                            <input type="hidden" name="nombre" value={nombre} />
                            <button className={puesto ? "marca chica on" : "marca chica"}>
                              {puesto ? "✓ " : ""}{nombre}
                            </button>
                          </form>
                        );
                      })}
                    </div>
                  )}
                </td>
                <td>
                  <div className={v.salto_cm != null ? "salto-val puesto" : "salto-val"}>
                    {v.salto_cm != null ? `${v.salto_cm} cm` : "sin anotar"}
                  </div>
                  <form action={guardarSalto} className="salto-edit">
                    <input type="hidden" name="id" value={v.id} />
                    <input key={String(v.salto_cm)} name="cm" defaultValue={v.salto_cm ?? ""}
                      inputMode="decimal" placeholder="cm"
                      aria-label={`Altura de salto de ${v.nombre}`} />
                    <button>Guardar</button>
                  </form>
                </td>
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
