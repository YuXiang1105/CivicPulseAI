const datos_demografia = require('../data/datos_demografia.json');

function demografia_service(sexo, comunidad, edad, periodo) {

    const resultado = datos_demografia.filter(dato =>
        dato["Sexo"] === sexo &&
        dato["Comunidades y Ciudades Autónomas"] === comunidad &&
        dato["Edad"] === edad &&
        dato["Periodo"] === periodo
    );

    return resultado;
}

module.exports = demografia_service;