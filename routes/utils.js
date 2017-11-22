const R = require('ramda');

function isValidId(id) {
  return R.equals(R.length(id), 24);
}

function findOne(collection, query, response) {
  collection.findOne(query).then(result => {
    if (R.equals(R.isNil(result), true)) {
      response.sendStatus(204);
    } else {
      response.json(result);
    }
  });
}

function badArguments(message, response) {
  response.status(400).json({ message });
}

function findOneFromCollection(paramsToRetrieve, validation, collection, request, response, next) {
  // Retrieve the championship Id from the request
  const data = R.pickAll(paramsToRetrieve, R.prop('params', request));
  // Validation
  const isDataValid = validation(data);

  R.ifElse(
    R.equals(true),
    () => findOne(collection, data, response),
    () => badArguments('Wrong arguments', response)
  )(isDataValid);
}

exports.isValidId = isValidId;
exports.findOne = R.curry(findOne);
exports.badArguments = R.curry(badArguments);
exports.findOneFromCollection = R.curry(findOneFromCollection);
