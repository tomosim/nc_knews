const { topicData, userData, articleData, commentData } = require("../data");
const {
  formatTopicData,
  formatUserData,
  formatArticleData
} = require("../utils");
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
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
    .then(console.log);
};
