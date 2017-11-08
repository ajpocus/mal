const process = require('process');
const util = require('util');
const _ = require('lodash');
const { isKeyword, zip } = require("./tools");
const { Atom } = require('./atom');

function repr(data) {
  let str;

  if (_.isNil(data)) { return 'nil'; }

  switch (data.constructor) {
  case String:
    if (isKeyword(data)) {
      str = `:${data.slice(1)}`;
    } else {
      str = `"${data}"`;
    }

    break;
  case Array:
    str = `(${data.map(repr).join(' ')})`;
    break;
  case Object:
    let keys = Object.getOwnPropertySymbols(data);
    let pairs = [].concat(keys.map((sym) => {
      let newSym = Symbol.for(':' + sym.toString().slice(1));
      return [newSym, data[sym]];
    }));
    let obj = zip(pairs);

    str = util.inspect(obj, false, null);
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
  case Boolean:
  case Number:
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

exports = module.exports = { printStr };
