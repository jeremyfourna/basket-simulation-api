const R = require('ramda');
const express = require('express');
const router = express.Router();
const { generateChampionship } = require('basket-simulation-champ');
const monk = require('monk');
const db = monk('localhost:27017/test');

const champs = db.get('championships');
const clubs = db.get('clubs');


router.get('/:id', (req, res, next) => {
  // Retrieve the championship Id from the request
  const champId = R.path(['params', 'id'], req);

  champs.findOne({ _id: champId }).then(championship => {
    res.json(championship);
  });
});

router.post('/', (req, res) => {
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

  const params = R.prop('body', req);
  const newChampionship = generateChampionship(
    R.prop('style', params),
    R.prop('level', params),
    R.prop('nbClubs', params)
  );
  // Insert the championship
  champs.insert(R.head(newChampionship)).then(createdChamp => {
    // Retrieve the championship Id
    const champId = R.prop('_id', createdChamp);
    // Respond to the API call
    res.status(201).json({ _id: champId });
    // Create the clubs for the championship
    createClubForChamp(R.last(newChampionship), champId, updateChampWithClubsId);
  });
});

module.exports = router;
