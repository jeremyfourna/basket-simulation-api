const R = require('ramda');
const express = require('express');
const router = express.Router();
const { generateChampionship } = require('basket-simulation-champ');
const monk = require('monk');
const db = monk('localhost:27017/test');
const {
  findOne,
  badArguments,
  insertOneInCollection,
  respondToGETCall,
  paramsForGETCall
} = require('./db-mgmt');
const {
  validateRequest,
  postChampionshipSchema,
  getOneChampionshipSchema
} = require('./schemas');

const champs = db.get('championships');
const clubs = db.get('clubs');


///// GET 1 championship ///////////////////////////////////////////////////////////////

function getOneChampionship(request, response, next) {
  const params = paramsForGETCall(['_id'], request);
  const isRequestValid = validateRequest(getOneChampionshipSchema, params);

  return R.ifElse(
    R.equals(true),
    () => findOne(champs, params, respondToGETCall(response)),
    () => badArguments(response, R.last(isRequestValid))
  )(R.head(isRequestValid));
}

// Retrieve a given championship
router.get('/:_id', getOneChampionship);

////////////////////////////////////////////////////////////////////////////////////////

///// POST a new championship //////////////////////////////////////////////////////////

function createClubForChamp(clubsList, champId, callback) {
  // Add championship Id inside each club
  const newClubs = R.map(R.assoc('champId', champId), clubsList);
  // Insert the clubs inside the DB
  clubs.insert(newClubs).then(createdClubs => {
    // Retrieve the clubs Id after the insert
    const clubsId = R.map(R.prop('_id'), createdClubs);
    // Call the callback to update the championship
    // with the clubs id
    return callback(champId, clubsId);
  });
}

function updateChampWithClubsId(champId, clubsId) {
  // After creating the clubs, link them inside the championship
  champs.update(champId, { $set: { clubs: clubsId } });
  return champId;
}

function createChampionship(response, params) {
  const newChampionship = generateChampionship(
    R.prop('style', params),
    R.prop('level', params),
    R.prop('nbClubs', params)
  );
  const championship = R.head(newChampionship);
  const clubsInsideChamp = R.last(newChampionship);

  // Insert the championship
  return insertOneInCollection(
    response,
    champs,
    championship, [createClubForChampCurry(clubsInsideChamp), updateChampWithClubsIdCurry]
  );
}

function manageChampionshipCreation(request, response) {
  const createClubForChampCurry = R.curry(createClubForChamp);
  const updateChampWithClubsIdCurry = R.curry(updateChampWithClubsId);

  // Function to validate the request params
  const validatePostChamp = ajv.compile(postChampionshipSchema);
  // Retrieve the championship Id from the request
  const data = R.prop('body', request);
  // Validation
  const isDataValid = validatePostChamp(data);

  return R.ifElse(
    R.equals(true),
    () => createChampionship(response, data),
    () => badArguments(R.prop('errors', validatePostChamp), response)
  )(isDataValid);
}


// Create a new championship
router.post('/', manageChampionshipCreation);

////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
