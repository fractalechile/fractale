import { Archivo, JetBrains_Mono } from "next/font/google";
import SonidoPortada from "./sonido-portada";

const ancho = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--f-ancho" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono" });

/** Anillo graduado del visor. */
const MARCAS = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180, r1 = i % 6 ? 182 : 172, r2 = 192;
  return [200 + Math.cos(a) * r1, 200 + Math.sin(a) * r1, 200 + Math.cos(a) * r2, 200 + Math.sin(a) * r2];
});


const r = (n: number) => Math.round(n * 10) / 10;

export default function PortadaCine({ agendar, mediaMaraton }: { agendar: string; mediaMaraton: string }) {
  return (
    <section className={`hero cine ${ancho.variable} ${mono.variable}`}>
      <video className="cine-video" autoPlay muted loop playsInline preload="auto"
        poster="/assets/video/portada-poster.jpg" aria-hidden="true">
        <source src="/assets/video/portada-vertical.mp4" type="video/mp4" media="(max-width: 734px)" />
        <source src="/assets/video/portada-ancho.mp4" type="video/mp4" />
      </video>
      <svg className="cine-visor" viewBox="0 0 400 400" fill="none" stroke="#fff" aria-hidden="true">
        <g className="v1" strokeOpacity=".35">
          <circle cx="200" cy="200" r="196" strokeWidth=".6" />
          <g strokeWidth="1.4">
            {MARCAS.map(([a, b, c, d], i) => <line key={i} x1={r(a)} y1={r(b)} x2={r(c)} y2={r(d)} />)}
          </g>
        </g>
      </svg>

      <div className="mm-accion cine-mm">
        <img src="/assets/marcas/media-maraton-ulmos.png" alt="Media Maratón Ruta de los Ulmos" />
        <div className="cine-mm-der">
          <a className="btn btn-white" href={mediaMaraton} aria-label="Inscríbete a la Media Maratón de los Ulmos">Inscríbete</a>
          <SonidoPortada />
        </div>
      </div>

      <div className="cine-centro">
        <h1 className="cine-titulo"><img src="/assets/fractale-oficial.png" alt="FRACTALE Sport Management" width={1200} height={218} /></h1>
      </div>

      <div className="cine-esq bl">
        <p className="cine-lema izq">Gestión deportiva<br />y alto rendimiento.</p>
        <div className="cine-acc"><a className="cine-btn blanco" href={agendar}>Agendar reunión</a></div>
        <p className="cine-lema der">El éxito está<br />en el sur.</p>
      </div>
      <a className="cine-esq br" href="mailto:contacto@fractalechile.com">Escríbenos<br />contacto@fractalechile.com&nbsp;→</a>
    </section>
  );
}
