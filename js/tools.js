const util = require('util');
const _ = require('lodash');
const { KEYWORD_PREFIX } = require('./constants');

exports = module.exports = {
  zip(pairList) {
    if (pairList.length % 2 !== 0) {
      let errorMsg = 'Error: The list provided to zip must have an even number of elements';
      throw new Error(errorMsg);
    }

    let obj = {};
    for (let i = 0; i < pairList.length; i += 2) {
      obj[pairList[i]] = pairList[i + 1];
    }

    return obj;
  },

  debug(...things) {
    if (process.env.DEBUG && !_.isNil(things)) {
      things.forEach((thing) => {
        if (_.isNil(thing)) { return; }

        if (thing.constructor === Object) {
          console.log(util.inspect(thing, false, null));
        } else {
          console.log(thing);
        }
      });
    }

    return process.env.DEBUG;
  },

  isPair(lst) {
    return lst.constructor === Array && lst.length > 0;
  },

  isKeyword(form) {
    return form.constructor === String && form[0] === KEYWORD_PREFIX;
  },

  flatten(arr) {
    return [].concat.apply([], arr);
  },

  keysForObject(obj) {
    let keys = Object.keys(obj);
    let symKeys = Object.getOwnPropertySymbols(obj);
    keys.concat(symKeys);
    keys = keys.filter((key) => !key.match(/^__/));
    return keys;
  },

  cloneFunction(fn, meta) {
    let temp = (...args) => fn.apply(fn, args);
    Object.assign(temp, fn, { meta });
    debugger;
    return temp;
  }
};
