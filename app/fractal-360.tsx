"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const AREAS = [
  {
    titulo: "Seguimiento nutricional",
    items: ["Antropometría ISAK 2 mensual", "Plan de nutrición a medida", "Control de composición corporal"],
    centro: "Patagonia Medical",
  },
  {
    titulo: "Seguimiento físico",
    items: ["2 sesiones semanales", "Evaluación física cada 2–3 meses", "Kinesiólogos deportivos"],
    centro: "FTHAUS",
  },
  {
    titulo: "Seguimiento médico",
    items: ["Control médico semestral", "Telemedicina deportiva", "Laboratorio preferente"],
    centro: "Patagonia Medical",
  },
  {
    titulo: "Red de marcas",
    items: ["Under Armour", "Winkler Nutrition", "Activaciones Red Bull"],
    centro: null,
  },
];

type P = { x: number; y: number };
type Seg = { a: P; b: P; d: number };
type Arbol = { segs: Seg[]; puntas: P[]; nodos: P[]; rutas: P[][] };

// ---------- copo fractal de fondo (coordenadas -150..150, cubre todo el panel) ----------
function copo() {
  const out: Seg[] = [];
  const r = (x: number, y: number, a: number, len: number, d: number) => {
    if (d > 4) return;
    const b = { x: x + Math.cos(a) * len, y: y + Math.sin(a) * len };
    out.push({ a: { x, y }, b, d });
    r(b.x, b.y, a, len * 0.56, d + 1);
    r(b.x, b.y, a - 1.05, len * 0.48, d + 1);
    r(b.x, b.y, a + 1.05, len * 0.48, d + 1);
  };
  for (let k = 0; k < 6; k++) r(0, 0, (k * Math.PI) / 3 + Math.PI / 6, 66, 0);
  return out;
}
const COPO = copo();
const f = (n: number) => n.toFixed(1);

// ---------- ramas fractales hacia cada recuadro ----------
const lerp = (a: P, b: P, k: number): P => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
const centroide = (ps: P[]): P => ({ x: ps.reduce((s, p) => s + p.x, 0) / ps.length, y: ps.reduce((s, p) => s + p.y, 0) / ps.length });

/** Ramita decorativa que se divide en dos, como un helecho. */
function ramita(t: Arbol, p: P, ang: number, len: number, d: number, prof: number) {
  if (prof <= 0 || len < 4) return;
  const b = { x: p.x + Math.cos(ang) * len, y: p.y + Math.sin(ang) * len };
  t.segs.push({ a: p, b, d });
  if (prof === 1) t.puntas.push(b);
  ramita(t, b, ang - 0.6, len * 0.62, d + 1, prof - 1);
  ramita(t, b, ang + 0.6, len * 0.62, d + 1, prof - 1);
}

/** Árbol binario: el tronco se divide hasta terminar en cada punto del borde del recuadro. */
function dividir(t: Arbol, desde: P, hojas: P[], d: number, cadena: P[], adornos: boolean) {
  if (hojas.length === 1) {
    t.segs.push({ a: desde, b: hojas[0], d });
    t.rutas.push([...cadena, desde, hojas[0]]);
    return;
  }
  const s = lerp(desde, centroide(hojas), d === 0 ? 0.55 : 0.5);
  t.segs.push({ a: desde, b: s, d });
  t.nodos.push(s);
  if (adornos) {
    const ang = Math.atan2(s.y - desde.y, s.x - desde.x);
    const len = Math.min(32, Math.hypot(s.x - desde.x, s.y - desde.y) * 0.3);
    ramita(t, s, ang - 1.2, len, d + 1, 2);
    ramita(t, s, ang + 1.2, len, d + 1, 2);
  }
  const m = hojas.length / 2;
  dividir(t, s, hojas.slice(0, m), d + 1, [...cadena, desde], adornos);
  dividir(t, s, hojas.slice(m), d + 1, [...cadena, desde], adornos);
}

type Caja = { x: number; y: number; w: number; h: number };
type Geo = { w: number; h: number; c: P; fondo: number; arboles: Arbol[]; red: P[] };

function geometria(cont: HTMLElement, nucleo: HTMLElement, cajas: HTMLElement[]): Geo {
  const W = cont.offsetWidth, H = cont.offsetHeight;
  const C = { x: nucleo.offsetLeft + nucleo.offsetWidth / 2, y: nucleo.offsetTop + nucleo.offsetHeight / 2 };
  const R0 = Math.min(nucleo.offsetWidth, nucleo.offsetHeight) * 0.3;
  const rects: Caja[] = cajas.map((c) => ({ x: c.offsetLeft, y: c.offsetTop, w: c.offsetWidth, h: c.offsetHeight }));
  // el copo de fondo debe alcanzar la esquina más lejana del panel
  const lejos = Math.max(Math.hypot(C.x, C.y), Math.hypot(W - C.x, C.y), Math.hypot(C.x, H - C.y), Math.hypot(W - C.x, H - C.y));
  const fondo = (lejos / 142) * 300 * 1.05;

  const arboles = rects.map((r) => {
    const t: Arbol = { segs: [], puntas: [], nodos: [], rutas: [] };
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2, dx = C.x - cx, dy = C.y - cy;
    const T = [0.18, 0.39, 0.61, 0.82];
    const hojas = Math.abs(dx) / (r.w / 2) > Math.abs(dy) / (r.h / 2)
      ? T.map((k) => ({ x: dx > 0 ? r.x + r.w : r.x, y: r.y + r.h * k }))
      : T.map((k) => ({ x: r.x + r.w * k, y: dy > 0 ? r.y + r.h : r.y }));
    const cen = centroide(hojas), L = Math.hypot(cen.x - C.x, cen.y - C.y);
    const inicio = { x: C.x + ((cen.x - C.x) / L) * R0, y: C.y + ((cen.y - C.y) / L) * R0 };
    dividir(t, inicio, hojas, 0, [C], true);
    return t;
  });
  // red: une los primeros nudos de cada árbol en anillo (0 → 1 → 3 → 2)
  const red = [0, 1, 3, 2].map((i) => arboles[i].nodos[0]).filter(Boolean);
  return { w: W, h: H, c: C, fondo, arboles, red };
}

