const express = require('express');
const router = express.Router();
const { generateChampionship } = require('basket-simulation-champ');
const monk = require('monk');
const db = monk('localhost:27017/test');

const champ = db.get('championships');


router.get('/:id', (req, res, next) => {
  champ.findOne({ _id: req.params.id }).then((championships) => {
    res.json(championships);
  });
});

module.exports = router;
