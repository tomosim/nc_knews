exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('article_title');
    articlesTable.string('article_body', 2000);
    articlesTable
      .string('article_topic')
      .references('topics.topic_slug')
      .unsigned();
    articlesTable
      .integer('article_created_by')
      .references('users.user_id')
      .unsigned();
    articlesTable.integer('article_votes').defaultTo(0);
    articlesTable.date('article_created_at').defaultTo(knex.fn.now(6));
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
