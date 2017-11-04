const process = require('process');
const util = require('util');
const _ = require('lodash');
const { Keyword, Vector, HashMap, Atom } = require('./types');

function repr(data) {
  let str;

  if (_.isNil(data)) { return 'nil'; }

  switch (data.constructor) {
  case String:
    str = `"${data}"`;
    break;
  case Array:
  case Vector:
    str = `(${data.map(repr).join(' ')})`;
    break;
  case Keyword:
    str = data.slice(1);
    break;
  case HashMap:
    str = util.inspect(data, false, null);
    break;
  case Function:
    str = `#<function ${data.name || 'anonymous'}>`;
    break;
  case Atom:
    str = '#<atom>';
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
