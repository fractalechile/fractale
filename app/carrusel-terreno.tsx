"use client";
import { useEffect, useRef } from "react";

/** Cinta de fotos y videos que avanza sola y también se desliza con el dedo o el mouse. */
export default function CarruselTerreno({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pausa = 0;            // hasta cuándo esperar tras una interacción
    let encima = false;
    let ultimo = performance.now();
    let pos = el.scrollLeft;
    let id = 0;

    const velocidad = () => (innerWidth < 735 ? 100 : 125); // px por segundo
    const paso = (t: number) => {
      const dt = Math.min(t - ultimo, 64) / 1000;
      ultimo = t;
      const mitad = el.scrollWidth / 2;
      if (!quieto && !encima && t > pausa) {
        pos += velocidad() * dt;
        if (pos >= mitad) pos -= mitad;
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
        if (pos >= mitad) { pos -= mitad; el.scrollLeft = pos; }
        if (pos <= 0) { pos += mitad; el.scrollLeft = pos; }
      }
      id = requestAnimationFrame(paso);
    };
    const tocar = () => { pausa = performance.now() + 2500; };
    const entrar = () => { encima = true; };
    const salir = () => { encima = false; tocar(); };

    el.addEventListener("pointerdown", tocar, { passive: true });
    el.addEventListener("touchstart", tocar, { passive: true });
    el.addEventListener("wheel", tocar, { passive: true });
    el.addEventListener("scroll", () => { if (performance.now() < pausa) tocar(); }, { passive: true });
    el.addEventListener("mouseenter", entrar);
    el.addEventListener("mouseleave", salir);

    /* arrastrar con el mouse en escritorio */
    let arrastre: { x: number; s: number } | null = null;
    const bajar = (e: PointerEvent) => { if (e.pointerType === "mouse") arrastre = { x: e.clientX, s: el.scrollLeft }; };
    const mover = (e: PointerEvent) => { if (arrastre) { el.scrollLeft = arrastre.s - (e.clientX - arrastre.x); tocar(); } };
    const soltar = () => { arrastre = null; };
    el.addEventListener("pointerdown", bajar);
    addEventListener("pointermove", mover);
    addEventListener("pointerup", soltar);

    id = requestAnimationFrame(paso);
    return () => {
      cancelAnimationFrame(id);
      removeEventListener("pointermove", mover);
      removeEventListener("pointerup", soltar);
    };
  }, []);

  return (
    <div className="carrusel" ref={ref} aria-label="Fotos y videos de FRACTALE en terreno">
      <div className="carrusel-pista">
        {[...items, ...items].map((g, i) => (
          <div className="carrusel-item" key={i} aria-hidden={i >= items.length}>
            {g.endsWith(".mp4")
              ? <video src={`/assets/galeria/${g}`} poster={`/assets/galeria/${g.replace(".mp4", ".jpg")}`} autoPlay muted loop playsInline preload="metadata" />
              : <img src={`/assets/galeria/${g}`} alt={i < items.length ? "FRACTALE en terreno" : ""} loading="lazy" draggable={false} />}
          </div>
        ))}
      </div>
    </div>
  );
}
