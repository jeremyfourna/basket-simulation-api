const R = require('ramda');
const express = require('express');
const router = express.Router();
const monk = require('monk');
const db = monk('localhost:27017/test');
const {
  insert,
  findOne
} = require('./db-mgmt');
const {
  badArguments,
  paramsForGETCall,
  paramsForPOSTCall,
  respondToGETCall,
  respondToPOSTCall
} = require('./utils');
const {
  getOneUserSchema,
  postUserSchema,
  validateRequest
} = require('./schemas');

const users = db.get('users');


///// GET 1 user ///////////////////////////////////////////////////////////////////////

// getOneUser io io io -> io
function getOneUser(request, response) {
  function maskUserResult(response, result) {
    return R.ifElse(
      R.equals(true),
      () => respondToGETCall(response, result),
      () => respondToGETCall(response, R.pickAll(['email', 'clubId'], result))
    )(R.isNil(result));
  }

  const params = paramsForGETCall(['email'], request);
  const isRequestValid = validateRequest(getOneUserSchema, params);
  const maskUserResultC = R.curry(maskUserResult);

  return R.ifElse(
    R.equals(true),
    () => findOne(users, params, maskUserResultC(response)),
    () => badArguments(response, R.last(isRequestValid))
  )(R.head(isRequestValid));
}

// Retrieve a given championship
router.get('/:email', getOneUser);

////////////////////////////////////////////////////////////////////////////////////////

///// POST a new user //////////////////////////////////////////////////////////////////

// postOneUser io io io -> io
function postOneUser(request, response) {
  function checkUserExist(result) {
    return R.ifElse(
      R.equals(true),
      () => insert(users, params, respondToPOSTCall(response)),
      () => badArguments(response, 'Email address already in use')
    )(R.isNil(result));
  }
  const params = paramsForPOSTCall(['email', 'password'], request);
  const isRequestValid = validateRequest(postUserSchema, params);

  return R.ifElse(
    R.equals(true),
    () => findOne(users, R.pick(['email'], params), checkUserExist),
    () => badArguments(response, R.last(isRequestValid))
  )(R.head(isRequestValid));
}

// Create a new championship
router.post('/', postOneUser);

////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
