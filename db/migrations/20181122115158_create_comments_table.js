exports.up = function(knex, Promise) {
  console.log("creating comments table...");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("comment_body");
    commentsTable
      .integer("comment_belongs_to")
      .references("articles.article_id");
    commentsTable.integer("comment_created_by").references("users.user_id");
    commentsTable.string("comment_creacted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("comments");
};
