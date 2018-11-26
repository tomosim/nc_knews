const moment = require("moment");

const formatTopicData = topicData => {
  return topicData.map(topicDatum => {
    return {
      topic_slug: topicDatum.slug,
      topic_description: topicDatum.description
    };
  });
};

const formatUserData = userData => {
  return userData.map(userDatum => {
    return {
      user_username: userDatum.username,
      user_name: userDatum.name,
      user_avatar_url: userDatum.avatar_url
    };
  });
};

const formatArticleData = (articleData, topicRows, userRows) => {
  return articleData.map(articleDatum => {
    return {
      article_title: articleDatum.title,
      article_body: articleDatum.body,
      article_created_at: moment(articleDatum.created_at),
      article_created_by: userRows.find(
        user => user.user_username === articleDatum.created_by
      ).user_id,
      article_topic: topicRows.find(
        topic => topic.topic_slug === articleDatum.topic
      ).topic_slug
    };
  });
};

const formatCommentData = (commentData, userRows, articleRows) => {
  return commentData.map(commentDatum => {
    return {
      comment_body: commentDatum.body,
      comment_created_at: moment(commentDatum.created_at),
      comment_votes: commentDatum.votes,
      comment_belongs_to: articleRows.find(
        article => article.article_title === commentDatum.belongs_to
      ).article_id,
      comment_created_by: userRows.find(
        user => user.user_username === commentDatum.created_by
      ).user_id
    };
  });
};

module.exports = {
  formatTopicData,
  formatUserData,
  formatArticleData,
  formatCommentData
};
