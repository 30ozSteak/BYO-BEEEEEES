const express = require("express");
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
app.name = "APIary";

app.set("port", process.env.PORT || 3000);

app.use(express.json());

app.get("/api/v1/locations", (request, response) => {
  database("locations")
    .select()
    .then(locations => {
      response.status(200).json(locations);
    })
    .catch(error => {
      response.status(500).json(error);
    });
});

app.post("/api/v1/locations", (request, response) => {
  const location = request.body;

  if (!(location.name && location.abbr && location.count)) {
    return response.status(422).send({
      message:
        "Your request body was not correct. Please send the following format: {name: <String>, abbr: <String>, count: <Integer>}"
    });
  }
  database("locations")
    .select()
    .then(locations => {
      const isIncluded = locations.some(existingLocation => {
        const sameName = existingLocation.name === location.name;
        const sameAbbr = existingLocation.abbr === location.abbr;
        return sameName && sameAbbr;
      });
      if (isIncluded) {
        return response.status(409).send({
          message:
            "You havent successfully added a location because its there already please try a PATCH instead"
        });
      }
      database("locations")
        .insert(location, "id")
        .then(location => {
          response
            .status(201)
            .send("you did it and added a location for bees to hang out in");
        })
        .catch(error => {
          response.status(500).json(error);
        });
    });
});

app.get("/api/v1/location/:id", (request, response) => {
  let { id } = request.params;
  database("bees")
    .where("location_id", id)
    .select()
    .then(bees => {
      response.status(200).json(bees);
    })
    .catch(error => {
      response.status(500).json(error);
    });
});

app.post("/api/v1/location/:id", (request, response) => {
  const newBee = request.body;
  const { id } = request.params;
  if (!(newBee.name && newBee.desc && newBee.beefact)) {
    return response.status(422).send({
      message: "You messed up"
    });
  }
  database('bees')
    .select()
    .then(bees => {
      const isIncluded = bees.some(existingBee => {
        const sameName = existingBee.name === newBee.name;
        const sameDesc = existingBee.desc === newBee.desc;
        const sameBeefact = existingBee.beefact === newBee.beefact;
        const sameLocation = existingBee.location_id === parseInt(id);
        return sameName && sameDesc && sameBeefact && sameLocation;
      });
      if (isIncluded) {
        return response
          .status(409)
          .send({ message: `${newBee.name} already exists for this location. Please try a PATCH instead.`});
      }
      database('bees')
        .insert({ ...newBee, location_id: id }, 'id')
        .then(bee => {
          response
            .status(201)
            .send({ message: `Bee ${newBee.name} added.`});
        })
        .catch(error => {
          response.status(500).json(error);
        });
    });
});

app.patch("/api/v1/location/:id", (request, response) => {
  const { id } = request.params;
  const { name, abbr, count } = request.body;

  if (name && abbr) {
    database('locations')
      .where('id', id)
      .update({ name, abbr })
      .then(() => {
        response.status(202).send({ message: `Location ${id} has been updated with ${request.body}` });
      })
      .catch(error => {
        response.status(500).json(error);
      });
  } else if (count) {
    database('locations')
      .where('id', id)
      .update({ count })
      .then(() => {
        response.status(202).send({ message: `Location ${id} has been updated with ${request.body}` });
      })
      .catch(error => {
        response.status(500).json(error);
      });
  } else {
    response.status(418).send('I am a teapot');
  }
});

app.listen(app.get("port"), () => {
  console.log(`${app.name} is running on ${app.get("port")}.`);
});

module.exports = app;
