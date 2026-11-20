const dotenv = require('dotenv');
dotenv.config();

const portValue = process.env.PORT || '3000';
if (!/^\d+$/.test(portValue) || Number(portValue) < 1 || Number(portValue) > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535.');
}

const config = {
  port: Number(portValue),
};

module.exports = { config };