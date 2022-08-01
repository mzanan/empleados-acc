using {gestion as my} from '../db/schema';

service Api {
  entity Empleados      as projection on my.Empleados;
  entity Nacionalidades as projection on my.Nacionalidades;
  entity Centros        as projection on my.Centros;
  entity Cargos         as projection on my.Cargos;
  entity Baja           as projection on my.Baja;
  entity Ubicaciones    as projection on my.Ubicaciones;
}
