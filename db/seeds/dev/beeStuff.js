const locationsData = require("./locations");

const createLocation = (knex, location) => {
  return knex("locations")
    .insert(
      {
        name: location.name,
        abbr: location.abbr,
        count: location.count
      },
      "id"
    )
    .then(locationId => {
      const beePromises = [];
      location.bees.forEach(bee => {
        beePromises.push(
          createBee(knex, {
            name: bee.name,
            desc: bee.desc,
            beefact: bee.beeFact,
            location_id: locationId[0]
          })
        );
      });
      return Promise.all(beePromises);
    });
};

const createBee = (knex, bee) => {
  return knex("bees").insert(bee);
};

exports.seed = function(knex, Promise) {
  return knex("bees")
    .del()
    .then(() => {
      knex("locations").del();
    })
    .then(() => {
      const locationPromises = [];
      locationsData.forEach(location => {
        locationPromises.push(createLocation(knex, location));
      });
      return Promise.all(locationPromises);
    })
    .catch(error => {
      console.log("error", error);
    });
};
