const process = require('process');

function printStr(data, printReadably = true) {
  if (data === null) {
    return data;
  }

  let str;

  switch (data.constructor) {
  case String:
    str = `"${data}"`;
    break;
  case Boolean:
  case Number:
    str = data.toString();
    break;
  case Array:
    str = `(${data.map(printStr).join(' ')})`;
    break;
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
