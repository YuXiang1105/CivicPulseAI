const demografia_service = require('../services/demografia_service');

const nombresTerritorios = {
    'Asturias, Principado de': 'Principado de Asturias',
    'Balears, Illes': 'Islas Baleares',
    'Castilla - La Mancha': 'Castilla-La Mancha',
    'Comunitat Valenciana': 'Comunidad Valenciana',
    'Madrid, Comunidad de': 'Comunidad de Madrid',
    'Murcia, Región de': 'Región de Murcia',
    'Navarra, Comunidad Foral de': 'Comunidad Foral de Navarra',
    'Rioja, La': 'La Rioja'
};

function consulta_datos(req, res, next) {
    const { sexo1, sexo2, comunidad1, comunidad2, edad1, edad2, periodo } = req.body;
    const modo = req.body.modo === 'comparar' ? 'comparar' : 'individual';
    const selecciones = [
        { sexo: sexo1, comunidad: comunidad1, edad: edad1 },
        { sexo: sexo2, comunidad: comunidad2, edad: edad2 }
    ].slice(0, modo === 'comparar' ? 2 : 1);

    req.filtros = { modo, sexo1, sexo2, comunidad1, comunidad2, edad1, edad2 };
    if (selecciones.some(({ sexo, comunidad, edad }) => !sexo || !comunidad || !edad)) {
        req.error = modo === 'comparar'
            ? 'Completa sexo, territorio y edad para las dos selecciones.'
            : 'Completa sexo, territorio y edad para la selección.';
        req.resultados = [];
        return next();
    }

    req.resultados = selecciones.map(({ sexo, comunidad, edad }) => {
        const [serie] = demografia_service(sexo, comunidad, edad, periodo);
        const territorio = nombresTerritorios[comunidad] || comunidad;
        const datos = serie ? serie.Data.slice().sort((a, b) => b.Anyo - a.Anyo) : [];
        const ultimo = datos[0];
        const anterior = datos[1];
        const variacionAbsoluta = ultimo && anterior
            ? ultimo.Valor - anterior.Valor
            : null;
        const variacionPorcentual = ultimo && anterior && anterior.Valor !== 0
            ? (variacionAbsoluta / anterior.Valor) * 100
            : null;
        const dato2006 = datos.find(dato => dato.Anyo === 2006) || null;
        const dato2025 = datos.find(dato => dato.Anyo === 2025) || null;
        const variacion2006Absoluta = dato2006 && dato2025
            ? dato2025.Valor - dato2006.Valor
            : null;
        const variacion2006Porcentual = dato2006 && dato2025 && dato2006.Valor !== 0
            ? (variacion2006Absoluta / dato2006.Valor) * 100
            : null;
        const maximo = datos.reduce(
            (actual, dato) => !actual || dato.Valor > actual.Valor ? dato : actual,
            null
        );
        const minimo = datos.reduce(
            (actual, dato) => !actual || dato.Valor < actual.Valor ? dato : actual,
            null
        );

        return {
            etiqueta: `${territorio} · ${sexo} · ${edad}`,
            series: serie ? [{
                ...serie,
                etiqueta: `${sexo} · ${edad}`
            }] : [],
            kpis: {
                ultimo,
                anterior,
                variacionAbsoluta,
                variacionPorcentual,
                dato2006,
                dato2025,
                variacion2006Absoluta,
                variacion2006Porcentual,
                maximo,
                minimo
            }
        };
    });

    next();
}

module.exports = consulta_datos;