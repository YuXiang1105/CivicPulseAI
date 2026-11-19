const express = require('express');
const { consulta_datos } = require('../controllers/controller');

const router = express.Router();

router.get('/', (req, res) =>{
res.render("bienvenida");
});

router.get('/consulta', (req, res) => {
    res.render("consulta");
});router.post('/consulta', consulta_datos, (req, res) => {
        console.log('REQUEST:', req);
    console.log('BODY:', req.body);
    console.log('PARAMS:', req.params);
    console.log('QUERY:', req.query);
    console.log('HEADERS:', req.headers);
res.render()
})


module.exports = router;
