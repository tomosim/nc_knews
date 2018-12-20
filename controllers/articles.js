/* eslint consistent-return: 0  */

const connection = require('../db/connection');

const getArticles = (req, res, next) => {
  const {
    limit, p, order_by, direction, search_term,
  } = req.query;

  const myPromise = connection('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.comment_belongs_to')
    .select('article_id', 'article_topic', 'article_title', 'article_body', 'article_created_by', 'article_created_at', 'article_votes')
    .groupBy('articles.article_id')
    .count('articles.article_id AS comment_count')
    .limit(limit || 10)
    .offset(p * limit || 0)
    .orderBy(
      order_by || 'article_title',
      direction === 'desc' ? 'desc' : 'asc',
    );

  if (search_term) myPromise.whereRaw('LOWER(article_title) LIKE ?', `%${search_term.match(/\w/g).join('').toLowerCase()}%`);
  return myPromise.then(articles => res.send({ articles })).catch(next);
};

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  return connection('articles').leftJoin('comments', 'articles.article_id', 'comments.comment_belongs_to')
    .select('article_id', 'article_topic', 'article_title', 'article_body', 'article_created_by', 'article_created_at', 'article_votes')
    .groupBy('articles.article_id')
    .count('articles.article_id AS comment_count')
    .where({ article_id })
    .then((article) => {
      if (article.length === 0) next({ status: 404, msg: 'Article not found' });
      else res.send({ article });
    })
    .catch(next);
};

const updateArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  if (!inc_votes) next({ status: 400 });
  else {
    return connection('articles')
      .where({ article_id })
      .increment('article_votes', inc_votes)
      .returning('*')
      .then((article) => {
        if (article.length === 0) next({ status: 404, msg: 'Article not found' });
        else res.status(202).send({ msg: 'Article updated' });
      })
      .catch(next);
  }
};

const deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  return connection('articles')
    .where({ article_id })
    .del()
    .then(() => res.status(204).send({}))
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const { limit, order_by, p } = req.query;
  const { article_id } = req.params;
  return connection('comments')
    .where({ comment_belongs_to: article_id })
    .limit(limit || 10)
    .orderBy(order_by || 'comment_created_at')
    .offset(p * (limit || 10) || 0)
    .then((comments) => {
      if (comments.length === 0) next({ status: 404, msg: 'Article not found' });
      else res.send({ comments });
    })
    .catch(next);
};

const addComment = (req, res, next) => {
  const { newComment } = req.body;
  const { article_id } = req.params;
  return connection('comments')
    .insert({ ...newComment, comment_belongs_to: article_id })
    .returning('*')
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

module.exports = {
  getArticles,
  getArticlesById,
  updateArticleVotes,
  deleteArticle,
  getCommentsByArticleId,
  addComment,
};
