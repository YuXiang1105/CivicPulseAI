const datos_demografia = require('../data/datos_demografia.json');

function demografia_service(sexo, comunidad, edad, periodo) {
    if (!sexo || !comunidad || !edad) {
        return [];
    }

    const comunidadNormalizada = comunidad.replace(/^\d{2}\s+/, '');
    const anio = periodo === undefined || periodo === '' ? undefined : Number(periodo);

    return datos_demografia
        .filter(dato => {
            const metadata = dato.MetaData || [];
            const tieneValor = (variable, valor) =>
                metadata.some(item =>
                    item.T3_Variable === variable && item.Nombre === valor
                );
            const tieneEdad = metadata.some(item =>
                ['Totales de edad', 'Semiintervalos de edad', 'Grupos de edad'].includes(item.T3_Variable) &&
                item.Nombre === edad
            );
            const tieneComunidad = comunidadNormalizada === 'Total Nacional'
                ? tieneValor('Total Nacional', comunidadNormalizada)
                : tieneValor('Comunidades y Ciudades Autónomas', comunidadNormalizada);

            return tieneValor('Sexo', sexo) && tieneComunidad && tieneEdad;
        })
        .map(dato => {
            if (anio === undefined) {
                return dato;
            }

            return {
                ...dato,
                Data: dato.Data.filter(valor => valor.Anyo === anio)
            };
        })
        .filter(dato => anio === undefined || dato.Data.length > 0);
}

module.exports = demografia_service;