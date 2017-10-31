const _ = require('lodash');
const { readline } = require('./node_readline');
const { readInput } = require('./reader');
const { printStr } = require('./printer');
const { Keyword, Vector, HashMap } = require('./types');
const { ns } = require('./core');
const Env = require('./env');
const { debug, isPair } = require('./util');

let env = new Env();
let keys = Object.getOwnPropertySymbols(ns);
for (let i = 0; i < keys.length; i++) {
  let key = keys[i];
  env.set(key, ns[key]);
}

const _eval = (ast) => {
  return EVAL(ast, env);
};

env.set(Symbol.for('eval'), _eval);

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

function quasiquote(ast) {
  if (!isPair(ast)) {
    return [Symbol.for('quote'), ast];
  }

  if (ast[0] === Symbol.for('unquote')) {
    return ast[1];
  }

  if (isPair(ast[0]) && ast[0][0] === Symbol.for('splice-unquote')) {
    return [Symbol.for('concat'), ast[0][1], quasiquote(ast.slice(1))];
  }

  return [Symbol.for('cons'), quasiquote(ast[0]), quasiquote(ast.slice(1))];
}

function isMacroCall(ast, env) {
  return ast.contructor === Array && ast[0].constructor === Symbol && ast[0] in env && env.get(ast[0]).isMacro;
}

function macroexpand(ast, env) {
  while (isMacroCall(ast, env)) {
    let macroFn = env.get(ast[0]);
    ast = macroFn.fn(...ast.slice(1));
  }

  return ast;
}

const READ = (str) => {
  debug("READ", str);

  return readInput(str);
};

const EVAL = (ast, env) => {
  while (true) {
    let bindings, exprs, key, value;

    debug("EVAL", ast, env);

    if (_.isNil(ast)) { return null; }

    ast = macroexpand(ast, env);
    if (ast.constructor !== Array) {
      return evalAst(ast, env);
    }

    if (ast.constructor === Array || ast.constructor === Vector) {
      if (ast.length === 0) {
        return ast;
      } else {
        switch (ast[0]) {
        case Symbol.for('def'):
          [key, value] = ast.slice(1);
          return env.set(key, EVAL(value, env));
        case Symbol.for('let'):
          [bindings, exprs] = ast.slice(1);
          let letEnv = new Env(env);

          for (let i = 0; i < bindings.length; i += 2) {
            let key = bindings[i];
            let value = bindings[i + 1];

            letEnv.set(key, EVAL(value, letEnv));
          }

          env = letEnv;
          ast = exprs;
          continue;
        case Symbol.for('do'):
          exprs = ast.slice(1, ast.length - 1);
          let results = exprs.map((expr) => {
            return evalAst(expr, env);
          });

          ast = ast[ast.length - 1];
          continue;
        case Symbol.for('if'):
          let [cond, thenExprs, elseExprs] = ast.slice(1);
          let result = EVAL(cond, env);

          if (result !== null && result !== false) {
            ast = thenExprs;
            continue;
          } else {
            ast = elseExprs;
            continue;
          }
        case Symbol.for('fn'):
          return {
            ast: ast[2],
            params: ast[1],
            env: env,
            isMacro: false,
            fn: function () {
              let [bindings, body] = ast.slice(1);
              let closureEnv = new Env(env, bindings, Array.from(arguments));

              return EVAL(body, closureEnv);
            }
          };
        case Symbol.for('quote'):
          return ast[1];
        case Symbol.for('quasiquote'):
          ast = quasiquote(ast[1]);
          continue;
        case Symbol.for('defmacro'):
          [key, value] = ast.slice(1);
          value.isMacro = true;
          return env.set(key, EVAL(value, env));
        case Symbol.for('macroexpand'):
          return macroexpand(ast[1], env);
        default:
          let [f, ...args] = evalAst(ast, env);

          switch (f.constructor) {
          case Function:
            return f.apply(f, args);
          case Object:
            env = new Env(f.env, f.params, args);
            ast = f.ast;
            continue;
          }
        }
      }
    } else {
      return evalAst(ast, env);
    }
  }
};

const PRINT = (exp) => {
  debug("PRINT", exp);

  return printStr(exp);
};

const rep = str => PRINT(EVAL(READ(str), env));

rep('(def not (fn (a) (if a false true)))');
rep('(def load-file (fn (f) (eval (read-string (str "(do " (slurp f) ")"))))))');

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
