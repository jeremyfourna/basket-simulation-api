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



function updateChampWithClubsId(champId, clubsId) {
  // After creating the clubs, link them inside the championship
  champs.update(champId, { $set: { clubs: clubsId } });
  return champId;
}


function postManyClubsForChamp(clubsList, champId) {
  //console.log(clubsList, champId, callback);
  // Add championship Id inside each club
  /*const newClubs = R.map(R.assoc('champId', champId), clubsList);
  // Insert the clubs inside the DB
  clubs.insert(newClubs).then(createdClubs => {
    // Retrieve the clubs Id after the insert
    const clubsId = R.map(R.prop('_id'), createdClubs);
    // Call the callback to update the championship
    // with the clubs id
    return callback(champId, clubsId);
  });*/
}

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
      respondToPOSTCall(
        response,
        R.__,
        postManyClubsForChampC(clubsInsideChamp)
      )
    )
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
