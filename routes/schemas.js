const R = require('ramda');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

// validateRequest object object -> array
function validateRequest(schema, params) {
  const schemaValidator = ajv.compile(schema);

  return [schemaValidator(params), R.prop('errors', schemaValidator)];
}

const postChampionshipSchema = {
  title: 'Params to create a championship v1',
  type: 'object',
  properties: {
    style: {
      type: 'string',
      enum: ['nba', 'fiba']
    },
    level: {
      type: 'integer',
      minimum: 0
    },
    nbClubs: {
      type: 'integer',
      minimum: 10
    }
  },
  required: ['style', 'level', 'nbClubs']
};

const getOneChampionshipSchema = {
  title: 'Params to retrieve a championship v1',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      minLength: 24,
      maxLength: 24
    }
  },
  required: ['_id']
};

const getOneClubSchema = {
  title: 'Params to retrieve a club v1',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      minLength: 24,
      maxLength: 24
    }
  },
  required: ['_id']
};

exports.validateRequest = R.curry(validateRequest);
exports.postChampionshipSchema = postChampionshipSchema;
exports.getOneChampionshipSchema = getOneChampionshipSchema;
exports.getOneClubSchema = getOneClubSchema;
