"use client";
import { useState } from "react";
import Barra from "../barra";

const EVENTO_SLUG = "giro-del-lago-2026";
// Mismos datos que la fila sembrada en supabase/migrations/002_giro_del_lago.sql.
const EVENTO = { fecha: "Domingo 22 de noviembre 2026", lugar: "Playa Venado, Puerto Varas" };

const DISTANCIAS = [
  { valor: "163 km", detalle: "Giro completo" },
  { valor: "80 km", detalle: "Medio giro" },
  { valor: "Acompañante", detalle: "Vine a apoyar" },
];
const SEXOS = ["Femenino", "Masculino", "Otro", "Prefiero no decir"];
const SUPLEMENTOS = [
  { valor: "Creatina", nombre: "Creatina", detalle: "base" },
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
  const [numero, setNumero] = useState<number | null>(null);

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
      sexo: f.get("sexo"),
      edad: Number(f.get("edad")),
      ciudad: f.get("ciudad"),
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
      setNumero(typeof data.numero === "number" ? data.numero : null);
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
          <div className="tic-grande" aria-hidden="true">✓</div>
          <h1 className="title">¡Gracias por pasar!</h1>
          {numero !== null && (
            <>
              <p>Este es tu número de registro. Muéstralo en el stand para tu turno.</p>
              <div className="numero">
                <b>{String(numero).padStart(3, "0")}</b>
                <span>Número de registro</span>
              </div>
            </>
          )}
          <p>Registramos tu visita al stand de Fractale Recovery. Pronto te escribiremos con tus resultados.</p>
          <div className="ctas">
            <button className="btn btn-blue" onClick={() => { setEstado("idle"); setNumero(null); }}>
              Registrar otra persona
            </button>
            <a className="btn btn-line" href="/">Volver a la portada</a>
          </div>
        </main>
      </>
    );

  return (
    <>
      <Barra />

      <header className="cabecera">
        <p className="eyebrow">Giro del Lago 2026</p>
        <h1>Fractale Recovery.</h1>
        <p>30 segundos. Cuéntanos qué servicios recibiste hoy y te enviamos tus resultados por correo.</p>
        <div className="datos">
          <span>📅 {EVENTO.fecha}</span>
          <span>📍 {EVENTO.lugar}</span>
        </div>
      </header>

      <main className="hoja-form">
        <form className="tarjeta" onSubmit={onSubmit}>

          <fieldset className="grupo">
            <legend><i>1</i>Tus datos</legend>
            <div className="rejilla">
              <label className="campo ancho"><span>Nombre y apellido <i className="req">*</i></span>
                <input name="nombre" required autoComplete="name" placeholder="Nombre y apellido" /></label>
              <label className="campo"><span>Correo <i className="req">*</i></span>
                <input name="email" type="email" required autoComplete="email" placeholder="correo@ejemplo.com" /></label>
              <label className="campo"><span>Teléfono</span>
                <input name="telefono" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" /></label>
              <label className="campo"><span>Edad <i className="req">*</i></span>
                <input name="edad" type="number" inputMode="numeric" min={5} max={100} required placeholder="35" /></label>
              <label className="campo"><span>¿De qué ciudad vienes? <i className="req">*</i></span>
                <input name="ciudad" required autoComplete="address-level2" placeholder="Puerto Varas" /></label>
            </div>

            <p className="ayuda" style={{ marginTop: 18 }}>Sexo <i className="req">*</i></p>
            <div className="chips">
              {SEXOS.map((s, i) => (
                <label className="chip" key={s}>
                  <input type="radio" name="sexo" value={s} required={i === 0} />
                  <span className="marco">{s}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <hr className="separa" />

          <fieldset className="grupo">
            <legend><i>2</i>Tu carrera</legend>
            <p className="ayuda">¿Qué distancia corriste?</p>
            <div className="opciones">
              {DISTANCIAS.map((d) => (
                <label className="opcion" key={d.valor}>
                  <input type="radio" name="distancia" value={d.valor} />
                  <span className="marco"><b>{d.valor}</b><small>{d.detalle}</small></span>
                </label>
              ))}
            </div>
          </fieldset>

          <hr className="separa" />

          <fieldset className="grupo">
            <legend><i>3</i>Servicios</legend>
            <p className="ayuda">
              ¿Qué servicios quieres recibir o recibiste hoy en el stand?
              Marca todos los que correspondan.
            </p>

            <div className="servicios">
              <label className="servicio">
                <input type="checkbox" name="uso_presoterapia" />
                <span className="marco">
                  <span className="ico" aria-hidden="true">🦵</span>
                  <span className="texto"><b>Presoterapia</b><small>Botas de compresión Therapress.</small></span>
                  <span className="tic" aria-hidden="true">✓</span>
                </span>
              </label>

              <label className="servicio">
                <input type="checkbox" name="uso_plataforma_salto" onChange={(e) => setSalto(e.target.checked)} />
                <span className="marco">
                  <span className="ico" aria-hidden="true">⚡️</span>
                  <span className="texto"><b>Plataforma de salto</b><small>Medición de potencia con Chronojump.</small></span>
                  <span className="tic" aria-hidden="true">✓</span>
                </span>
              </label>
            </div>

            {salto && (
              <div className="anidado">
                <p className="ayuda">¿Cuánto saltaste? Lo anota quien te atendió.</p>
                <label className="campo" style={{ maxWidth: 200 }}><span>Altura en centímetros</span>
                  <input name="salto_cm" inputMode="decimal" placeholder="32,5" autoFocus /></label>
              </div>
            )}

            <div className="servicios" style={{ marginTop: 10 }}>
              <label className="servicio">
                <input type="checkbox" name="compro_suplementos" onChange={(e) => setSuple(e.target.checked)} />
                <span className="marco">
                  <span className="ico" aria-hidden="true">💊</span>
                  <span className="texto"><b>Suplementos ForceHuman</b><small>Compré en el stand.</small></span>
                  <span className="tic" aria-hidden="true">✓</span>
                </span>
              </label>
            </div>

            {suple && (
              <div className="anidado">
                <p className="ayuda">¿Cuáles? Puedes marcar varios.</p>
                <div className="chips">
                  {SUPLEMENTOS.map((s) => (
                    <label className="chip" key={s.valor}>
                      <input type="checkbox" name="suplementos" value={s.valor} />
                      <span className="marco">{s.nombre}{s.detalle && <small> · {s.detalle}</small>}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </fieldset>

          {/* Honeypot: los humanos no lo ven */}
          <input name="website" tabIndex={-1} autoComplete="off" className="oculto" aria-hidden="true" />

          <hr className="separa" />

          <fieldset className="grupo">
            <legend><i>4</i>Autorizaciones</legend>
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
