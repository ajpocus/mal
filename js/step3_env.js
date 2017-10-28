const { readline } = require('./node_readline');
const { readInput } = require('./reader');
const { printStr } = require('./printer');
const { Keyword, Vector, HashMap } = require('./types');
const Env = require('./env');

let env = new Env();
env.set(Symbol.for('+'), (a, b) => { return a + b; });
env.set(Symbol.for('-'), (a, b) => { return a - b; });
env.set(Symbol.for('*'), (a, b) => { return a * b; });
env.set(Symbol.for('/'), (a, b) => { return a / b; });

function evalAst(ast, env) {
  switch (ast.constructor) {
  case Symbol:
    return env.get(ast);
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
      switch (ast[0]) {
      case Symbol.for('def'):
        let [key, value] = ast.slice(1);
        return env.set(key, EVAL(value, env));
      case Symbol.for('let'):
        let [bindings, exprs] = ast;
        let letEnv = new Env(env);

        for (let i = 0; i < bindings.length; i += 2) {
          let key = bindings[i];
          let value = bindings[i + 1];

          letEnv.set(key, EVAL(value, letEnv));
        }

        return EVAL(exprs, letEnv);
      default:
        let form = evalAst(ast, env);
        return form[0].apply(this, form.slice(1));
      }
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
      rep(line);
    }
  }
})();

exports = module.exports = rep;
