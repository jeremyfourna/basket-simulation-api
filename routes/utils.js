const R = require('ramda');

function isValidId(id) {
  const identifier = R.prop('_id', id);
  return R.equals(R.length(identifier), 24);
}


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

function findOneFromCollection(
  paramsToRetrieve,
  validation,
  errorMessage,
  collection,
  request,
  response,
  next) {
  // Retrieve the championship Id from the request
  const data = R.pickAll(paramsToRetrieve, R.prop('params', request));
  // Validation
  const isDataValid = validation(data);

  return R.ifElse(
    R.equals(true),
    () => findOne(collection, data, response),
    () => badArguments(errorMessage, response)
  )(isDataValid);
}

exports.isValidId = isValidId;
exports.findOneFromCollection = R.curry(findOneFromCollection);
