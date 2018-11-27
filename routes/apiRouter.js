const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter');

apiRouter.use('/topics', topicRouter);

module.exports = apiRouter;
