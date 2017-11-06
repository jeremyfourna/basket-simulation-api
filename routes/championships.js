const express = require('express');
const router = express.Router();
const { generateChampionship } = require('basket-simulation-champ');


router.get('/:id', (req, res, next) => {
  res.json(generateChampionship());
});

module.exports = router;
