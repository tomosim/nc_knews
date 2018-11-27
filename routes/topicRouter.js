const topicRouter = require('express').Router();
const { getTopics } = require('../controllers/topics');

topicRouter.route('/').get(getTopics);

module.exports = topicRouter;
