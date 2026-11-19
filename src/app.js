const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const router = require('./routes/routes');

const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/', router);

module.exports = app;