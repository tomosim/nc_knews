const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const { handle400s, handle404s, handle500s } = require('./errors');
const apiRouter = require('./routes/apiRouter');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400s);
app.use(handle404s);
app.use(handle500s);

module.exports = app;
