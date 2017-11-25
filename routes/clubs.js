const R = require('ramda');
const express = require('express');
const router = express.Router();
const { generateClub } = require('basket-simulation-club');
const monk = require('monk');
const db = monk('localhost:27017/test');
const {
  findOne
} = require('./db-mgmt');
const {
  badArguments,
  paramsForGETCall,
  respondToGETCall
} = require('./utils');
const {
  getOneClubSchema,
  validateRequest
} = require('./schemas');

const clubs = db.get('clubs');


///// GET 1 club ///////////////////////////////////////////////////////////////////////

// getOneClub io io io -> io
function getOneClub(request, response, next) {
  const params = paramsForGETCall(['_id'], request);
  const isRequestValid = validateRequest(getOneClubSchema, params);

  return R.ifElse(
    R.equals(true),
    () => findOne(clubs, params, respondToGETCall(response)),
    () => badArguments(response, R.last(isRequestValid))
  )(R.head(isRequestValid));
}

router.get('/:_id', getOneClub);

module.exports = router;
