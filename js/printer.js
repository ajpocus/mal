const process = require('process');
const util = require('util');
const Keyword = require('./types/keyword');
const Vector = require('./types/vector');
const HashMap = require('./types/hash-map');
const { exists } = require('./util');

function repr(data) {
  let str;
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
  case Boolean:
  case Number:
  default:
    str = data.toString();
    break;
  }

  return str;
}

function printStr(data, printReadably = true) {
  if (!exists(data)) {
    return;
  }

  let str = repr(data);
  if (printReadably) {
    console.log(str);
  } else {
    console.log("prcess.stdout");
    process.stdout.write(str);
  }
}

exports = module.exports = { printStr };
