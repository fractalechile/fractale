-- Fractale · Varios eventos para el stand
--
-- El QR del stand apunta siempre a fractalechile.com/stand. Esa página muestra
-- el evento marcado con stand_actual = true (solo puede haber uno).
-- Cada evento define sus distancias para el formulario.

alter table eventos add column if not exists stand_actual boolean not null default false;
alter table eventos add column if not exists distancias jsonb;

create unique index if not exists eventos_un_solo_stand_actual
  on eventos (stand_actual) where stand_actual;

update eventos set
  stand_actual = true,
  distancias = '[{"valor":"163 km","detalle":"Giro completo"},
                 {"valor":"80 km","detalle":"Medio giro"},
                 {"valor":"Acompañante","detalle":"Vine a apoyar"}]'::jsonb
where slug = 'giro-del-lago-2026';
