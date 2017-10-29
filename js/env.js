const { exists } = require('./util');

class Env {
  constructor(outer, binds, exprs) {
    this.outer = outer;
    this.data = {};

    if (exists(binds) && exists(exprs)) {
      for (let i = 0; i < binds.length; i++) {
        let bind = binds[i];
        if (bind === Symbol.for('&')) {
          this.set(binds[i+1], exprs.slice(i));
          break;
        }

        this.set(bind, exprs[i]);
      }
    }
  }

  set(key, value) {
    this.data[key] = value;
    return value;
  }

  find(key) {
    if (key in this.data) {
      return this;
    } else if (this.outer) {
      return this.outer.find(key);
    } else {
      return null;
    }
  }

  get(key) {
    let env = this.find(key);
    if (env) {
      return env.data[key];
    } else {
      throw new Error(`Key ${key.toString()} not found`);
    }
  }
}

exports = module.exports = Env;
