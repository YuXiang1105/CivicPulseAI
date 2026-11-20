const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const router = require('./routes/routes');

const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false, limit: '10kb', parameterLimit: 20 }));
app.use(express.json({ limit: '10kb' }));
app.use(cors());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net",
                    "'unsafe-inline'"
                ],
                scriptSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net"
                ],
                connectSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net"
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https:"
                ],
                fontSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net",
                    "data:"
                ]
            }
        }
    })
);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', router);
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).send('La solicitud es demasiado grande.');
    }
    if (err.type === 'entity.parse.failed' || err.type === 'parameters.too.many') {
        return res.status(400).send('La solicitud no tiene un formato válido.');
    }
    return next(err);
});
module.exports = app;