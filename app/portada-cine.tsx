import { Archivo, JetBrains_Mono } from "next/font/google";

const ancho = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--f-ancho" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono" });

/** Anillo graduado del visor. */
const MARCAS = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180, r1 = i % 6 ? 182 : 172, r2 = 192;
  return [200 + Math.cos(a) * r1, 200 + Math.sin(a) * r1, 200 + Math.cos(a) * r2, 200 + Math.sin(a) * r2];
});

/** Fractal hexagonal: cada rama se abre en tres, cuatro niveles. */
const RAMAS: Array<[number, number, number, number, number]> = [];
function rama(x: number, y: number, a: number, l: number, d: number) {
  if (d > 3) return;
  const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l;
  RAMAS.push([x, y, x2, y2, d]);
  rama(x2, y2, a, l * 0.56, d + 1);
  rama(x2, y2, a - 1.05, l * 0.48, d + 1);
  rama(x2, y2, a + 1.05, l * 0.48, d + 1);
}
for (let k = 0; k < 6; k++) rama(200, 200, (k * Math.PI) / 3, 46, 0);

const r = (n: number) => Math.round(n * 10) / 10;

export default function PortadaCine({ agendar, marcas }: { agendar: string; marcas: string }) {
  return (
    <section className={`hero cine ${ancho.variable} ${mono.variable}`}>
      <div className="cine-foto" aria-hidden="true" />
      <svg className="cine-visor" viewBox="0 0 400 400" fill="none" stroke="#fff" aria-hidden="true">
        <g className="v1" strokeOpacity=".35">
          <circle cx="200" cy="200" r="196" strokeWidth=".6" />
          <g strokeWidth="1.4">
            {MARCAS.map(([a, b, c, d], i) => <line key={i} x1={r(a)} y1={r(b)} x2={r(c)} y2={r(d)} />)}
          </g>
        </g>
        <g className="v2" strokeOpacity=".3">
          <circle cx="200" cy="200" r="150" strokeWidth=".6" strokeDasharray="2 6" />
          <polygon points="200,92 293.5,146 293.5,254 200,308 106.5,254 106.5,146" strokeWidth=".8" />
          <g stroke="#7fd4ff" strokeOpacity=".75">
            {RAMAS.map(([a, b, c, d, n], i) => (
              <line key={i} x1={r(a)} y1={r(b)} x2={r(c)} y2={r(d)} strokeWidth={1.2 - n * 0.22} />
            ))}
          </g>
        </g>
      </svg>

      <div className="cine-centro">
        <h1 className="cine-titulo">FRACTALE<span className="cine-sub">SPORT MANAGEMENT</span></h1>
      </div>

      <p className="cine-esq tl">Gestión deportiva<br />y alto rendimiento.</p>
      <p className="cine-esq tr">El éxito está<br />en el sur.</p>
      <div className="cine-esq bl">
        <div className="cine-acc">
          <a className="cine-btn blanco" href={agendar}>Agendar reunión</a>
          <a className="cine-btn linea" href={marcas}>Propuesta para marcas</a>
        </div>
        <p>Base en Puerto Montt.<br />Competimos en todo Chile.</p>
      </div>
      <a className="cine-esq br" href="mailto:contacto@fractalechile.com">Escríbenos<br />contacto@fractalechile.com&nbsp;→</a>
    </section>
  );
}
