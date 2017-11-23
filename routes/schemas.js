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

exports.postChampionshipSchema = postChampionshipSchema;
exports.getOneChampionshipSchema = getOneChampionshipSchema;
