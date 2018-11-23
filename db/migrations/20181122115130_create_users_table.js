exports.up = function(knex, Promise) {
  console.log("creating users table...");
  return knex.schema.createTable("users", usersTable => {
    usersTable.increments("user_id").primary();
    usersTable.string("user_username");
    usersTable.string("user_name");
    usersTable.string("user_avatr_url");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
