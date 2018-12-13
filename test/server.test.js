const chai = require("chai");
const expect = chai.expect;
const chaiHTTP = require("chai-http");
const app = require("../server.js");
const environment = "testing";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

chai.use(chaiHTTP);

describe("API Routes", () => {
  beforeEach(done => {
    database.migrate
      .rollback()
      .then(() => database.migrate.latest())
      .then(() => database.seed.run())
      .then(() => done());
  });

  describe("GET /api/v1/locations", () => {
    it("should respond with a status of 200", done => {
      chai
        .request(app)
        .get("/api/v1/locations")
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it("should return a json array of all locations", done => {
      chai
        .request(app)
        .get("/api/v1/locations")
        .end((error, response) => {
          let startingLocation = {
            name: "Swaziland",
            abbr: "WZ",
            count: 15
          };
          let allLocations = response.body.map(location => {
            return {
              name: location.name,
              abbr: location.abbr,
              count: location.count
            };
          });
          expect(allLocations).to.deep.include(startingLocation);
          expect(response).to.be.json;
          expect(response.body).to.be.an("array");
          done();
        });
    });
  });

  describe("POST /api/v1/locations", () => {
    it("should respond with a status of 201 if request body is complete", done => {
      const newLocation = { name: "Bumble", abbr: "BB", count: 65 };
      chai
        .request(app)
        .post("/api/v1/locations")
        .send(newLocation)
        .end((error, response) => {
          expect(response).to.have.status(201);
          done();
        });
    });

    it("should add a new location to the database if request body is complete", done => {
      const newLocation = { name: "Canada", abbr: "CA", count: 420 };
      const expected = {
        name: "Canada",
        abbr: "CA",
        count: 420,
        id: 9
      };
      chai
        .request(app)
        .post("/api/v1/locations")
        .send(newLocation)
        .end((error, response) => {
          database("locations")
            .select()
            .then(locations => {
              expect(locations).to.deep.include(expected);
              done();
            });
        });
    });

    it("should respond with a status of 422 if the request body is incomplete, with instructions to make a complete request", done => {
      const newLocation = { name: "Bumble", count: 65 };

      chai
        .request(app)
        .post("/api/v1/locations")
        .send(newLocation)
        .end((error, response) => {
          expect(response).to.have.status(422);
          database("locations")
            .select()
            .then(locations => {
              expect(locations).to.have.length(8);
              done();
            });
        });
    });

    it("should respond with a status of 409 if the location already exists, with instructions to do a PATCH instead", done => {
      const newLocation = {
        name: "Angola",
        abbr: "AO",
        count: 127
      };

      chai
        .request(app)
        .post("/api/v1/locations")
        .send(newLocation)
        .end((error, response) => {
          expect(response).to.have.status(409);
          done();
        });
    });
  });

  describe("GET /api/v1/location/:id", () => {
    it("should respond with a status of 200", done => {
      chai
        .request(app)
        .get("/api/v1/location/5")
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it("should return a json object, with the location as the key and an array of all associated bees, with each bee being an object with the bee id as the key and the name of the species as the value", done => {
      chai
        .request(app)
        .get("/api/v1/location/5")
        .end((error, response) => {
          expect(response).to.be.json;
          expect(response.body).to.be.an("array");
          for (let i = 0; i < response.body.length; i++) {
            expect(response.body[i]).to.be.an("object");
            expect(response.body[i]).to.have.property("name");
            expect(response.body[i]).to.have.property("desc");
            expect(response.body[i]).to.have.property("beefact");
            expect(response.body[i].name).to.not.be.undefined;
            expect(response.body[i].desc).to.not.be.undefined;
            expect(response.body[i].beefact).to.not.be.undefined;
            expect(response.body[i].location_id).to.equal(5);
          }
          done();
        });
    });
  });

  describe("POST /api/v1/location/:id", () => {
    it("should respond with a status of 201 if request body is complete", done => {
      const newBee = {
        name: "Bee",
        desc: "Yellow",
        beefact: "doesnt like apples"
      };
      chai
        .request(app)
        .post("/api/v1/location/5")
        .send(newBee)
        .end((error, response) => {
          expect(response).to.have.status(201);
          done();
        });
    });

    it("should add a new bee to the bees database if the request body is complete", done => {
      const newBee = {
        name: "Bee",
        desc: "Yellow",
        beefact: "doesnt like apples"
      };
      const expected = {
        name: "Bee",
        desc: "Yellow",
        beefact: "doesnt like apples",
        id: 40,
        location_id: 5
      };
      chai
        .request(app)
        .post("/api/v1/location/5")
        .send(newBee)
        .end((error, response) => {
          database("bees")
            .select()
            .then(bees => {
              expect(bees).to.deep.include(expected);
              done();
            });
        });
    });

    it("should respond with a status of 422 if the request body is incomplete, with instructions to make a complete request", done => {
      const newBee = { name: "", beefact: "" };
      chai
        .request(app)
        .post("/api/v1/location/5")
        .send(newBee)
        .end((error, response) => {
          expect(response).to.have.status(422);
          database("bees")
            .where("location_id", 5)
            .select()
            .then(bees => {
              expect(bees.length).to.be.within(4, 5);
              done();
            });
        });
    });

    it("should respond with a status of 409 if the bee already exists, with instructions to do a PATCH instead", done => {
      database("bees")
        .where("location_id", 5)
        .select()
        .then(bees => {
          const aBee = bees[2];
          const newBee = {
            name: aBee.name,
            desc: aBee.desc,
            beefact: aBee.beefact
          };
          return newBee;
        })
        .then(data => {
          chai
            .request(app)
            .post("/api/v1/location/5")
            .send(data)
            .end((error, response) => {
              expect(response).to.have.status(409);
              done();
            });
        });
    });
  });

  describe("PATCH /api/v1/location/:id", () => {
    it("should respond with a status of 202 if the request body is appropriate", done => {
      const updateLocation = {
        name: "BeeVille",
        abbr: "BB"
      };

      const anotherLocation = {
        count: 5
      };

      chai
        .request(app)
        .patch("/api/v1/location/5")
        .send(updateLocation)
        .end((error, response) => {
          expect(response).to.have.status(202);
          chai
            .request(app)
            .patch('/api/v1/location/5')
            .send(anotherLocation)
            .end((error, response) => {
              expect(response).to.have.status(202);
              done();
            });
        });
    });

    it("should patch the location if the request body is appropriate", done => {
      const updateLocation = {
        name: "BeeVille",
        abbr: "BB"
      };

      chai
        .request(app)
        .patch("/api/v1/location/5")
        .send(updateLocation)
        .end((error, response) => {
          expect(response).to.have.status(202);
          database("locations")
            .where("id", 5)
            .select()
            .then(location => {
              expect(location[0].name).to.equal("BeeVille");
              expect(location[0].abbr).to.equal("BB");
              done();
            });
        });
    });

    it("should respond with a status of 422 if the request body is not appropriate", done => {
      const updateLocation = {
        potato: "tuber"
      };

      chai
        .request(app)
        .patch("/api/v1/location/5")
        .send(updateLocation)
        .end((error, response) => {
          expect(response).to.have.status(422);
          database("locations")
            .where("id", 5)
            .select()
            .then(location => {
              expect(location[0].potato).to.be.undefined;
              done();
            });
        });
    });

    it("should respond with a status of 422 if the request body is not appropriate again", done => {
      const anotherLocation = {
        count: undefined
      };

      chai
        .request(app)
        .patch("/api/v1/location/5")
        .send(anotherLocation)
        .end((error, response) => {
          expect(response).to.have.status(422);
          database("locations")
            .where("id", 5)
            .select()
            .then(location => {
              expect(location[0].count).to.not.be.undefined;
              done();
            });
        });
    });

    it("should respond with a status of 404 if the location with that id doesn't exist, with instructions to do a POST instead", done => {
      const updateLocation = {
        name: "BeeVille",
        abbr: "BB"
      };

      chai
        .request(app)
        .patch("/api/v1/location/19")
        .send(updateLocation)
        .end((error, response) => {
          expect(response).to.have.status(404);
          done();
        });
    });
  });

  describe("DELETE /api/v1/location/:id", () => {
    it("should return a status of 202 if the location exists", done => {
      chai
        .request(app)
        .delete("/api/v1/location/5")
        .end((error, response) => {
          expect(response).to.have.status(202);
          done();
        });
    });

    it("should return a status of 404 if the location does not exist", done => {
      chai
        .request(app)
        .delete("/api/v1/location/55")
        .end((error, response) => {
          expect(response).to.have.status(404);
          done();
        });
    });
  });

  describe("GET /api/v1/bee/:id", () => {
    it("should respond with a status of 200", done => {
      chai
        .request(app)
        .get("/api/v1/bee/5")
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });

    it("should return a json object with bee name, description, and bee fact", done => {
      chai
        .request(app)
        .get("/api/v1/bee/5")
        .end((error, response) => {
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("name");
          expect(response.body).to.have.property("desc");
          expect(response.body).to.have.property("beefact");
          expect(response.body.name).to.not.be.undefined;
          expect(response.body.desc).to.not.be.undefined;
          expect(response.body.beefact).to.not.be.undefined;
          expect(response.body.id).to.equal(5);
          done();
        });
    });

    it("should respond with a status of 404 if the bee doesn't exist", done => {
      chai
        .request(app)
        .get("/api/v1/bee/404")
        .end((error, response) => {
          expect(response).to.have.status(404);
          done();
        });
    });
  });

  describe("PATCH /api/v1/bee/:id", () => {
    it("should respond with a status of 202 and update the bee if the request body is appropriate", done => {
      const updateBee = { desc: "We've learned more about this bee! Yay!" };

      chai
        .request(app)
        .patch("/api/v1/bee/5")
        .send(updateBee)
        .end((error, response) => {
          expect(response).to.have.status(202);
          database('bees')
            .where('id', 5)
            .select()
            .then(bee => {
              expect(bee[0].desc).to.equal("We've learned more about this bee! Yay!");
              database('bees')
                .where('id', 3)
                .select()
                .then(bee => {
                  expect(bee[0].desc).to.not.equal("We've learned more about this bee! Yay!");
                  done();
                });
            });
        });
    });

    it("should respond with a status of 202 and update the bee if the request body is appropriate again", done => {
      const anotherBee = { beefact: "Bees are the bees knees." };

      chai
        .request(app)
        .patch("/api/v1/bee/10")
        .send(anotherBee)
        .end((error, response) => {
          expect(response).to.have.status(202);
          database('bees')
            .where('id', 10)
            .select()
            .then(bee => {
              expect(bee[0].beefact).to.equal("Bees are the bees knees.");
              database('bees')
                .where('id', 6)
                .select()
                .then(bee => {
                  expect(bee[0].beefact).to.not.equal("Bees are the bees knees.");
                  done();
                });
            });
        });
    });

    it("should respond with a status of 422 if the request body is not appropriate", done => {
      const badUpdate = { cardigan: 42 };

      chai
        .request(app)
        .patch("/api/v1/bee/5")
        .send(badUpdate)
        .end((error, response) => {
          expect(response).to.have.status(422);
          database('bees')
            .where('id', 5)
            .select()
            .then(bee => {
              expect(bee[0].cardigan).to.be.undefined;
              done();
            });
        });
    });

    it("should respond with a status of 422 if the request body is not appropriate again", done => {
      const badUpdate = { beefact: undefined };

      chai
        .request(app)
        .patch("/api/v1/bee/5")
        .send(badUpdate)
        .end((error, response) => {
          expect(response).to.have.status(422);
          database('bees')
            .where('id', 5)
            .select()
            .then(bee => {
              expect(bee[0].beefact).to.not.be.undefined;
              done();
            });
        });
    });

    it("should respond with a status of 404 if the bee with that id doesn't exist, with instructions to do a POST instead", done => {
      const updateBee = { desc: "We've learned more about this bee! Yay!" };

      chai
        .request(app)
        .patch("/api/v1/bee/404")
        .send(updateBee)
        .end((error, response) => {
          expect(response).to.have.status(404);
          done();
        });
    });
  });

  describe("DELETE /api/v1/bee/:id", () => {
    it("should return a status of 202 if the bee exists", done => {
      chai
        .request(app)
        .delete("/api/v1/bee/5")
        .end((error, response) => {
          expect(response).to.have.status(202);
          done();
        });
    });

    it("should return a status of 404 if the bee does not exist", done => {
      chai
        .request(app)
        .delete("/api/v1/bee/404")
        .end((error, response) => {
          expect(response).to.have.status(404);
          done();
        });
    });
  });
});
