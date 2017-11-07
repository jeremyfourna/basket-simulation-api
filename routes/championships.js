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
  const params = R.prop('body', req);
  const newChampionship = generateChampionship(R.prop('style', params), R.prop('level', params), R.prop('nbClubs', params));

  clubs.insert(R.tail(newChampionship)).then(createdClubs => {
    champs.insert(R.assoc('clubs', createdClubs, R.head(newChampionship))).then(createdChamp => {
      res.status(201).json({ _id: createdChamp });
    });
  });
});

module.exports = router;
