const { readline } = require('./node_readline');
const { readStr } = require('./reader');
const { printStr } = require('./printer');

let env = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
};

const READ = (str) => {
  return readStr(str);
};

const EVAL = (ast, env) => ast;

const PRINT = (exp) => {
  return printStr(exp);
};

const rep = str => PRINT(EVAL(READ(str)));

(async function () {
  while (true) {
    let line = await readline();
    if (line === null) {
      break;
    }

    if (line) {
      console.log(rep(line));
    }
  }
})();
