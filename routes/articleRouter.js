const articleRouter = require('express').Router();
const {
  getArticles,
  getArticlesById,
  updateArticleVotes,
  deleteArticle,
  getCommentsByArticleId,
  addComment,
} = require('../controllers/articles');

articleRouter.route('/').get(getArticles);
articleRouter.route('/:article_id')
  .get(getArticlesById)
  .patch(updateArticleVotes)
  .delete(deleteArticle);
articleRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(addComment);

module.exports = articleRouter;
