exports.up = function(knex, Promise) {
  console.log("creating articles table...");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("article_title");
    articlesTable.string("article_body");
    articlesTable
      .integer("article_created_by")
      .references("users.user_id")
      .unsigned();
    articlesTable.string("article_created_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("articles");
};
