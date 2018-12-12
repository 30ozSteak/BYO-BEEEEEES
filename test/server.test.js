const chai = require("chai");
const expect = chai.expect;
const chaiHTTP = require("chai-http");
const app = require("../server.js");
const environment = process.env.NODE_ENV || "testing";
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
      const newBee = { name: "Bee", desc: "Yellow", beefact: "doesnt like apples" };
      const expected = { 
        name: "Bee", 
        desc: "Yellow", 
        beefact: "doesnt like apples",
        id: 40,
        location_id: 5 };
      chai.request(app)
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
          database('bees')
            .where('location_id', 5)
            .select()
            .then(bees => {
              expect(bees.length).to.be.within(4, 5);
              done();
            });
        });
    });

    it("should respond with a status of 409 if the bee already exists, with instructions to do a PATCH instead", done => {
      database('bees')
        .where('location_id', 5)
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
            .post('/api/v1/location/5')
            .send(data)
            .end((error, response) => {
              expect(response).to.have.status(409);
              done();
            });
        });
    });
  });

  describe("PATCH /api/v1/locations/:id", () => {
    it("should respond with a status of 202 if the request body is appropriate", done => {
      const updateLocation = {
        name: 'BeeVille',
        abbr: 'BB'
      };

      const anotherLocation = {
        count: 5
      };

      chai
        .request(app)
        .patch('api/v1/locations/5')
        .send(updateLocation)
        .end((error, response) => {
          expect(response).to.have.status(202);
        });

      chai
        .request(app)
        .patch('api/v1/locations/5')
        .send(anotherLocation)
        .end((error, response) => {
          expect(response).to.have.status(202);
        });

      done();
    });

    // it("should patch the location if the request body is appropriate", () => {});

    // it("should respond with a status of 422 if the request body is not appropriate", () => {});

    // it("should respond with a status of 404 if the location with that id doesn't exist, with instructions to do a POST instead", () => {});
  });

  // describe("DELETE /api/v1/locations/:id", () => {
  //   it("should return a status of 202 if the location exists", () => {});

  //   it("should return a status of 404 if the location does not exist", () => {});
  // });

  // describe("GET /api/v1/bees/:id", () => {
  //   it("should respond with a status of 200", () => {});

  //   it("should return a json object with bee name, description, and bee fact", () => {});
  // });

  // describe("PATCH /api/v1/bees/:id", () => {
  //   it("should respond with a status of 202 if the request body is appropriate", () => {});

  //   it("should patch the bee if the request body is appropriate", () => {});

  //   it("should respond with a status of 422 if the request body is not appropriate", () => {});

  //   it("should respond with a status of 404 if the bee with that id doesn't exist, with instructions to do a POST instead", () => {});
  // });

  // describe("DELETE /api/v1/bees/:id", () => {
  //   it("should return a status of 202 if the location exists", () => {});

  //   it("should return a status of 404 if the location does not exist", () => {});
  // });
});
