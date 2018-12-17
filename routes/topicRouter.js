const topicRouter = require('express').Router();
const {
  getTopics, addTopic, getArticlesByTopic, addArticle,
} = require('../controllers/topics');

topicRouter.route('/').get(getTopics).post(addTopic);
topicRouter.route('/:topic_slug/articles').get(getArticlesByTopic).post(addArticle);

module.exports = topicRouter;
