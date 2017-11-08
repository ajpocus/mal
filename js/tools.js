const util = require('util');
const _ = require('lodash');

exports.zip = function zip(pairList) {
  console.log(pairList);
  if (pairList.length % 2 !== 0) {
    let errorMsg = 'Error: The list provided to zip must have an even number of elements';
    console.log(errorMsg);
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
  return form.constructor === String && form[0] === String.fromCharCode(0x29e);
};
