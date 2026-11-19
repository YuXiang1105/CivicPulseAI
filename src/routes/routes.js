const express = require('express');
const consulta_datos = require('../controllers/controller');

const router = express.Router();

router.get('/', (req, res) =>{
res.render("bienvenida");
});

router.get('/consulta', (req, res) => {
    res.render("consulta");
});


router.post('/consulta', consulta_datos, (req, res) => {
    console.log(JSON.stringify(req.resultados, null, 2)); //TODO quitar
    res.render('consulta', {
        resultados: req.resultados
    });
});


module.exports = router;
