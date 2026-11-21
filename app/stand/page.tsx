"use client";
import { useState } from "react";
import Barra from "../barra";

const EVENTO_SLUG = "giro-del-lago-2026";
const DISTANCIAS = ["163 km", "80 km", "Acompañante"];
const SUPLEMENTOS = [
  { valor: "Creatina", nombre: "Creatina", detalle: "Base" },
  { valor: "Pre Workout", nombre: "Pre Workout", detalle: "" },
  { valor: "Rezet", nombre: "Rezet", detalle: "dormir" },
  { valor: "Essential", nombre: "Essential", detalle: "multivitamínico" },
  { valor: "Focus", nombre: "Focus", detalle: "concentración" },
];

export default function Stand() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [salto, setSalto] = useState(false);
  const [suple, setSuple] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    const formulario = e.currentTarget;
    const f = new FormData(formulario);
    const cm = String(f.get("salto_cm") ?? "").replace(",", ".");
    const body = {
      evento_slug: EVENTO_SLUG,
      nombre: f.get("nombre"),
      email: f.get("email"),
      telefono: f.get("telefono"),
      distancia: f.get("distancia") ?? "",
      uso_presoterapia: f.get("uso_presoterapia") === "on",
      uso_plataforma_salto: f.get("uso_plataforma_salto") === "on",
      salto_cm: cm ? Number(cm) : null,
      compro_suplementos: f.get("compro_suplementos") === "on",
      suplementos: f.getAll("suplementos").map(String),
      acepta_terminos: f.get("acepta_terminos") === "on",
      acepta_comunicaciones: f.get("acepta_comunicaciones") === "on",
      website: f.get("website"),
    };
    const res = await fetch("/api/stand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setEstado("ok");
      formulario.reset();
      setSalto(false);
      setSuple(false);
    } else {
      setEstado("error");
      setMsg(data.error ?? "Ocurrió un error.");
    }
  }

  if (estado === "ok")
    return (
      <>
        <Barra />
        <main className="listo">
          <div className="tic" aria-hidden="true">✓</div>
          <h1 className="title">¡Gracias por pasar!</h1>
          <p>Registramos tu visita al stand de Fractale Recovery. Pronto te escribiremos con tus resultados.</p>
          <div className="ctas">
            <button className="btn btn-blue" onClick={() => setEstado("idle")}>Registrar otra persona</button>
            <a className="btn btn-line" href="/">Volver a la portada</a>
          </div>
        </main>
      </>
    );

  return (
    <>
      <Barra />
      <main className="hoja">
        <p className="eyebrow mini">Giro del Lago 2026 · Playa Venado, Puerto Varas</p>
        <h1 className="title">Fractale Recovery.</h1>
        <p className="lead">30 segundos. Cuéntanos qué usaste hoy y te enviamos tus resultados por correo.</p>

        <form className="ficha" onSubmit={onSubmit}>
          <fieldset className="grupo">
            <legend>Tus datos</legend>
            <div className="rejilla">
              <label className="campo ancho"><span>Nombre y apellido <i className="req">*</i></span>
                <input name="nombre" required autoComplete="name" /></label>
              <label className="campo"><span>Correo <i className="req">*</i></span>
                <input name="email" type="email" required autoComplete="email" placeholder="correo@ejemplo.com" /></label>
              <label className="campo"><span>Teléfono</span>
                <input name="telefono" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" /></label>
            </div>
          </fieldset>

          <fieldset className="grupo">
            <legend>¿Qué distancia corriste?</legend>
            <div className="pildoras">
              {DISTANCIAS.map((d) => (
                <label key={d}><input type="radio" name="distancia" value={d} /><span>{d}</span></label>
              ))}
            </div>
          </fieldset>

          <fieldset className="grupo">
            <legend>¿Qué usaste hoy en el stand?</legend>
            <label className="visto-bueno">
              <input type="checkbox" name="uso_presoterapia" />
              <span><b>Presoterapia</b> · botas de compresión Therapress</span>
            </label>
            <label className="visto-bueno">
              <input type="checkbox" name="uso_plataforma_salto" onChange={(e) => setSalto(e.target.checked)} />
              <span><b>Plataforma de salto</b> · Chronojump</span>
            </label>
            {salto && (
              <label className="campo salto-cm"><span>Altura de tu salto (cm)</span>
                <input name="salto_cm" inputMode="decimal" placeholder="32,5" /></label>
            )}
            <label className="visto-bueno">
              <input type="checkbox" name="compro_suplementos" onChange={(e) => setSuple(e.target.checked)} />
              <span><b>Compré suplementos</b> · ForceHuman</span>
            </label>
            {suple && (
              <div className="suple">
                <p>¿Cuáles? Puedes marcar varios.</p>
                <div className="pildoras">
                  {SUPLEMENTOS.map((s) => (
                    <label key={s.valor}><input type="checkbox" name="suplementos" value={s.valor} />
                      <span>{s.nombre}{s.detalle && <small> · {s.detalle}</small>}</span></label>
                  ))}
                </div>
              </div>
            )}
          </fieldset>

          {/* Honeypot: los humanos no lo ven */}
          <input name="website" tabIndex={-1} autoComplete="off" className="oculto" aria-hidden="true" />

          <fieldset className="grupo">
            <legend>Autorizaciones</legend>
            <label className="visto-bueno">
              <input type="checkbox" name="acepta_terminos" required />
              <span>Acepto los <a href="/terminos" target="_blank">términos y la política de privacidad</a>. *</span>
            </label>
            <label className="visto-bueno">
              <input type="checkbox" name="acepta_comunicaciones" />
              <span>Quiero recibir información, beneficios y novedades de FRACTALE y sus marcas aliadas.</span>
            </label>
          </fieldset>

          {estado === "error" && <p className="aviso">{msg}</p>}
          <button className="btn btn-blue btn-ancho" disabled={estado === "enviando"}>
            {estado === "enviando" ? "Enviando…" : "Registrar visita"}
          </button>
          <p className="nota-legal">Los campos marcados con * son obligatorios.</p>
        </form>
      </main>
    </>
  );
}
