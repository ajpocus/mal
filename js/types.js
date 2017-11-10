const { KEYWORD_PREFIX } = require('./constants');

const newKeyword = (str) => {
  return KEYWORD_PREFIX + str;
};

exports = module.exports = { newKeyword };
