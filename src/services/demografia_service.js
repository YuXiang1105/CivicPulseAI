const datos_demografia = require('./data/datos.json');

function demografia_service(sexo, comunidad, edad, periodo) {

    const resultado = datos_demografia.filter(dato =>
        dato["Sexo"] === sexo &&
        dato["Comunidades y Ciudades Autónomas"] === comunidad &&
        dato["Edad"] === edad &&
        dato["Periodo"] === periodo
    );

    return resultado;
}

const resultado = demografia_service(
    "Ambos sexos",
    "Total Nacional",
    "Total",
    2025
);

console.log(resultado);