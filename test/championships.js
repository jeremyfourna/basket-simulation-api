const R = require('ramda');
const chai = require('chai');
const app = require('../app.js');

chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));

const assert = chai.assert;
const expect = chai.expect;

const url = 'localhost:3000';
const contentType = ['content-type', 'application/json'];

describe('Route: championships', () => {
  describe('POST endpoint: postOneChampionship()', () => {
    it('create a new championships', done => {
      chai.request(url)
        .post('/championships')
        .set(...contentType)
        .send({ style: 'nba', level: 1, nbClubs: 10 })
        .then((response) => {
          console.log(R.keys(response));
          done();
        });
    });
  });
});
