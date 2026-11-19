const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const router = require('./routes/routes');

const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
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
app.use('/', router);

module.exports = app;