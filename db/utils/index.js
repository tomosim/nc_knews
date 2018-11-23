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
  console.log(topicRows);
  return articleData.map(articleDatum => {
    return {
      article_title: articleDatum.title,
      article_body: articleDatum.body,
      article_created_at: moment(articleDatum.article_created_at),
      article_created_by: userRows.find(
        user => user.username === articleDatum.article_created_by
      ).user_id,
      article_topic: topicRows.find(
        topic => topic.topic_slug === articleDatum.topic
      ).topic_slug
    };
  });
};

module.exports = { formatTopicData, formatUserData, formatArticleData };
