exports.up = function(knex, Promise) {
  console.log("creating topics table...");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("topic_slug").primary();
    topicsTable.string("topic_description");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("topics");
};
