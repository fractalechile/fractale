import { supabaseAdmin } from "@/lib/supabase-admin";

export type Distancia = { valor: string; detalle: string };

export type EventoStand = {
  id: string;
  slug: string;
  nombre: string;
  fecha: string; // yyyy-mm-dd
  lugar: string | null;
  activo: boolean;
  stand_actual: boolean;
  distancias: Distancia[];
};

/** Distancias por defecto para un evento que no definió las suyas. */
export const DISTANCIAS_BASE: Distancia[] = [
  { valor: "Participante", detalle: "Corrí o competí" },
  { valor: "Acompañante", detalle: "Vine a apoyar" },
];

// Respaldo solo para un error de lectura; si el evento está cerrado no se usa.
const RESPALDO_SLUG = "giro-del-lago-2026";
const RESPALDO_DISTANCIAS: Distancia[] = [
  { valor: "163 km", detalle: "Giro completo" },
  { valor: "80 km", detalle: "Medio giro" },
  { valor: "Acompañante", detalle: "Vine a apoyar" },
];

function normalizar(fila: Record<string, unknown>): EventoStand {
  const distancias = Array.isArray(fila.distancias) && fila.distancias.length
    ? (fila.distancias as Distancia[])
    : fila.slug === RESPALDO_SLUG ? RESPALDO_DISTANCIAS : DISTANCIAS_BASE;
  return {
    id: String(fila.id),
    slug: String(fila.slug),
    nombre: String(fila.nombre),
    fecha: String(fila.fecha),
    lugar: (fila.lugar as string | null) ?? null,
    activo: Boolean(fila.activo),
    stand_actual: Boolean(fila.stand_actual),
    distancias,
  };
}

/** Todos los eventos, del más reciente al más antiguo. */
export async function listarEventos(): Promise<EventoStand[]> {
  const { data } = await supabaseAdmin
    .from("eventos").select("*").order("fecha", { ascending: false });
  return (data ?? []).map(normalizar);
}

/** Un evento por su slug. */
export async function eventoPorSlug(slug: string): Promise<EventoStand | null> {
  const { data } = await supabaseAdmin.from("eventos").select("*").eq("slug", slug).maybeSingle();
  return data ? normalizar(data) : null;
}

/** El evento que muestra hoy fractalechile.com/stand. */
export async function eventoDelStand(): Promise<EventoStand | null> {
  const { data, error } = await supabaseAdmin
    .from("eventos").select("*").eq("stand_actual", true).eq("activo", true).maybeSingle();
  if (data) return normalizar(data);
  if (!error) return null; // ningún evento abierto: /stand muestra el aviso
  console.warn("eventoDelStand:", error.message);
  const respaldo = await eventoPorSlug(RESPALDO_SLUG);
  return respaldo?.activo ? respaldo : null;
}

/** "Domingo 22 de noviembre 2026" a partir de "2026-11-22". */
export function fechaLarga(fecha: string): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  const t = d.toLocaleDateString("es-CL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).replace(/,/g, "").replace(" de 20", " 20");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** "Giro del Lago 2026" → "giro-del-lago-2026". */
export function aSlug(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
