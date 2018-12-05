const connection = require('../db/connection');

const getTopics = (req, res, next) => {
  const {
    limit, offset, orderBy, direction, searchTerm,
  } = req.query;
  const myPromise = connection('topics')
    .limit(limit || 10)
    .offset(offset || 0)
    .orderBy(
      orderBy || 'topic_description',
      direction === 'desc' ? 'desc' : 'asc',
    );
  if (searchTerm) myPromise.where('topic_slug', 'like', `%${searchTerm.toLowerCase()}%`);
  return myPromise.then(topics => res.send({ topics })).catch(next);
};

const addTopic = (req, res, next) => {
  const topic = req.body;
  return connection('topics')
    .insert(topic)
    .returning('*').then(newTopic => res.status(201).send({ newTopic: newTopic[0] }))
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  const {
    limit, offset, orderBy, direction,
  } = req.query;
  connection('articles')
    .where({ article_topic: topic_slug })
    .limit(limit || 10)
    .offset(offset || 0)
    .orderBy(
      orderBy || 'article_title',
      direction === 'desc' ? 'desc' : 'asc',
    )
    .then(articles => res.send({ articles }))
    .catch(next);
};
module.exports = { getTopics, addTopic, getArticlesByTopic };
