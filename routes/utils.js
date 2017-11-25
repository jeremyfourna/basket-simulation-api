const R = require('ramda');

// badArguments io string -> io
function badArguments(response, message) {
  return response.status(400).json({ message });
}

// respondToGETCall io a -> io
function respondToGETCall(response, result) {
  return R.ifElse(
    R.equals(true),
    () => response.sendStatus(204),
    () => response.json(result)
  )(R.isNil(result));
}

// respondToPOSTCall io object -> io
function respondToPOSTCall(response, result) {
  function cleanResult(result) {
    return { _id: R.prop('_id', result) };
  }

  return R.ifElse(
    R.equals(true),
    () => response.sendStatus(502),
    () => response.status(201).json(cleanResult(result))
  )(R.isNil(result));
}

// paramsForGETCall array object -> object
function paramsForGETCall(paramsToRetrieve, request) {
  return paramsFromRequest('params', paramsToRetrieve, request);
}

// paramsForPOSTCall array object -> object
function paramsForPOSTCall(paramsToRetrieve, request) {
  return paramsFromRequest('body', paramsToRetrieve, request);
}

// paramsFromRequest string array object -> object
function paramsFromRequest(property, paramsToRetrieve, request) {
  return R.pickAll(paramsToRetrieve, R.prop(property, request));
}

exports.badArguments = R.curry(badArguments);
exports.paramsForGETCall = R.curry(paramsForGETCall);
exports.respondToGETCall = R.curry(respondToGETCall);
exports.paramsForPOSTCall = R.curry(paramsForPOSTCall);
exports.respondToPOSTCall = R.curry(respondToPOSTCall);
