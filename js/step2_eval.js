const { readline } = require('./node_readline');
const { readInput } = require('./reader');
const { printStr } = require('./printer');

const READ = (str) => {
  return readInput(str);
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

exports = module.exports = rep;
