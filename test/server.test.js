const chai = require('chai');
const assert = chai.assert;
const chaiHTTP = require('chai-http');
const app = require('../server.js');

chai.use(chaiHTTP);

describe('API Routes', () => {
  describe('GET /api/v1/locations', () => {
    // returns all locations with bee species count;
  });

  describe('POST /api/v1/locations', () => {
    // adds a location with required name, abbreviation, and count;
  });

  describe('GET /api/v1/locations/:id', () => {
    // returns one location with all associated bees;
  });

  describe('POST /api/v1/locations/:id', () => {
    // adds a bee to this location by adding it to the bee table with required location id, name, description, and bee fact;
  });

  describe('PATCH /api/v1/locations/:id', () => {
    // updates location with any new info;
  });

  describe('GET /api/v1/bees/:bee_id', () => {
    // returns the bee description and bee fact about this bee;
  });

  describe('PATCH /api/v1/bees/:bee_id', () => {
    // updates bee with any new info;
  });
});