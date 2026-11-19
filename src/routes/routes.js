const express = require('express');
const { getHome } = require('../controllers/controller');

const router = express.Router();

router.get('/', (req, res) =>{
res.render("index");
});

router.get('/consulta_demografica', (req, res) => {
    res.render("pagInicio");
})

module.exports = router;
