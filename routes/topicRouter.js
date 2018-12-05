const topicRouter = require('express').Router();
const { getTopics, addTopic, getArticlesByTopic } = require('../controllers/topics');

topicRouter.route('/').get(getTopics).post(addTopic);
topicRouter.route('/:topic_slug/articles').get(getArticlesByTopic);

module.exports = topicRouter;
