const R = require('ramda');

function isValidId(id) {
  return R.equals(R.length(id), 24);
}

exports.isValidId = isValidId;
