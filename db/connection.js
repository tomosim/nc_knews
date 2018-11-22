NODE_ENV = process.env.NODE_ENV || "dev";
const config = require("../config")[NODE_ENV];
const connection = require("knex")(config);

module.exports = connection;
