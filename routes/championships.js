const R = require('ramda');
const express = require('express');
const router = express.Router();
const { generateChampionship } = require('basket-simulation-champ');
const monk = require('monk');
const db = monk('localhost:27017/test');
const {
  findOne,
  insert,
  updateOne
} = require('./db-mgmt');
const {
  badArguments,
  paramsForGETCall,
  paramsForPOSTCall,
  respondToGETCall,
  respondToPOSTCall
} = require('./utils');
const {
  getOneChampionshipSchema,
  postChampionshipSchema,
  validateRequest
} = require('./schemas');

const champs = db.get('championships');
const clubs = db.get('clubs');


///// GET 1 championship ///////////////////////////////////////////////////////////////

// getOneChampionship io io io -> io
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

// postOneChampionship io io io -> io
function postOneChampionship(request, response) {
  function createChampionship(params) {
    const prop = R.prop(R.__, params);
    const newChampionship = generateChampionship(
      prop('style'),
      prop('level'),
      prop('nbClubs')
    );
    const championship = R.head(newChampionship);
    const clubsInsideChamp = R.last(newChampionship);
    const postManyClubsForChampC = R.curry(postManyClubsForChamp);

    return insert(
      champs,
      championship,
      postManyClubsForChampC(response, clubsInsideChamp)
    );
  }

  function postManyClubsForChamp(response, clubsList, championship) {
    function updateChampWithClubsId(champId, clubsId) {
      const listOfClubsId = R.map(R.prop('_id'), clubsId);
      const updateQuery = {
        '$set': {
          clubs: listOfClubsId
        }
      };

      return updateOne(champs, champId, updateQuery);
    }
    const champId = R.prop('_id', championship);
    const queryChampId = R.pickAll(['_id'], championship);
    const newClubs = R.map(R.assoc('champId', champId), clubsList);
    const updateChampWithClubsIdC = R.curry(updateChampWithClubsId);

    insert(clubs, newClubs, updateChampWithClubsIdC(queryChampId));

    return respondToPOSTCall(response, championship);
  }

  const params = paramsForPOSTCall(['style', 'level', 'nbClubs'], request);
  const isRequestValid = validateRequest(postChampionshipSchema, params);

  return R.ifElse(
    R.equals(true),
    () => createChampionship(params),
    () => badArguments(response, R.last(isRequestValid))
  )(R.head(isRequestValid));
}

// Create a new championship
router.post('/', postOneChampionship);

////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
