const connection = require('../db/connection');

const getTopics = (req, res, next) => {
  const {
    limit, p, orderBy, direction, search_term,
  } = req.query;
  const myPromise = connection('topics')
    .limit(limit || 10)
    .offset(p * limit || 0)
    .orderBy(
      orderBy || 'topic_description',
      direction === 'desc' ? 'desc' : 'asc',
    );
  if (search_term) myPromise.where('topic_slug', 'like', `%${search_term.toLowerCase()}%`);
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
    limit, p, orderBy, direction,
  } = req.query;
  const topicPromise = connection('topics').where({ topic_slug });
  const articlePromise = connection('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.comment_belongs_to')
    .select('article_id', 'article_topic', 'article_title', 'article_body', 'article_created_by', 'article_created_at', 'article_votes')
    .groupBy('articles.article_id')
    .count('articles.article_id AS comment_count')
    .where({ article_topic: topic_slug })
    .limit(limit || 10)
    .offset(p * limit || 0)
    .orderBy(
      orderBy || 'article_title',
      direction === 'desc' ? 'desc' : 'asc',
    );
  return Promise.all([topicPromise, articlePromise]).then(([topics, articles]) => {
    if (topics.length === 0) next({ status: 404, msg: 'Topic not found' });
    else res.send({ articles });
  })
    .catch(next);
};

const addArticle = (req, res, next) => {
  const { topic_slug } = req.params;
  const article = req.body;
  return connection('articles')
    .insert({ article_topic: topic_slug, ...article })
    .returning('*')
    .then((newArticle) => {
      res.status(201).send({ newArticle: { comment_count: 0, ...newArticle[0] } });
    })
    .catch(next);
};

module.exports = {
  getTopics, addTopic, getArticlesByTopic, addArticle,
};
