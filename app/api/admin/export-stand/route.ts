import { supabaseAdmin } from "@/lib/supabase-admin";
import { eventoDelStand, eventoPorSlug } from "@/lib/eventos";

const csv = (v: unknown) =>
  `"${(Array.isArray(v) ? v.join(" | ") : String(v ?? "")).replace(/"/g, '""')}"`;

const COLS = [
  "numero", "nombre", "email", "telefono", "sexo", "edad", "ciudad", "distancia",
  "uso_presoterapia", "uso_plataforma_salto", "salto_cm", "compro_suplementos",
  "suplementos", "acepta_comunicaciones", "created_at",
];

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("evento");
  const ev = slug ? await eventoPorSlug(slug) : await eventoDelStand();
  if (!ev) return new Response("Evento no encontrado", { status: 404 });

  const { data: filas } = await supabaseAdmin
    .from("visitas_stand").select("*").eq("evento_id", ev.id)
    .order("numero", { ascending: true }).range(0, 19999);

  const cuerpo = (filas ?? []).map((f) =>
    COLS.map((c) => csv((f as Record<string, unknown>)[c])).join(",")
  );

  // BOM para que Excel abra bien las tildes
  return new Response("﻿" + [COLS.join(","), ...cuerpo].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${ev.slug}-stand.csv"`,
    },
  });
}
