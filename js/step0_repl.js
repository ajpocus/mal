const { readline } = require('./node_readline');

const READ = (str) => str;

const EVAL = (ast, env) => ast;

const PRINT = (exp) => exp;

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
