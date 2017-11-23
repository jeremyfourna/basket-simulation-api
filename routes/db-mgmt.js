const R = require('ramda');

function findOne(collection, query, callback) {
  return collection.findOne(query).then(callback);
}

function badArguments(response, message) {
  return response.status(400).json({ message });
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

function callbackShouldContinue(callbacks, data) {
  return R.ifElse(
    R.equals(0),
    R.T,
    () => R.head(callbacks)(data, R.tail(callbacks))
  )(R.length(callbacks));
}

function respondToGETCall(response, result) {
  return R.ifElse(
    R.equals(true),
    () => response.sendStatus(204),
    () => response.json(result)
  )(R.isNil(result));
}

// paramsForGETCall array object -> object
function paramsForGETCall(paramsToRetrieve, request) {
  return R.pickAll(paramsToRetrieve, R.prop('params', request));
}

exports.paramsForGETCall = R.curry(paramsForGETCall);
exports.respondToGETCall = R.curry(respondToGETCall);
exports.findOne = R.curry(findOne);
exports.insertOneInCollection = R.curry(insertOneInCollection);
exports.badArguments = R.curry(badArguments);
