import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { aSlug, fechaLarga, listarEventos, type Distancia } from "@/lib/eventos";

export const dynamic = "force-dynamic";
export const metadata = { title: "Eventos · FRACTALE" };

/** "163 km | Giro completo" por línea → [{ valor, detalle }]. */
function leerDistancias(texto: string): Distancia[] {
  return texto.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 8).map((l) => {
    const [valor, ...resto] = l.split("|");
    return { valor: valor.trim().slice(0, 40), detalle: resto.join("|").trim().slice(0, 40) };
  }).filter((d) => d.valor);
}

/** Crea un evento nuevo. Si se marca, pasa a ser el del stand. */
async function crearEvento(datos: FormData) {
  "use server";
  const nombre = String(datos.get("nombre") ?? "").trim();
  const fecha = String(datos.get("fecha") ?? "");
  const lugar = String(datos.get("lugar") ?? "").trim() || null;
  if (nombre.length < 3 || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return;

  const anio = fecha.slice(0, 4);
  const slug = aSlug(nombre.includes(anio) ? nombre : `${nombre} ${anio}`);
  const distancias = leerDistancias(String(datos.get("distancias") ?? ""));
  const { data, error } = await supabaseAdmin.from("eventos").insert({
    slug, nombre, fecha, lugar, activo: true,
    distancias: distancias.length ? distancias : null,
  }).select("id").single();
  if (error || !data) {
    console.error(error);
    redirect("/admin/eventos?error=" + encodeURIComponent(
      error?.code === "23505" ? "Ya existe un evento con ese nombre." : "No se pudo crear el evento."));
  }
  if (datos.get("al_stand") === "on") await marcarComoActual(data.id);
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

async function marcarComoActual(id: string) {
  // Solo puede haber uno: primero se desmarca el anterior.
  await supabaseAdmin.from("eventos").update({ stand_actual: false }).eq("stand_actual", true);
  await supabaseAdmin.from("eventos").update({ stand_actual: true, activo: true }).eq("id", id);
}

async function llevarAlStand(datos: FormData) {
  "use server";
  await marcarComoActual(String(datos.get("id")));
  revalidatePath("/admin/eventos");
  revalidatePath("/stand");
}

async function alternarActivo(datos: FormData) {
  "use server";
  const activo = datos.get("activo") === "1";
  await supabaseAdmin.from("eventos")
    .update(activo ? { activo: false, stand_actual: false } : { activo: true })
    .eq("id", String(datos.get("id")));
  revalidatePath("/admin/eventos");
  revalidatePath("/stand");
}

export default async function Eventos({
  searchParams,
}: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const eventos = await listarEventos();

  // Cantidad de visitas por evento.
  const conteos = new Map<string, number>();
  await Promise.all(eventos.map(async (e) => {
    const { count } = await supabaseAdmin.from("visitas_stand")
      .select("id", { count: "exact", head: true }).eq("evento_id", e.id);
    conteos.set(e.id, count ?? 0);
  }));

  return (
    <main className="panel">
      <header className="panel-top">
        <div>
          <p className="eyebrow mini">Stand de Fractale Recovery</p>
          <h1 className="title">Eventos</h1>
        </div>
        <a className="btn btn-line btn-sm" href="/admin">← Carpetas</a>
      </header>

      <p className="ayuda-panel">
        El QR del stand apunta siempre a <b>fractalechile.com/stand</b>. Esa página muestra el
        evento marcado como <b>En el stand</b>. Cada visita se guarda en su evento.
      </p>

      <div className="tabla-marco">
        <table className="tabla">
          <thead>
            <tr><th>Evento</th><th>Fecha</th><th>Distancias</th><th>Visitas</th><th>Stand</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {eventos.map((e) => (
              <tr key={e.id}>
                <td><a className="more" href={`/admin/visitas?evento=${e.slug}`}>{e.nombre}</a>
                  <small>{e.lugar ?? ""}</small></td>
                <td>{fechaLarga(e.fecha)}</td>
                <td>{e.distancias.map((d) => d.valor).join(" · ")}</td>
                <td><b>{conteos.get(e.id) ?? 0}</b></td>
                <td>
                  {e.stand_actual ? <span className="marca on">✓ En el stand</span> : (
                    <form action={llevarAlStand}>
                      <input type="hidden" name="id" value={e.id} />
                      <button className="marca">Llevar al stand</button>
                    </form>
                  )}
                </td>
                <td>
                  <form action={alternarActivo}>
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="activo" value={e.activo ? "1" : "0"} />
                    <button className={e.activo ? "marca on" : "marca"}>{e.activo ? "Activo" : "Cerrado"}</button>
                  </form>
                </td>
              </tr>
            ))}
            {!eventos.length && <tr><td colSpan={6} className="vacio">Todavía no hay eventos.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="tabla-tit">Nuevo evento</h2>
      {error && <p className="aviso">{error}</p>}
      <form action={crearEvento} className="ficha nuevo-evento">
        <div className="rejilla">
          <label className="campo ancho"><span>Nombre del evento *</span>
            <input name="nombre" required minLength={3} placeholder="Media Maratón Ruta de los Ulmos" /></label>
          <label className="campo"><span>Fecha *</span>
            <input name="fecha" type="date" required /></label>
          <label className="campo"><span>Lugar</span>
            <input name="lugar" placeholder="Los Lagos, Chile" /></label>
          <label className="campo ancho"><span>Distancias (una por línea: valor | detalle)</span>
            <textarea name="distancias" rows={4}
              placeholder={"21K | Media maratón\n10K | Recreativa\nAcompañante | Vine a apoyar"} /></label>
        </div>
        <label className="visto-bueno">
          <input type="checkbox" name="al_stand" defaultChecked />
          <span>Mostrarlo ahora en <b>fractalechile.com/stand</b></span>
        </label>
        <button className="btn btn-blue">Crear evento</button>
      </form>
    </main>
  );
}