const ruta = (ps: P[]) => "M" + ps.map((p) => `${f(p.x)} ${f(p.y)}`).join(" L");

export default function Fractal360() {
  const ref = useRef<HTMLDivElement>(null);
  const nucleoRef = useRef<HTMLDivElement>(null);
  const cajasRef = useRef<(HTMLElement | null)[]>([]);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [abierto, setAbierto] = useState<number | null>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const activo = hover ?? abierto;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = ref.current, n = nucleoRef.current;
    if (!el || !n) return;
    const medir = () => {
      const cajas = cajasRef.current.filter(Boolean) as HTMLElement[];
      if (cajas.length === 4) setGeo(geometria(el, n, cajas));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    cajasRef.current.forEach((c) => c && ro.observe(c));
    return () => ro.disconnect();
  }, []);

  const clases = "f360" + (visible ? " visible" : "") + (activo !== null ? " hay-activo" : "");

  return (
    <div ref={ref} className={clases}>
      {geo && (
        <div className="f360-fondo" aria-hidden="true"
          style={{ width: geo.fondo, height: geo.fondo, left: geo.c.x - geo.fondo / 2, top: geo.c.y - geo.fondo / 2 }}>
          <svg viewBox="-150 -150 300 300">
            {COPO.map((b, i) => (
              <line key={i} className={`fr d${b.d}`} vectorEffect="non-scaling-stroke"
                x1={f(b.a.x)} y1={f(b.a.y)} x2={f(b.b.x)} y2={f(b.b.y)} />
            ))}
            {COPO.filter((b) => b.d >= 3).map((b, i) => (
              <circle key={i} className="fp" cx={f(b.b.x)} cy={f(b.b.y)} r={b.d === 4 ? 0.45 : 0.7}
                style={{ animationDelay: `${(i % 11) * 0.3}s` }} />
            ))}
          </svg>
        </div>
      )}

      {geo && (
        <svg className="f360-red" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
          {geo.red.length === 4 && (
            <path className="f360-anillo" pathLength={1} d={geo.red.map((p, k) => {
              const q = geo.red[(k + 1) % 4], m = lerp(p, q, 0.5), c = lerp(m, geo.c, 0.45);
              return (k ? "" : `M${f(p.x)} ${f(p.y)} `) + `Q${f(c.x)} ${f(c.y)} ${f(q.x)} ${f(q.y)}`;
            }).join(" ")} />
          )}
          {geo.arboles.map((t, i) => (
            <g key={i} className={"f360-arbol" + (activo === i ? " on" : "")}>
              {t.segs.map((s, k) => (
                <line key={k} className={`r d${Math.min(s.d, 4)}`} pathLength={1}
                  style={{ ["--d" as string]: s.d }}
                  x1={f(s.a.x)} y1={f(s.a.y)} x2={f(s.b.x)} y2={f(s.b.y)} />
              ))}
              {t.nodos.map((p, k) => <circle key={"n" + k} className="nudo" cx={f(p.x)} cy={f(p.y)} r="3" />)}
              {t.puntas.map((p, k) => <circle key={"p" + k} className="punta" cx={f(p.x)} cy={f(p.y)} r="1.8"
                style={{ animationDelay: `${(k % 5) * 0.4}s` }} />)}
              {visible && [t.rutas[0], t.rutas[t.rutas.length - 1]].map((r, k) => {
                const camino = [...r].reverse(); // del recuadro hacia el atleta
                const largo = camino.slice(1).reduce((s, p, j) => s + Math.hypot(p.x - camino[j].x, p.y - camino[j].y), 0);
                return (
                  <circle key={"m" + k} className="pulso" r="3">
                    <animateMotion dur={`${(largo / 90 + k * 0.7).toFixed(2)}s`} begin={`${2 + i * 0.4 + k}s`}
                      repeatCount="indefinite" path={ruta(camino)} />
                  </circle>
                );
              })}
            </g>
          ))}
        </svg>
      )}

      {AREAS.map((a, i) => {
        const abiertoAqui = abierto === i;
        return (
          <article key={a.titulo} ref={(el) => { cajasRef.current[i] = el; }}
            className={`f360-card c${i}` + (activo === i ? " on" : "") + (abiertoAqui ? " abierto" : "")}
            style={{ ["--i" as string]: i }}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <button type="button" className="f360-cabeza" aria-expanded={abiertoAqui} aria-controls={`f360-info-${i}`}
              onClick={() => setAbierto(abiertoAqui ? null : i)}>
              <h3>{a.titulo}</h3>
              <span className="f360-mas" aria-hidden="true" />
            </button>
            <div className="f360-info" id={`f360-info-${i}`} role="region" aria-label={a.titulo}>
              <div>
                <ul>{a.items.map((t) => <li key={t}>{t}</li>)}</ul>
                {a.centro && <p className="f360-centro"><span>Centro asociado</span>{a.centro}</p>}
              </div>
            </div>
          </article>
        );
      })}

      <div ref={nucleoRef} className="f360-nucleo">
        <div className="f360-atleta">
          <strong>Atleta</strong>
          {activo !== null && <span className="sub">{AREAS[activo].titulo}</span>}
        </div>
      </div>
    </div>
  );
}
