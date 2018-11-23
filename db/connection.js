NODE_ENV = process.env.NODE_ENV || "development";
const config = require("../config")[NODE_ENV];
const knex = require("knex");

module.exports = knex(config);
