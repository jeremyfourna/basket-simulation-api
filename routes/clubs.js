const express = require('express');
const router = express.Router();
const { generateClub } = require('basket-simulation-club');


router.get('/:id', (req, res, next) => {
  res.json(generateClub());
});

module.exports = router;
