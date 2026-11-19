const express = require('express');
const consulta_datos = require('../controllers/controller');

const router = express.Router();

router.get('/', (req, res) =>{
res.render("bienvenida");
});

router.get('/consulta', (req, res) => {
    res.render("consulta", { filtros: {}, resultados: [] });
});


router.post('/consulta', consulta_datos, (req, res) => {
    res.render('consulta', {
        resultados: req.resultados,
        filtros: req.filtros,
        error: req.error
    });
});


module.exports = router;
