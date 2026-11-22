-- Fractale · Número de registro de la visita al stand
--
-- Cada persona que se registra recibe un correlativo que se le muestra en
-- pantalla y sirve como número de fila en el stand.

create sequence if not exists visitas_stand_numero_seq;

alter table visitas_stand add column if not exists numero integer;
alter table visitas_stand alter column numero set default nextval('visitas_stand_numero_seq');

-- Las filas que ya existían reciben su número por orden de llegada.
update visitas_stand v
set numero = t.n
from (select id, row_number() over (order by created_at) as n from visitas_stand) t
where t.id = v.id and v.numero is null;

-- La secuencia continúa después del último número asignado.
select setval('visitas_stand_numero_seq', coalesce((select max(numero) from visitas_stand), 0) + 1, false);

create unique index if not exists visitas_stand_numero_idx on visitas_stand(numero);
