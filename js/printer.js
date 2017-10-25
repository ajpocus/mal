const process = require('process');
const util = require('util');
const Keyword = require('./types/keyword');
const Vector = require('./types/vector');
const HashMap = require('./types/hash-map');

function printStr(data, printReadably = true) {
  if (data === null) {
    return data;
  }

  let str;

  switch (data.constructor) {
  case String:
    str = `"${data}"`;
    break;
  case Array:
  case Vector:
    str = `(${data.map(printStr).join(' ')})`;
    break;
  case Keyword:
    str = data.slice(1);
    break;
  case HashMap:
    str = util.inspect(data, false, null);
    break;
  case Boolean:
  case Number:
  default:
    str = data.toString();
    break;
  }

  let printFn;

  if (printReadably) {
    printFn = console.log;
  } else {
    printFn = process.stdout.write;
  }

  return printFn(str);
}

exports = module.exports = { printStr };
