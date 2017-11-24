const R = require('ramda');

function findOne(collection, query, callback) {
  return collection.findOne(query).then(callback);
}

function insertOneInCollection(response, collection, data, callbacks) {
  function getIdentifier(createdDocument) {
    return R.prop('_id', createdDocument);
  }

  function respondToInsertOne(createdDocument) {
    // Respond to the API call
    return response.status(201).json({ _id: getIdentifier(createdDocument) });
  }

  return collection.insert(data).then(createdDocument => {
    callbackShouldContinue(callbacks, getIdentifier(createdDocument));
    return respondToInsertOne(createdDocument);
  });
}

function insertManyInCollection(response, collection, data, callbacks) {
  function getIdentifier(createdDocument) {
    return R.prop('_id', createdDocument);
  }

  function respondToInsertOne(createdDocument) {
    // Respond to the API call
    return response.status(201).json({ _id: getIdentifier(createdDocument) });
  }

  return collection.insert(data).then(createdDocument => {
    callbackShouldContinue(callbacks, getIdentifier(createdDocument));
    return respondToInsertOne(createdDocument);
  });
}

exports.findOne = R.curry(findOne);
exports.insertOneInCollection = R.curry(insertOneInCollection);
