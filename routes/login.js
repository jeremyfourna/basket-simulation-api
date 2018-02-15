const R = require('ramda');
const express = require('express');
const router = express.Router();
const monk = require('monk');
const db = monk('localhost:27017/test');
const jwt = require('jsonwebtoken');
const { generateId } = require('basket-simulation-utils');
const {
  insert,
  findOne,
  updateOne
} = require('./db-mgmt');
const {
  badArguments,
  paramsForGETCall,
  paramsForPOSTCall,
  respondToGETCall,
  respondToPOSTLoginCall
} = require('./utils');
const {
  getOneUserSchema,
  postLoginSchema,
  validateRequest
} = require('./schemas');

const users = db.get('users');


///// POST a token for user ////////////////////////////////////////////////////////////

// postOneUser io io io -> io
function login(request, response) {
  function checkUserExist(result) {
    return R.ifElse(
      R.equals(true),
      () => badArguments(response, 'Credentials unknown'),
      () => {
        const token = generateId();
        const updateQuery = {
          '$set': {
            token,
            connectionDate: new Date()
          }
        };
        return updateOne(users, params, updateQuery, respondToPOSTLoginCall({ token }, response));
      }
    )(R.isNil(result));
  }
  const params = paramsForPOSTCall(['email', 'password'], request);
  const isRequestValid = validateRequest(postLoginSchema, params);

  return R.ifElse(
    R.equals(true),
    () => findOne(users, R.pick(['email', 'password'], params), checkUserExist),
    () => badArguments(response, R.last(isRequestValid))
  )(R.head(isRequestValid));
}

// Create a new championship
router.post('/', login);

////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
