const demografia_service = require('../services/demografia_service');

function consulta_datos(req, res, next) {
    const { sexo, comunidad, edad, periodo } = req.body;

    // Llamamos al service
    const resultados = demografia_service(
        sexo,
        comunidad,
        edad,
        periodo
    );

    // Guardamos los resultados
    req.resultados = resultados;

    next();
}

module.exports = consulta_datos;