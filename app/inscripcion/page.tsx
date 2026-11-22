"use client";
import { useState } from "react";
import Barra from "../barra";

const EVENTO_SLUG = "media-maraton-los-ulmos";
// Mismos datos que la fila sembrada en supabase/migrations/001_inscripciones.sql.
const EVENTO = { fecha: "18 de abril de 2027", lugar: "Los Lagos, Chile" };

const CATEGORIAS = [
  { valor: "21K", detalle: "Media maratón" },
  { valor: "10K", detalle: "Diez kilómetros" },
  { valor: "5K", detalle: "Cinco kilómetros" },
];
const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Inscripcion() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    // /inscripcion?origen=stand → para registrar a alguien en tablet desde el stand
    const origen = new URLSearchParams(window.location.search).get("origen") === "stand" ? "stand" : "web";
    const formulario = e.currentTarget;
    const f = new FormData(formulario);
    const body = {
      evento_slug: EVENTO_SLUG,
      origen,
      nombre: f.get("nombre"),
      rut: f.get("rut"),
      email: f.get("email"),
      telefono: f.get("telefono"),
      fecha_nacimiento: f.get("fecha_nacimiento"),
      genero: f.get("genero"),
      categoria: f.get("categoria"),
      talla_polera: f.get("talla_polera"),
      ciudad: f.get("ciudad"),
      club: f.get("club"),
      contacto_emergencia: f.get("contacto_emergencia"),
      acepta_terminos: f.get("acepta_terminos") === "on",
      acepta_comunicaciones: f.get("acepta_comunicaciones") === "on",
      website: f.get("website"),
    };
    const res = await fetch("/api/inscripcion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setEstado("ok");
      formulario.reset();
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
          <div className="tic-grande" aria-hidden="true">✓</div>
          <h1 className="title">¡Inscripción lista!</h1>
          <p>Te enviamos un correo con tu código QR. Guárdalo: lo necesitarás para retirar tu kit y en el stand.</p>
          <div className="ctas"><a className="btn btn-line" href="/">Volver a la portada</a></div>
        </main>
      </>
    );

  return (
    <>
      <Barra />

      <header className="cabecera corredores">
        <p className="eyebrow">Media Maratón Internacional</p>
        <h1>Ruta de los Ulmos.</h1>
        <p>Corre con el respaldo de todo el equipo de FRACTALE: antes, durante y después de la meta.</p>
        <div className="datos">
          <span>📅 {EVENTO.fecha}</span>
          <span>📍 {EVENTO.lugar}</span>
          <span>🏁 21K · 10K · 5K</span>
        </div>
      </header>

      <main className="hoja-form">
        <form className="tarjeta" onSubmit={onSubmit}>

          <fieldset className="grupo">
            <legend><i>1</i>Tus datos</legend>
            <div className="rejilla">
              <label className="campo ancho"><span>Nombre completo <i className="req">*</i></span>
                <input name="nombre" required autoComplete="name" placeholder="Nombre y apellidos" /></label>
              <label className="campo"><span>RUT</span>
                <input name="rut" placeholder="12.345.678-9" /></label>
              <label className="campo"><span>Fecha de nacimiento</span>
                <input name="fecha_nacimiento" type="date" /></label>
              <label className="campo"><span>Correo <i className="req">*</i></span>
                <input name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" /></label>
              <label className="campo"><span>Teléfono</span>
                <input name="telefono" type="tel" autoComplete="tel" placeholder="+56 9 ..." /></label>
              <label className="campo"><span>Género</span>
                <select name="genero" defaultValue="">
                  <option value="">—</option>
                  <option>Femenino</option><option>Masculino</option><option>Otro</option>
                </select></label>
              <label className="campo"><span>Ciudad</span>
                <input name="ciudad" placeholder="Puerto Montt" /></label>
            </div>
          </fieldset>

          <hr className="separa" />

          <fieldset className="grupo">
            <legend><i>2</i>Tu carrera</legend>
            <div className="opciones">
              {CATEGORIAS.map((c, i) => (
                <label className="opcion" key={c.valor}>
                  <input type="radio" name="categoria" value={c.valor} required={i === 0} />
                  <span className="marco"><b>{c.valor}</b><small>{c.detalle}</small></span>
                </label>
              ))}
            </div>

            <p className="ayuda" style={{ marginTop: 22 }}>Talla de polera</p>
            <div className="chips">
              {TALLAS.map((t) => (
                <label className="chip" key={t}>
                  <input type="radio" name="talla_polera" value={t} />
                  <span className="marco">{t}</span>
                </label>
              ))}
            </div>

            <div className="rejilla" style={{ marginTop: 22 }}>
              <label className="campo ancho"><span>Club o equipo</span>
                <input name="club" placeholder="Si corres con uno" /></label>
              <label className="campo ancho"><span>Contacto de emergencia (nombre y teléfono)</span>
                <input name="contacto_emergencia" /></label>
            </div>
          </fieldset>


          {/* Honeypot: los humanos no lo ven */}
          <input name="website" tabIndex={-1} autoComplete="off" className="oculto" aria-hidden="true" />

          <hr className="separa" />

          <fieldset className="grupo">
            <legend><i>3</i>Autorizaciones</legend>
            <label className="visto-bueno">
              <input type="checkbox" name="acepta_terminos" required />
              <span>Acepto los <a href="/terminos" target="_blank">términos y condiciones</a> del evento. *</span>
            </label>
            <label className="visto-bueno">
              <input type="checkbox" name="acepta_comunicaciones" required />
              <span>
                Autorizo que mi correo electrónico sea usado por FRACTALE Sport Management y por las marcas
                auspiciadoras del evento para enviarme información, beneficios y novedades. Puedo darme de baja
                en cualquier momento. *
              </span>
            </label>
          </fieldset>

          {estado === "error" && <p className="aviso">{msg}</p>}
          <button className="btn btn-blue btn-ancho" disabled={estado === "enviando"}>
            {estado === "enviando" ? "Enviando…" : "Inscribirme"}
          </button>
          <p className="nota-legal">
            Tus datos se tratan conforme a nuestra <a href="/terminos">política de privacidad</a>.
            Los campos marcados con * son obligatorios.
          </p>
        </form>
      </main>
    </>
  );
}
