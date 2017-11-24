const R = require('ramda');

function badArguments(response, message) {
  return response.status(400).json({ message });
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

exports.badArguments = R.curry(badArguments);
exports.paramsForGETCall = R.curry(paramsForGETCall);
exports.respondToGETCall = R.curry(respondToGETCall);
