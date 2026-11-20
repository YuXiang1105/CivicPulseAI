const datosDemografia = require('../data/datos_demografia.json');

function obtenerValores(variables) {
    const permitidos = new Set();
    for (const dato of datosDemografia) {
        for (const metadata of dato.MetaData || []) {
            if (variables.includes(metadata.T3_Variable)) {
                permitidos.add(metadata.Nombre);
            }
        }
    }
    return permitidos;
}

const sexosPermitidos = obtenerValores(['Sexo']);
const territoriosPermitidos = obtenerValores([
    'Comunidades y Ciudades Autónomas',
    'Total Nacional'
]);
const edadesPermitidas = obtenerValores([
    'Totales de edad',
    'Semiintervalos de edad',
    'Grupos de edad'
]);
const periodosPermitidos = new Set(
    datosDemografia.flatMap(dato => (dato.Data || []).map(valor => String(valor.Anyo)))
);

function validarEntradaConsulta(entrada) {
    const filtros = { modo: 'individual' };
    if (!entrada || typeof entrada !== 'object' || Array.isArray(entrada)) {
        return { filtros, error: 'La solicitud no tiene un formato válido.' };
    }

    const modo = Object.hasOwn(entrada, 'modo') ? entrada.modo : 'individual';
    if (modo !== 'individual' && modo !== 'comparar') {
        return { filtros, error: 'El modo de consulta no es válido.' };
    }
    filtros.modo = modo;

    const campos = [
        ['sexo1', sexosPermitidos],
        ['sexo2', sexosPermitidos],
        ['comunidad1', territoriosPermitidos],
        ['comunidad2', territoriosPermitidos],
        ['edad1', edadesPermitidas],
        ['edad2', edadesPermitidas]
    ];

    for (const [campo, permitidos] of campos) {
        if (!Object.hasOwn(entrada, campo)) {
            continue;
        }
        const valor = entrada[campo];
        if (typeof valor !== 'string') {
            return { filtros, error: 'Los filtros enviados no son válidos.' };
        }
        if (valor !== '' && !permitidos.has(valor)) {
            return { filtros, error: 'Los filtros enviados no son válidos.' };
        }
        if (valor !== '') {
            filtros[campo] = valor;
        }
    }

    if (Object.hasOwn(entrada, 'periodo')) {
        const periodo = entrada.periodo;
        if (typeof periodo !== 'string' ||
            (periodo !== '' && !periodosPermitidos.has(periodo))) {
            return { filtros, error: 'El periodo enviado no es válido.' };
        }
        if (periodo !== '') {
            filtros.periodo = periodo;
        }
    }

    const selecciones = modo === 'comparar' ? [1, 2] : [1];
    const incompleta = selecciones.some(numero =>
        !filtros[`sexo${numero}`] ||
        !filtros[`comunidad${numero}`] ||
        !filtros[`edad${numero}`]
    );
    if (incompleta) {
        return {
            filtros,
            error: modo === 'comparar'
                ? 'Completa sexo, territorio y edad para las dos selecciones.'
                : 'Completa sexo, territorio y edad para la selección.'
        };
    }

    return { filtros, error: null };
}

module.exports = validarEntradaConsulta;
