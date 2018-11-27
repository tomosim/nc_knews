const moment = require('moment');

const formatTopicData = topicData => topicData.map(topicDatum => ({
  topic_slug: topicDatum.slug,
  topic_description: topicDatum.description,
}));

const formatUserData = userData => userData.map(userDatum => ({
  user_username: userDatum.username,
  user_name: userDatum.name,
  user_avatar_url: userDatum.avatar_url,
}));

const formatArticleData = (articleData, topicRows, userRows) => articleData.map(articleDatum => ({
  article_title: articleDatum.title,
  article_body: articleDatum.body,
  article_created_at: moment(articleDatum.created_at),
  article_created_by: userRows.find(
    user => user.user_username === articleDatum.created_by,
  ).user_id,
  article_topic: topicRows.find(
    topic => topic.topic_slug === articleDatum.topic,
  ).topic_slug,
}));

const formatCommentData = (commentData, userRows, articleRows) => commentData.map(commentDatum => ({
  comment_body: commentDatum.body,
  comment_created_at: moment(commentDatum.created_at),
  comment_votes: commentDatum.votes,
  comment_belongs_to: articleRows.find(
    article => article.article_title === commentDatum.belongs_to,
  ).article_id,
  comment_created_by: userRows.find(
    user => user.user_username === commentDatum.created_by,
  ).user_id,
}));

module.exports = {
  formatTopicData,
  formatUserData,
  formatArticleData,
  formatCommentData,
};
