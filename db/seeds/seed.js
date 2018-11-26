const { topicData, userData, articleData, commentData } = require("../data");
const {
  formatTopicData,
  formatUserData,
  formatArticleData,
  formatCommentData
} = require("../utils");

exports.seed = function(knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() =>
      knex("topics")
        .insert(formatTopicData(topicData))
        .returning("*")
    )
    .then(topicsRows => {
      const usersPromise = knex("users")
        .insert(formatUserData(userData))
        .returning("*");
      return Promise.all([topicsRows, usersPromise]);
    })
    .then(([topicRows, userRows]) => {
      const articlePromise = knex("articles")
        .insert(formatArticleData(articleData, topicRows, userRows))
        .returning("*");
      return Promise.all([topicRows, userRows, articlePromise]);
    })
    .then(([topicRows, userRows, articleRows]) => {
      const commentPromise = knex("comments")
        .insert(formatCommentData(commentData, userRows, articleRows))
        .returning("*");
      return Promise.all([topicRows, userRows, articleRows, commentPromise]);
    });
};
