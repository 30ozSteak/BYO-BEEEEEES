exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("Bee Species", function(table) {
      table.increments("id").primary();
      table.string("Species");
      table.string("Common Name");
      table.string("BEE FACTS 🐝");
    }),
    knex.schema.createTable("Locations", function(table) {
      table.increments("id").primary();
      table.string("Region");
      table.string("Country");
    }),
    knex.schema.createTable("Food", function(table) {
      table.increments("id").primary();
      table.string("Host");
      table.string("Description");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("Food"),
    knex.schema.dropTable("Locations"),
    knex.schema.dropTable("Bee Species")
  ]);
};
