const util = require('util');
const _ = require('lodash');

function zip(pairList) {
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
}

function debug(...things) {
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
}

exports = module.exports = { zip, debug };
