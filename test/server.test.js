const chai = require('chai');
const assert = chai.assert;
const chaiHTTP = require('chai-http');
const app = require('../server.js');

chai.use(chaiHTTP);

describe('API Routes', () => {
  describe('/api/v1/locations', () => {

  });

  describe('/api/v1/locations/:id', () => {

  });

  describe('/api/v1/locations/:id/bees' () => {

  });

  describe('/api/v1/locations/:location_id/bees/:bee_id', () => {

  });
});