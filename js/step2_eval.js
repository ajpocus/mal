const { readline } = require('./node_readline');
const { readInput } = require('./reader');
const { printStr } = require('./printer');
const { Keyword, Vector, HashMap } = require('./types');

let env = {
  [Symbol.for('+')]: (a, b) => { return a + b; },
  [Symbol.for('-')]: (a, b) => { return a - b; },
  [Symbol.for('*')]: (a, b) => { return a * b; },
  [Symbol.for('/')]: (a, b) => { return a / b; }
};

function evalAst(ast, env) {
  switch (ast.constructor) {
  case Symbol:
    return env[ast];
  case Array:
  case Vector:
    return ast.map((a) => { return EVAL(a, env); });
  default:
    return ast;
  }
}

const READ = (str) => {
  return readInput(str);
};

const EVAL = (ast, env) => {
  if (ast.constructor === Array || ast.constructor === Vector) {
    if (ast.length === 0) {
      return ast;
    } else {
      let form = evalAst(ast, env);
      return form[0].apply(this, form.slice(1));
    }
  } else {
    return evalAst(ast, env);
  }
};

const PRINT = (exp) => {
  return printStr(exp);
};

const rep = str => PRINT(EVAL(READ(str), env));

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
