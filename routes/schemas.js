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

const postUserSchema = {
  title: 'Params to create an user v1',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 64
    }
  },
  required: ['email', 'password']
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

const getOneUserSchema = {
  title: 'Params to retrieve a user v1',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  },
  required: ['email']
};


exports.getOneChampionshipSchema = getOneChampionshipSchema;
exports.getOneClubSchema = getOneClubSchema;
exports.getOneUserSchema = getOneUserSchema;
exports.postChampionshipSchema = postChampionshipSchema;
exports.postUserSchema = postUserSchema;
exports.validateRequest = R.curry(validateRequest);
