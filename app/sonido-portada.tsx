"use client";
import { useState } from "react";

/** Activa o silencia la música del video de portada. */
export default function SonidoPortada() {
  const [activo, setActivo] = useState(false);

  const alternar = () => {
    const video = document.querySelector<HTMLVideoElement>(".cine-video");
    if (!video) return;
    const nuevo = !activo;
    video.muted = !nuevo;
    if (nuevo) {
      video.volume = 0.8;
      video.play().catch(() => {});
    }
    setActivo(nuevo);
  };

  return (
    <button type="button" className={`cine-sonido${activo ? " on" : ""}`} onClick={alternar}
      aria-pressed={activo} aria-label={activo ? "Silenciar música" : "Activar música"}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9h4l5-4v14l-5-4H4z" />
        {activo
          ? <><path d="M16.5 8.5a5 5 0 0 1 0 7" /><path d="M19 6a8.5 8.5 0 0 1 0 12" /></>
          : <path d="M17 9l5 6M22 9l-5 6" />}
      </svg>
      <span>{activo ? "Sonido activado" : "Activar sonido"}</span>
    </button>
  );
}
