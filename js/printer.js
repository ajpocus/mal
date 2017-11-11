const process = require('process');
const util = require('util');
const _ = require('lodash');
const { isKeyword, zip, flatten, keysForObject } = require("./tools");
const { Atom } = require('./atom');

function repr(data) {
  let str;

  if (_.isNil(data)) { return 'nil'; }

  switch (data.constructor) {
  case String:
    if (isKeyword(data)) {
      str = `:${data.slice(1)}`;
    } else {
      str = data;
    }

    break;
  case Array:
    str = `(${data.map(repr).join(' ')})`;
    break;
  case Function:
    str = `#<function ${data.name || 'anonymous'}>`;
    break;
  case Atom:
    str = '#<atom>';
    break;
  case Error:
    str = data.stack;
    break;
  case Object:
    let keys = keysForObject(data);
    let pairs = keys.map((key) => {
      let newKey = key.toString();
      if (newKey.match(/^__/)) {
        return [];
      }

      if (isKeyword(newKey)) {
        newKey = ':' + newKey.slice(1);
      }
      return [newKey, data[key]];
    });
    let obj = zip(flatten(pairs));

    str = util.inspect(obj);
    break;
  case Boolean:
  case Number:
  case Symbol:
  default:
    str = data.toString();
    break;
  }

  return str;
}

function printStr(data, printReadably = true) {
  let str = repr(data);

  if (printReadably) {
    console.log(str);
  } else {
    process.stdout.write(`${str}\n`);
  }
}

exports = module.exports = { printStr, repr };
