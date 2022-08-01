const cds = require("@sap/cds");

module.exports = cds.service.impl(async function () {
  const { Empleados, Cargos, Baja } = this.entities;

  this.before("CREATE", Empleados, async (req) => {
    console.log("-----------> Inside create");

    const { salario, cargo_ID } = req.data;

    let getCargos = await cds.run(SELECT.one(Cargos).where({ ID: cargo_ID }));

    let baja = await cds.run(
      INSERT.into(Baja).entries({ aprobacion1: false, aprobacion2: false })
    );

    req.data.baja_ID = baja.results[0].values[2];

    if (salario < getCargos.salarioMin || salario > getCargos.salarioMax) {
      req.reject(501, "El salario ingresado está fuera del rango");
    } else {
      console.log("Empleado cargado con éxito!");
    }
  });

  this.before("UPDATE", Empleados, async (req) => {
    const [getIdEmpleado] = req.params;
    let getEmpleados = await cds.run(
      SELECT.one(Empleados).where({ ID: getIdEmpleado })
    );

    if (!getEmpleados)
      //verifico que exista el empleado antes de hacer el update
      req.reject(501, "El ID ingresado no pertenece a un empleado existente");

    let {
      nombre,
      apellido,
      fechaNacimiento,
      nacionalidad,
      centroDeTrabajo,
      fechaIngreso,
      correoEmpresarial,
      telefono,
      fechaSalida,
      checkEliminado,
      cargo_ID,
      salario,
    } = req.data;

    if (!cargo_ID) {
      // verifico que exista el id, sino lo busco en la tabla
      cargo_ID = getEmpleados.cargo_ID;
    }

    let getCargos = await cds.run(SELECT.one(Cargos).where({ ID: cargo_ID }));

    if (fechaSalida <= fechaIngreso)
      req.reject(
        501,
        "La fecha de salida debe ser mayor que la fecha de ingreso"
      );
    else if (
      nombre ||
      apellido ||
      fechaNacimiento ||
      nacionalidad ||
      centroDeTrabajo ||
      fechaIngreso ||
      correoEmpresarial ||
      telefono ||
      checkEliminado
    ) {
      req.error(501, "A ingresado datos no modificables.");
    } else if (salario) {
      if (salario < getCargos.salarioMin || salario > getCargos.salarioMax) {
        req.reject(501, "El salario ingresado está fuera del rango");
      }
    } else console.log("Empleado actualizado con éxito!");
  });

  this.on("DELETE", Empleados, async (req) => {
    const [ID] = req.params;
    let getEmpleados = await cds.run(SELECT.one(Empleados).where({ ID }));

    if (!getEmpleados) {
      //verifico que exista el empleado antes de hacer el update
      req.reject(501, "El ID ingresado no pertenece a un empleado existente");
    }

    const today = new Date();
    const dateIngreso = new Date(getEmpleados.fechaIngreso);

    var difference = Math.abs(dateIngreso - today);
    months = difference / (1000 * 3600 * 24 * 30);

    console.log(Math.round(months));

    if (months >= 6) {
      //validar fecha primero
      let updateEmpleado = await cds.run(
        UPDATE(Empleados).with({ checkEliminado: true }).where({ ID })
      );
      console.log("tabla empleado actualizada ", updateEmpleado);

      let updateBaja = await cds.run(
        UPDATE(Baja)
          .with({ aprobacion1: true, aprobacion2: true })
          .where({ ID: getEmpleados.baja_ID })
      );
      console.log("tabla baja actualizada ", updateBaja);
    } else {
      req.reject(
        501,
        "El empleado tiene menos de 6 meses de antiguedad en la empresa y no se puede dar de baja"
      );
    }
  });
});
