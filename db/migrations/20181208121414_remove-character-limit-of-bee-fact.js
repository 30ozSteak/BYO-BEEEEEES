exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable("bees", function(table) {
      table.string("beefact", 1000).alter();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable("bees", function(table) {
      table.string("beefact").alter();
    })
  ]);
};
