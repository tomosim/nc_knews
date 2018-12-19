const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter');
const articleRouter = require('./articleRouter');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);

module.exports = apiRouter;
