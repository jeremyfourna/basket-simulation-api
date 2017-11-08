const R = require('ramda');
const express = require('express');
const router = express.Router();
const { generateChampionship } = require('basket-simulation-champ');
const monk = require('monk');
const db = monk('localhost:27017/test');

const champs = db.get('championships');
const clubs = db.get('clubs');


router.get('/:id', (req, res, next) => {
  champs.findOne({ _id: R.path(['params', 'id'], req) }).then(championships => {
    res.json(championships);
  });
});

router.post('/', (req, res) => {
  function createClubForChamp(clubsList, champId, callback) {
    const newClubs = R.map(R.assoc('champId', champId), clubsList);

    clubs.insert(newClubs).then(createdClubs => {
      const clubsId = R.map(R.prop('_id'), createdClubs);
      return callback(champId, clubsId);
    });
  }

  function updateChampWithClubsId(champId, clubsId) {
    champs.update(champId, { $set: { clubs: clubsId } });
    return champId;
  }

  const params = R.prop('body', req);
  const newChampionship = generateChampionship(R.prop('style', params), R.prop('level', params), R.prop('nbClubs', params));
  //console.log(params, newChampionship);
  champs.insert(R.head(newChampionship)).then(createdChamp => {
    const champId = R.prop('_id', createdChamp);
    // Response to the API call
    res.status(201).json({ _id: champId });
    // Create the club for the championship
    createClubForChamp(R.last(newChampionship), champId, updateChampWithClubsId);
  });
});

module.exports = router;
