const chai = require('chai');
const assert = chai.assert;
const chaiHTTP = require('chai-http');
const app = require('../server.js');

chai.use(chaiHTTP);

describe('API Routes', () => {
  describe('GET /api/v1/locations', () => {
    it('should respond with a status of 200', () => {

    });

    it('should return a json array of all locations', () => {

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

    it('should respond with a status of 409 if the bee already exists, with instructions to do a PATCH instead');
  });

  describe('PATCH /api/v1/locations/:id', () => {
    // updates location with any new info;
  });

  describe('GET /api/v1/bees/:bee_id', () => {
    it('should respond with a status of 200', () => {

    });

    it('should return a json object with bee name, description, and bee fact', () => {

    });
  });

  describe('PATCH /api/v1/bees/:bee_id', () => {
    // updates bee with any new info;
  });
});