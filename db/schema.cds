namespace gestion;

using {cuid} from '@sap/cds/common';

entity Empleados {
    key ID                : Integer;
        nombre            : String;
        apellido          : String;
        fechaNacimiento   : Date;
        nacionalidad      : Association to Nacionalidades; // usar otra entidad con ID y descripción
        centroDeTrabajo   : Association to Centros; // esto será el ID se debe crear otra entidad centro de trabajo: ID, descripción
        cargo             : Association to Cargos; //entidad que tenga un rango de salario de acuerdo al cargo y usar esta misma para validar cuando se de de alta a un empleado.
        salario           : Integer;
        fechaIngreso      : Date;
        correoEmpresarial : String;
        telefono          : Integer;
        fechaSalida       : Date; //(en este caso quedara vacío) Validar que fecha de salida no sea superior a fecha de ingreso.
        checkEliminado    : Boolean default false;
        baja              : Association to Baja;
} //Validar que la ubicación contenga el cargo cargado (debe haber otra entidad que contenga la relación Ubicación->cargo)

entity Nacionalidades {
    key ID          : Integer;
        descripcion : String;
        empleado    : Association to many Empleados
                          on empleado.nacionalidad = $self;
}

entity Centros {
    key ID          : Integer;
        descripcion : String;
        empleado    : Association to many Empleados
                          on empleado.centroDeTrabajo = $self;
}

entity Cargos {
    key ID         : Integer;
        titulo     : String;
        salarioMin : Integer;
        salarioMax : Integer;
        empleado   : Association to many Empleados
                         on empleado.cargo = $self;
        ubi_cargos : Association to many Ubicaciones_Cargos
                         on ubi_cargos.cargo = $self;
}

entity Baja : cuid {
    aprobacion1 : Boolean default false;
    aprobacion2 : Boolean default false;
}

entity Ubicaciones {
    key ID     : Integer;
        titulo : String;
        ubi_cargos : Association to many Ubicaciones_Cargos
                         on ubi_cargos.ubicacion = $self;
}

@cds.autoexpose
entity Ubicaciones_Cargos {
    key ubicacion : Association to Ubicaciones;
    key cargo     : Association to Cargos;
}
