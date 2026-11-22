import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
  evento_slug: z.string().min(1),
  nombre: z.string().trim().min(3).max(120),
  email: z.string().trim().toLowerCase().email(),
  telefono: z.string().trim().max(20).optional().or(z.literal("")),
  sexo: z.enum(["Femenino", "Masculino", "Otro", "Prefiero no decir"]),
  edad: z.number().int().min(5).max(100),
  ciudad: z.string().trim().min(2).max(80),
  distancia: z.enum(["163 km", "80 km", "Acompañante"]).optional().or(z.literal("")),
  uso_presoterapia: z.boolean(),
  uso_plataforma_salto: z.boolean(),
  salto_cm: z.number().min(0).max(150).nullable(),
  compro_suplementos: z.boolean(),
  suplementos: z.array(z.enum(["Creatina", "Pre Workout", "Rezet", "Essential", "Focus"])).max(5).default([]),
  acepta_terminos: z.literal(true),
  acepta_comunicaciones: z.boolean(),
  website: z.string().optional(), // honeypot anti-bots
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los datos del formulario." }, { status: 400 });
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // bot: fingimos éxito

  const { data: evento } = await supabaseAdmin
    .from("eventos").select("id").eq("slug", d.evento_slug).eq("activo", true).single();
  if (!evento) return NextResponse.json({ error: "Evento no disponible." }, { status: 404 });

  const { data: visita, error } = await supabaseAdmin.from("visitas_stand").insert({
    evento_id: evento.id,
    nombre: d.nombre,
    email: d.email,
    telefono: d.telefono || null,
    sexo: d.sexo,
    edad: d.edad,
    ciudad: d.ciudad,
    distancia: d.distancia || null,
    uso_presoterapia: d.uso_presoterapia,
    uso_plataforma_salto: d.uso_plataforma_salto,
    salto_cm: d.uso_plataforma_salto ? d.salto_cm : null,
    compro_suplementos: d.compro_suplementos,
    suplementos: d.compro_suplementos ? d.suplementos : [],
    acepta_terminos: true,
    acepta_comunicaciones: d.acepta_comunicaciones,
  }).select("numero").single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "No pudimos registrar tu visita." }, { status: 500 });
  }
  // El número correlativo le sirve a la persona como número de fila en el stand.
  return NextResponse.json({ ok: true, numero: visita?.numero ?? null });
}
