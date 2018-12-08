exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("locations", function(table) {
      table.increments("id").primary();
      table.string("name");
      table.string("abbr");
      table.string("count");
    }),
    knex.schema.createTable("bees", function(table) {
      table.increments("id").primary();
      table.string("name");
      table.string("desc");
      table.string("beefact");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("bees"),
    knex.schema.dropTable("locations")
  ]);
};
