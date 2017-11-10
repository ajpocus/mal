const util = require('util');
const _ = require('lodash');
const { KEYWORD_PREFIX } = require('./constants');

exports.zip = function zip(pairList) {
  if (pairList.length % 2 !== 0) {
    let errorMsg = 'Error: The list provided to zip must have an even number of elements';
    throw new Error(errorMsg);
  }

  let obj = {};
  for (let i = 0; i < pairList.length; i += 2) {
    obj[pairList[i]] = pairList[i + 1];
  }

  return obj;
};

exports.debug = function debug(...things) {
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
};

exports.isPair = function isPair(lst) {
  return lst.constructor === Array && lst.length > 0;
};

exports.isKeyword = function isKeyword(form) {
  return form.constructor === String && form[0] === KEYWORD_PREFIX;
};

exports.flatten = function flatten(arr) {
  return [].concat.apply([], arr);
};

exports.keysForObject = function keysForObject(obj) {
  let keys = Object.keys(obj);
  let symKeys = Object.getOwnPropertySymbols(obj);
  keys.concat(symKeys);
  keys = keys.filter((key) => { return !key.match(/^__/); });
  return keys;
};

exports.clone = function (fn) {
  let temp = (...args) => { return fn.apply(fn, args); };

  for (let key in fn) {
    if (fn.hasOwnProperty(key)) {
      temp[key] = fn[key];
    }
  }

  return temp;
};
