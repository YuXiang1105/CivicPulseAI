const demografia_service = require('../services/demografia_service');

function consulta_datos(req, res, next) {
    const { sexo1, sexo2, comunidad1, comunidad2, edad1, edad2, periodo } = req.body;
    const selecciones = [
        { sexo: sexo1, comunidad: comunidad1, edad: edad1 },
        { sexo: sexo2, comunidad: comunidad2, edad: edad2 }
    ];

    req.filtros = { sexo1, sexo2, comunidad1, comunidad2, edad1, edad2 };
    if (selecciones.some(({ sexo, comunidad, edad }) => !sexo || !comunidad || !edad)) {
        req.error = 'Completa sexo, territorio y edad para las dos gráficas.';
        req.resultados = [];
        return next();
    }

    req.resultados = selecciones.map(({ sexo, comunidad, edad }) => {
        const territorio = comunidad.replace(/^\d{2}\s+/, '');
        const [serie] = demografia_service(sexo, comunidad, edad, periodo);

        return {
            etiqueta: `${territorio} · ${sexo} · ${edad}`,
            series: serie ? [{
                ...serie,
                etiqueta: `${sexo} · ${edad}`
            }] : []
        };
    });

    next();
}

module.exports = consulta_datos;