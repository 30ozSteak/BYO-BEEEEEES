exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("bees", function(table) {
      table.integer("location_id").unsigned();
      table.foreign("location_id").references("locations.id");
    }),
    knex.schema.alterTable("locations", function(table) {
      table
        .integer("count")
        .unsigned()
        .alter();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable("locations", function(table) {
      table.string("count").alter();
    }),
    knex.schema.table("bees", function(table) {
      table.dropForeign("location_id");
      table.dropColumn("location_id");
    })
  ]);
};
