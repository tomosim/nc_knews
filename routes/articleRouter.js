const articleRouter = require('express').Router();
const {
  getArticles,
  getArticlesById,
  updateArticleVotes,
  deleteArticle,
  getCommentsByArticleId,
  addComment,
  updateCommentVotes,
  deleteComment,
} = require('../controllers/articles');

articleRouter.route('/').get(getArticles);
articleRouter.route('/:article_id')
  .get(getArticlesById)
  .patch(updateArticleVotes)
  .delete(deleteArticle);
articleRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(addComment);
articleRouter.route('/:article_id/comments/:comment_id')
  .patch(updateCommentVotes)
  .delete(deleteComment);

module.exports = articleRouter;
