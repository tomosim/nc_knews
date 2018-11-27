const NODE_ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');
const config = require('../config')[NODE_ENV];

module.exports = knex(config);
