const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/:userId', function(req, res, next) {
  res.json({ userId: req.params.userId });
});

module.exports = router;
