const R = require('ramda');

function findOne(collection, query, response) {
  function resultForFind(result) {
    return R.ifElse(
      R.equals(true),
      () => response.sendStatus(204),
      () => response.json(result)
    )(R.isNil(result));
  }
  return collection.findOne(query).then(resultForFind);
}

function badArguments(message, response) {
  return response.status(400).json({ message });
}


function findOneFromCollection(paramsToRetrieve, validation, collection, request, response, next) {
  // Retrieve the championship Id from the request
  const data = R.pickAll(paramsToRetrieve, R.prop('params', request));
  // Validation
  const isDataValid = validation(data);

  return R.ifElse(
    R.equals(true),
    () => findOne(collection, data, response),
    () => badArguments(R.prop('errors', validation), response)
  )(isDataValid);
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

exports.findOneFromCollection = R.curry(findOneFromCollection);
exports.insertOneInCollection = R.curry(insertOneInCollection);
exports.badArguments = R.curry(badArguments);
