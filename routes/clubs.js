const R = require('ramda');
const express = require('express');
const router = express.Router();
const { generateClub } = require('basket-simulation-club');
const monk = require('monk');
const db = monk('localhost:27017/test');
const { isValidId } = require('./utils');

const clubs = db.get('clubs');


router.get('/:id', (req, res, next) => {
  // Retrieve the club Id from the request
  const clubId = R.path(['params', 'id'], req);
  // Validation
  const validClubId = isValidId(clubId);

  if (R.equals(validClubId, true)) {
    clubs.findOne({ _id: clubId }).then(club => {
      if (R.equals(R.isNil(club), true)) {
        res.sendStatus(204);
      } else {
        res.json(club);
      }
    });
  } else {
    res.status(400).json({ message: 'Club id must have a length of 24.' });
  }
});

module.exports = router;
