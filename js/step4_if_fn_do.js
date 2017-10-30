const { readline } = require('./node_readline');
const { readInput } = require('./reader');
const { printStr } = require('./printer');
const { Keyword, Vector, HashMap } = require('./types');
const { ns } = require('./core');
const Env = require('./env');
const { debug } = require('./util');

let env = new Env();
let keys = Object.getOwnPropertySymbols(ns);
for (let i = 0; i < keys.length; i++) {
  let key = keys[i];
  env.set(key, ns[key]);
}

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
  debug("READ: ", str);
  return readInput(str);
};

const EVAL = (ast, env) => {
  debug("EVAL", "ast: ", ast, "env: ", env);

  let bindings, exprs;

  if (ast.constructor === Array || ast.constructor === Vector) {
    if (ast.length === 0) {
      return ast;
    } else {
      switch (ast[0]) {
      case Symbol.for('def'):
        let [key, value] = ast.slice(1);
        return env.set(key, EVAL(value, env));
      case Symbol.for('let'):
        [bindings, exprs] = ast.slice(1);
        let letEnv = new Env(env);

        for (let i = 0; i < bindings.length; i += 2) {
          let key = bindings[i];
          let value = bindings[i + 1];

          letEnv.set(key, EVAL(value, letEnv));
        }

        return EVAL(exprs, letEnv);
      case Symbol.for('do'):
        exprs = ast.slice(1);
        let results = exprs.map((expr) => {
          return evalAst(expr, env);
        });

        return EVAL(results[results.length - 1], env);
      case Symbol.for('if'):
        let [cond, thenExprs, elseExprs] = ast.slice(1);
        let result = EVAL(cond, env);

        if (result !== null && result !== false) {
          return EVAL(thenExprs, env);
        } else {
          return EVAL(elseExprs, env);
        }
      case Symbol.for('fn'):
        return function () {
          let [bindings, body] = ast.slice(1);
          let closureEnv = new Env(env, bindings, Array.from(arguments));

          return EVAL(body, closureEnv);
        };
      default:
        let form = evalAst(ast, env);
        let f = form[0];
        return f.apply(f, form.slice(1));
      }
    }
  } else {
    return evalAst(ast, env);
  }
};

const PRINT = (exp) => {
  debug("PRINT", exp);

  return printStr(exp);
};

const rep = str => PRINT(EVAL(READ(str), env));

rep("(def not (fn (a) (if a false true)))");

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
