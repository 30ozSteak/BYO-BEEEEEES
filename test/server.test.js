const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const app = require('../server.js');

chai.use(chaiHTTP);

describe('API Routes', () => {
  describe('GET /api/v1/locations', () => {
    it('should respond with a status of 200', (done) => {
      chai.request(app)
        .get('/api/v1/locations')
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        })
    });

    it.skip('should return a json array of all locations', () => {
      chai.request(app)
        .get('/api/v1/locations')
        .end((error, response) => {
          expect(response).to.be.json
          expect(response).to.be.an('array');
        })
    });
  });

  describe('POST /api/v1/locations', () => {
    it('should respond with a status of 201 if request body is complete', () => {

    });

    it('should add a new location to the database if request body is complete', () => {

    });

    it('should respond with a status of 422 if the request body is incomplete, with instructions to make a complete request', () => {

    });

    it('should respond with a status of 409 if the location already exists, with instructions to do a PATCH instead', () => {

    });
  });

  describe('GET /api/v1/locations/:id', () => {
    it('should respond with a status of 200', () => {

    });

    it('should return a json object, with the location as the key and an array of all associated bees, with each bee being an object with the bee id as the key and the name of the species as the value', () => {

    });
  });

  describe('POST /api/v1/locations/:id', () => {
    it('should respond with a status of 201 if request body is complete', () => {

    });

    it('should add a new bee to the bees database if the request body is complete', () => {

    });

    it('should respond with a status of 422 if the request body is incomplete, with instructions to make a complete request', () => {

    });

    it('should respond with a status of 409 if the bee already exists, with instructions to do a PATCH instead', () => {

    });
  });

  describe('PATCH /api/v1/locations/:id', () => {
    it('should respond with a status of 202 if the request body is appropriate', () => {

    });

    it('should patch the location if the request body is appropriate', () => {

    });

    it('should respond with a status of 422 if the request body is not appropriate', ()=> {

    });

    it('should respond with a status of 404 if the location with that id doesn\'t exist, with instructions to do a POST instead', () => {

    });
  });

  describe('DELETE /api/v1/locations/:id', () => {
    it('should return a status of 202 if the location exists', () => {

    });

    it('should return a status of 404 if the location does not exist', () => {

    });
  });

  describe('GET /api/v1/bees/:id', () => {
    it('should respond with a status of 200', () => {

    });

    it('should return a json object with bee name, description, and bee fact', () => {

    });
  });

  describe('PATCH /api/v1/bees/:id', () => {
    it('should respond with a status of 202 if the request body is appropriate', () => {

    });

    it('should patch the bee if the request body is appropriate', () => {

    });

    it('should respond with a status of 422 if the request body is not appropriate', ()=> {

    });

    it('should respond with a status of 404 if the bee with that id doesn\'t exist, with instructions to do a POST instead', () => {

    });
  });

  describe('DELETE /api/v1/bees/:id', () => {
    it('should return a status of 202 if the location exists', () => {

    });

    it('should return a status of 404 if the location does not exist', () => {

    });
  });
});