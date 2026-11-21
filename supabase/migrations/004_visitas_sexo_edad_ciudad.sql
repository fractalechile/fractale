-- Fractale · Datos demográficos en las visitas al stand
alter table visitas_stand add column if not exists sexo text;
alter table visitas_stand add column if not exists edad smallint check (edad between 5 and 100);
alter table visitas_stand add column if not exists ciudad text;
