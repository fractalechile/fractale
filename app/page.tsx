import EfectosPortada from "./efectos-portada";
import Fractal360 from "./fractal-360";

const ATLETAS = [
  {
    dorsal: "07", nombre: "Francisco Marín Zúñiga", disciplina: "Trail Running", foto: "f-francisco",
    perfil: "Seleccionado Nacional 2025 · 720 pts ITRA",
    logros: [
      "1er lugar General, Cochrane Patagonia Trail 2022",
      "Primer chileno, Paraty Brazil by UTMB 2023",
      "15° Sudamericano, Mundial de Montaña y Trail 2025",
      "2° General, Gran Travesía de los Valles 2025",
    ],
  },
  {
    dorsal: "12", nombre: "Alen Hernández Concha", disciplina: "Karate · Kumite -68 kg", foto: "f-alen",
    perfil: "Team Chile · Cinturón Negro 1er Dan",
    logros: [
      "1er lugar Nacional U21: 2024, 2025 y 2026",
      "3er lugar Sudamericano: 2023 y 2024",
      "5° Panamericano U21, Macaé, Brasil 2026",
      "5 años consecutivos, 1er lugar Zonal (2022–2026)",
    ],
  },
  {
    dorsal: "21", nombre: "Joaquín Beroiza", disciplina: "Remo Olímpico", foto: "f-joaquin",
    perfil: "Selección Chilena de Remo 2026",
    logros: [
      "Campeón Sudamericano 4- Juvenil, Chile 2026",
      "Campeón Sudamericano 8+ Juvenil, Chile 2026",
      "3er lugar Nacional Remoergómetro 2026",
      "Reconocimiento al Espíritu Deportivo, Municipalidad de Puerto Montt 2026",
    ],
  },
];

const MARCAS = [
  { logo: "/assets/marcas/patagonia-medical-hd.png", nombre: "Patagonia Medical" },
  { logo: "/assets/marcas/under-armour.png", nombre: "Under Armour" },
  { logo: "/assets/marcas/winkler-nutrition.png", nombre: "Winkler Nutrition" },
  { logo: "/assets/marcas/fthaus-oficial.png", nombre: "FTHAUS" },
  { logo: "/assets/marcas/red-bull.png", nombre: "Red Bull" },
  { logo: "/assets/marcas/oxxean.png", nombre: "Oxxean" },
  { logo: "/assets/marcas/force-human.png", nombre: "Force Human Performance System" },
  { logo: "/assets/marcas/papa-johns.png", nombre: "Papa Johns" },
];

const FORCE = [
  ["Essentials", "Multivitamínico"],
  ["Base", "Creatina monohidrato"],
  ["Focus", "Nootrópico"],
  ["Training", "Pre-workout"],
  ["Reset", "Recuperación"],
];

const MEDIA_MARATON = "https://www.mediamaratonrutadelosulmos.cl/";
const AGENDAR = "mailto:contacto@fractalechile.com?subject=Inter%C3%A9s%20en%20agendar%20una%20reuni%C3%B3n&body=Hola%20FRACTALE%2C%20me%20interesa%20agendar%20una%20reuni%C3%B3n.";
const PROPONER_MARCA = "mailto:contacto@fractalechile.com?subject=Propuesta%20de%20marca%20para%20trabajar%20con%20FRACTALE&body=Hola%20FRACTALE%2C%20quiero%20proponer%20mi%20marca%20para%20trabajar%20con%20ustedes.";
const WHATSAPP_FORCE = "https://wa.me/56958991823?text=hola%20fractale!%20quiero%20cotizar%20mis%20suplementos";

