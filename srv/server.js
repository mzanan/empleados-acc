const { faker } = require("@faker-js/faker");

const fakeNacionalidades = () => {
    const arr = [];

    for (let i = 1; i <= 10; i++) {
        const obj = {};

        obj.ID = i,
            obj.descripcion = faker.address.country()

        arr.push(obj);
    }

    cds.on('served', async () => {
        await INSERT.into('Nacionalidades').entries(arr)
    })
}

const fakeCentros = () => {
    const arr = [];

    for (let i = 1; i <= 10; i++) {
        const obj = {};

        obj.ID = i,
            obj.descripcion = faker.address.cityName()

        arr.push(obj);
    }

    cds.on('served', async () => {
        await INSERT.into('Centros').entries(arr)
    })
}

const fakeCargos = () => {
    const arr = [
        { ID: 0, titulo: 'Junior',      salarioMin: 20, salarioMax:  40 },
        { ID: 1, titulo: 'Semi Senior', salarioMin: 40, salarioMax:  60 },
        { ID: 2, titulo: 'Senior',      salarioMin: 60, salarioMax: 100 }
    ];

    cds.on('served', async () => {
        await INSERT.into('Cargos').entries(arr)
    })

    return arr
}

const fakeEmpleados = () => {
    const arrCargos = [
        { ID: 0, titulo: 'Junior',      salarioMin: 20, salarioMax:  40 },
        { ID: 1, titulo: 'Semi Senior', salarioMin: 40, salarioMax:  60 },
        { ID: 2, titulo: 'Senior',      salarioMin: 60, salarioMax: 100 }
    ];

    cds.on('served', async () => {
        await INSERT.into('Cargos').entries(arrCargos)
    })

    
    const arr = [];
    for (let i = 1; i <= 10; i++) {
        const obj = {};

        obj.ID                  = faker.datatype.uuid(),
        obj.nombre              = faker.name.firstName(),
        obj.apellido            = faker.name.lastName(),
        obj.fechaNacimiento     = (faker.date.birthdate({ min: 18, max: 65, mode: 'age' })).toLocaleDateString('es-AR'),
        obj.nacionalidad_ID     = faker.datatype.number({ min: 1, max: 10 }),
        obj.centroDeTrabajo_ID  = faker.datatype.number({ min: 1, max: 10 }),
        obj.cargo_ID            = faker.datatype.number({ min: 0, max: 2 }),
        obj.salario             = faker.datatype.number({ min: Number(arrCargos[obj.cargo_ID].salarioMin), max: Number(arrCargos[obj.cargo_ID].salarioMax) }),
        obj.fechaIngreso        = (faker.date.past()).toLocaleDateString('es-AR'),
        obj.correoEmpresarial   = faker.internet.email(obj.nombre, obj.apellido, 'accenture.com'),
        obj.telefono            = faker.phone.number('+54 9 11 #### ####')
        
        arr.push(obj);
    }

    cds.on('served', async () => {
        await INSERT.into('Empleados').entries(arr)
    })
}

fakeNacionalidades()
fakeCentros()
// fakeCargos()
fakeEmpleados()