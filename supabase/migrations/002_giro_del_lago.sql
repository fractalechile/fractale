-- Fractale · Visitas al stand de recovery (Giro del Lago 2026)
-- Requiere 001_inscripciones.sql (tabla eventos y extensión pgcrypto).

insert into eventos (slug, nombre, fecha, lugar)
values ('giro-del-lago-2026', 'Giro del Lago 2026', '2026-11-22', 'Playa Venado, Puerto Varas')
on conflict (slug) do nothing;

create table if not exists visitas_stand (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  nombre text not null,
  email text not null,
  telefono text,
  distancia text,                    -- '163 km' | '80 km' | 'Acompañante'
  uso_presoterapia boolean not null default false,
  uso_plataforma_salto boolean not null default false,
  salto_cm numeric(5,1),             -- altura medida con Chronojump
  compro_suplementos boolean not null default false,
  suplementos text[] not null default '{}',  -- ForceHuman: Creatina | Pre Workout | Rezet | Essential | Focus
  acepta_terminos boolean not null,
  acepta_comunicaciones boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists visitas_stand_evento_idx on visitas_stand(evento_id);

-- Solo el servidor (service_role) accede a los datos.
alter table visitas_stand enable row level security;