export default function Portada() {
  return (
    <>
      <EfectosPortada />
      <div className="fondo-portada" aria-hidden="true" />

      {/* barra global */}
      <nav className="gnav" id="head" aria-label="Global">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="FRACTALE Sport Management, inicio">
            <img src="/assets/logo-light.png" alt="FRACTALE Sport Management" />
          </a>
          <div className="links">
            <a href="#atletas">Atletas</a>
            <a href="#alianzas">Alianzas</a>
            <a href="#eventos">Eventos</a>
            <a href="#marcas">Marcas</a>
            <a href="#terreno">En terreno</a>
            <a href="#contacto">Contacto</a>
            <a href="/panel.html">Panel del equipo</a>
          </div>
          <a className="btn btn-blue btn-sm nav-inscribete" href={MEDIA_MARATON} target="_blank" rel="noopener">Inscríbete a la Media Maratón de los Ulmos</a>
          <button className="icon burger" id="burger" aria-label="Menú" aria-expanded="false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 9h16M4 15h16" /></svg>
          </button>
        </div>
      </nav>

      <div className="sheet" id="sheet">
        <a href="#atletas">Atletas</a>
        <a href="#alianzas">Alianzas</a>
        <a href="#eventos">Eventos</a>
        <a href="#marcas">Marcas</a>
        <a href="#terreno">En terreno</a>
        <a href="#contacto">Contacto</a>
        <hr />
        <a className="chico" href={MEDIA_MARATON} target="_blank" rel="noopener">Inscríbete a la Media Maratón de los Ulmos</a>
        <a className="chico" href="/panel.html">Panel del equipo</a>
        <a className="chico" href="https://instagram.com/fractale.cl" target="_blank" rel="noopener">@fractale.cl</a>
      </div>

      <section className="mm-franja" aria-label="Estaremos presentes en la Media Maratón de los Ulmos, 14 de febrero de 2027">
        <div className="mm-cinta" aria-hidden="true">
          <div>
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i}>Estaremos presentes en la Media Maratón de los Ulmos <b>14 Febrero 2027</b> <i>•</i></span>
            ))}
          </div>
        </div>
        <div className="mm-accion">
          <img src="/assets/marcas/media-maraton-ulmos.png" alt="Media Maratón Ruta de los Ulmos" />
          <a className="btn btn-white" href={MEDIA_MARATON} target="_blank" rel="noopener">Inscríbete a la Media Maratón de los Ulmos</a>
        </div>
      </section>

      <main id="top">

        {/* portada */}
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow logo-portada"><img src="/assets/fractale-oficial.png" alt="FRACTALE Sport Management" /></p>
            <h1 className="display">El éxito está en el sur.</h1>
            <p className="lead">Profesionalizamos carreras deportivas y llevamos a las marcas a los eventos clave del sur de Chile.</p>
            <div className="ctas">
              <a className="btn btn-line" href={AGENDAR}>Agendar reunión</a>
              <a className="btn btn-line" href={PROPONER_MARCA}>Propuesta para marcas</a>
            </div>
          </div>
        </section>

        {/* manifiesto */}
        <section className="night">
          <div className="wrap">
            <div className="manifest">
              <p className="eyebrow">El paradigma que rompemos</p>
              <h2 className="headline">El alto rendimiento ya no pide permiso en la capital.</h2>
              <p>El sur de Chile tiene <b>las condiciones geográficas, climáticas y humanas más exigentes del territorio</b>:
                una cuna natural de resiliencia, disciplina y potencial deportivo de clase mundial.
                Aun así, el alto rendimiento estuvo condicionado a la centralización.</p>
              <p>En FRACTALE demostramos que <b>no es necesario migrar a Santiago para llegar a la élite.</b>
                Profesionalizamos la carrera del deportista y ofrecemos a las marcas
                <b> una entrada auténtica, estructurada y rentable</b> a un mercado con una identidad
                y una fidelidad incomparables.</p>
              <p className="quote">El éxito está en el sur.</p>
            </div>
          </div>
        </section>

        {/* acompañamiento 360 */}
        <section id="acompanamiento" className="gray">
          <div className="wide">
            <div className="srv-cabeza">
              <p className="eyebrow mini">Acompañamiento integral 360°</p>
              <h2 className="headline">Descentralizando la élite.</h2>
              <p className="lead">Liberamos al atleta de la carga operativa, administrativa y médica para que ponga toda su energía en rendir y ganar.</p>
            </div>
            <Fractal360 />

            <div className="plantel-cabeza" id="atletas">
              <p className="eyebrow mini">Nuestro equipo</p>
              <h3 className="title">Atletas FRACTALE.</h3>
            </div>
            <div className="plantel">
              {ATLETAS.map((a) => (
                <article className="atleta" key={a.dorsal}>
                  <div className={`atleta-foto ${a.foto}`} {...(a.foto ? { role: "img", "aria-label": `${a.nombre} en competencia` } : { "aria-hidden": true })}>
                    <span className="dorsal" aria-hidden="true">{a.dorsal}</span>
                  </div>
                  <div className="atleta-txt">
                    <p className="disciplina">{a.disciplina}</p>
                    <h4>{a.nombre}</h4>
                    <p className="perfil">{a.perfil}</p>
                    <ul>{a.logros.map((l) => <li key={l}>{l}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* alianzas */}
        <section id="alianzas">
          <div className="wrap">
            <div className="center">
              <p className="eyebrow mini">Respaldados por un ecosistema de clase mundial</p>
              <h2 className="headline">Nuestra red de alianzas oficiales.</h2>
              <p className="lead muted" style={{ maxWidth: "34ch", marginLeft: "auto", marginRight: "auto" }}>Para que nuestros atletas entrenen con los mejores estándares del país.</p>
            </div>
            <div className="allies">
              <article><div className="logo"><img className="l-patagonia" src="/assets/marcas/patagonia-medical-hd.png" alt="Patagonia Medical" /></div>
                <h4>Patagonia Medical</h4><p>Laboratorio y centro médico integral especializado en alta competencia.</p></article>
              <article><div className="logo"><img className="l-ua" src="/assets/marcas/under-armour.png" alt="Under Armour" /></div>
                <h4>Under Armour</h4><p>Indumentaria e ingeniería deportiva que viste y equipa a nuestra nómina.</p></article>
              <article><div className="logo"><img className="l-winkler" src="/assets/marcas/winkler-nutrition.png" alt="Winkler Nutrition" /></div>
                <h4>Winkler Nutrition</h4><p>Empresa chilena de suplementos deportivos y alimenticios.</p></article>
            </div>
            <p className="allies-tit">Colaboradores.</p>
            <div className="allies" style={{ marginTop: 24 }}>
              <article><div className="logo"><img className="l-fthaus" src="/assets/marcas/fthaus-oficial.png" alt="FTHAUS" /></div>
                <h4>FTHAUS</h4><p>Centro clínico y de entrenamiento de vanguardia técnica y metodológica.</p></article>
              <article><div className="logo"><img className="l-redbull" src="/assets/marcas/red-bull.png" alt="Red Bull" /></div>
                <h4>Red Bull</h4><p>Referente mundial en el apoyo al deporte de alto rendimiento.</p></article>
              <article><div className="logo"><img className="l-oxxean" src="/assets/marcas/oxxean.png" alt="Oxxean" /></div>
                <h4>Oxxean</h4><p>Empresa del sur que respalda a nuestros atletas en su propio territorio.</p></article>
            </div>
            <article className="force" aria-label="Distribuidores oficiales de Force Human">
              <div className="force-txt">
                <p className="k">Distribuidores oficiales</p>
                <h3><img src="/assets/marcas/force-human.png" alt="Force Human Performance System" /></h3>
                <p>Somos distribuidores oficiales de Force Human, la marca de suplementos de Sammis Reyes.</p>
              </div>
              <a className="btn btn-white" href={WHATSAPP_FORCE} target="_blank" rel="noopener">Consultar por suplementos</a>
              <img className="force-linea" src="/assets/fotos/force-linea.jpg" alt="Línea de suplementos Force: Essentials, Creatina Base, Focus, Pre-Workout Training y Reset" />
              <div className="force-productos">
                {FORCE.map(([n, d]) => <div key={n}><b>{n}</b><span>{d}</span></div>)}
              </div>
            </article>
            <div className="pertenencia">
              <b>Sentido de pertenencia.</b>
              <p>Atletas orgullosos de su origen, respaldados por una estructura que nada tiene que envidiar a las grandes capitales latinoamericanas.</p>
            </div>
          </div>
        </section>

        {/* eventos */}
        <section id="eventos" style={{ paddingTop: 0 }}>
          <div className="wide">
            <div className="evento-marcas">
              <img className="evento-fondo" src="/assets/fotos/puerto-montt.jpg" alt="Vista de Puerto Montt y su bahía" />
              <div className="evento-grid">
              <div className="evento-txt">
                <p className="k">Eventos y marcas</p>
                <h2>Tu marca, donde el sur se encuentra.</h2>
                <p>Llevamos a tu marca a los eventos deportivos del sur de Chile, con presencia real en cada punto de contacto: recuperación, race village, premiación y contenido.</p>
                <a className="btn btn-white" href="#contacto">Sumar mi marca a un evento</a>
              </div>
              <div className="evento-logos">
                <p>Marcas que trabajan con nosotros</p>
                <div>{MARCAS.map((m) => <span key={m.nombre}><img src={m.logo} alt={m.nombre} /></span>)}</div>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* propuesta b2b */}
        <section id="marcas" className="gray">
          <div className="wrap">
            <div className="center">
              <p className="eyebrow mini">Propuesta de valor B2B</p>
              <h2 className="headline">¿Por qué aliarse con FRACTALE?</h2>
              <p className="lead muted" style={{ maxWidth: "36ch", marginLeft: "auto", marginRight: "auto" }}>No es un patrocinio tradicional. Es una inversión en posicionamiento, reputación y retorno.</p>
            </div>
            <div className="bento">
              <div className="b w3"><span className="n">01</span><b>Posicionamiento territorial exclusivo.</b>
                <p>Domine el segmento de mayor crecimiento del sur asociándose a la descentralización y al orgullo regional.</p></div>
              <div className="b w3"><span className="n">02</span><b>Retorno directo y medible.</b>
                <p>Activaciones B2C y B2B alineadas a sus KPI: de leads a punto de venta y beneficios corporativos.</p></div>
              <div className="b"><span className="n">03</span><b>Atletas de élite.</b>
                <p>Resiliencia, innovación y alto desempeño, contados por nuestros deportistas.</p></div>
              <div className="b"><span className="n">04</span><b>Responsabilidad social y ESG.</b>
                <p>Desarrollo deportivo local con métricas transparentes de impacto.</p></div>
              <div className="b"><span className="n">05</span><b>Carga operativa cero.</b>
                <p>Gestionamos, activamos y reportamos su presencia de principio a fin.</p></div>
            </div>
          </div>
        </section>

        {/* galería del perfil */}
        <section id="terreno">
          <div className="wrap">
            <div className="center">
              <p className="eyebrow mini">En terreno</p>
              <h2 className="headline">Lo que hacemos, semana a semana.</h2>
              <p className="lead muted">Competencias, eventos y trabajo con marcas.</p>
              <div className="ctas"><a className="more" href="https://instagram.com/fractale.cl" target="_blank" rel="noopener">Seguir a @fractale.cl</a></div>
            </div>
            <div className="galeria una">
              <a href="https://instagram.com/fractale.cl" target="_blank" rel="noopener" aria-label="Trail de 65 kilómetros, en Instagram">
                <span className="ig">@fractale.cl</span><div className="foto f-trail"></div></a>
            </div>
          </div>
        </section>

        {/* deportistas y marcas */}
        <div className="unete-zona">
          <article className="unete">
            <div className="unete-in">
              <img src="/assets/symbol-dark.png" alt="" aria-hidden="true" />
              <div>
                <h2>Soy deportista o marca</h2>
                <p>Conversemos cómo impulsar tu carrera o integrar tus objetivos comerciales en nuestra estructura.</p>
              </div>
              <a className="btn btn-white" href={AGENDAR}>Agendar reunión</a>
            </div>
          </article>
        </div>

        {/* llamada final */}
        <section className="final" id="contacto">
          <div className="wrap">
            <p className="eyebrow mini">¿Cuál es tu meta?</p>
            <h2 className="headline">El deporte en el sur cambió. Sea parte del liderazgo.</h2>
            <p className="lead">Las marcas pioneras no esperan a que los mercados se consoliden: los construyen.</p>
            <div className="ctas">
              <a className="btn btn-blue" href="mailto:contacto@fractalechile.com?subject=Reuni%C3%B3n%20de%20alineaci%C3%B3n%20estrat%C3%A9gica">Escribir a FRACTALE</a>
              <a className="btn btn-line" href="https://instagram.com/fractale.cl" target="_blank" rel="noopener">Seguir en Instagram</a>
            </div>
          </div>
        </section>

      </main>

      <footer>
        <div className="wrap">
          <p className="nota">FRACTALE Sport Management trabaja con atletas, eventos y marcas desde Puerto Montt, Región de Los Lagos, Chile. Escríbenos a <a href="mailto:contacto@fractalechile.com" style={{ color: "var(--link)" }}>contacto@fractalechile.com</a>.</p>
          <div className="cols">
            <div><h5>Atletas</h5>
              <a href="#acompanamiento">Acompañamiento 360°</a><a href="#acompanamiento">Performance</a>
              <a href="#acompanamiento">Salud y bienestar</a><a href="#acompanamiento">Marketing y gestión</a></div>
            <div><h5>Marcas</h5>
              <a href="#marcas">Propuesta B2B</a><a href="#eventos">Eventos</a>
              <a href="#alianzas">Alianzas</a><a href={AGENDAR}>Agendar reunión</a></div>
            <div><h5>Equipo</h5>
              <a href="/panel.html">Panel</a><a href="/panel.html">Entrenadores</a>
              <a href="/panel.html">Médicos</a><a href="/panel.html">Nutricionistas</a></div>
            <div><h5>FRACTALE</h5>
              <a href="#top">Quiénes somos</a>
              <a href={MEDIA_MARATON} target="_blank" rel="noopener">Inscríbete a la Media Maratón de los Ulmos</a>
              <a href="https://instagram.com/fractale.cl" target="_blank" rel="noopener">Instagram</a>
              <a href="#contacto">Contacto</a></div>
            <div><h5>Dónde estamos</h5>
              <p>Puerto Montt, Región de Los Lagos, Chile.</p>
              <p>Instagram oficial: @fractale.cl</p></div>
          </div>
          <div className="legal">
            <span>Copyright © {new Date().getFullYear()} FRACTALE Sport Management. Todos los derechos reservados.</span>
            <span className="spacer"></span>
            <span><a href="/terminos">Términos y privacidad</a></span>
            <span className="spacer"></span>
            <span>Puerto Montt · Chile</span>
          </div>
        </div>
      </footer>
    </>
  );
}
