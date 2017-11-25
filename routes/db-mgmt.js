const R = require('ramda');

// findOne object object function -> function
function findOne(collection, query, callback) {
  return collection.findOne(query).then(callback);
}

// insert object object function -> function
function insert(collection, data, callback) {
  return collection.insert(data).then(callback);
}

// updateOne object object object function -> function
function updateOne(collection, query, data, callback) {
  return collection.update(query, data).then(callback);
}

exports.findOne = R.curry(findOne);
exports.insert = R.curry(insert);
exports.updateOne = R.curry(updateOne);
