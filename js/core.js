const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const { printStr } = require('./printer');
const { readInput } = require('./reader');
const { Atom } = require('./types');

let ns = {
  [Symbol.for('+')]: (a, b) => { return a + b; },
  [Symbol.for('-')]: (a, b) => { return a - b; },
  [Symbol.for('*')]: (a, b) => { return a * b; },
  [Symbol.for('/')]: (a, b) => { return a / b; },
  [Symbol.for('list')]: () => {
    return [...arguments];
  },
  [Symbol.for('list?')]: (form) => {
    return form.constructor === Array;
  },
  [Symbol.for('empty?')]: (lst) => {
    return lst.length === 0;
  },
  [Symbol.for('count')]: (lst) => {
    return lst.length;
  },
  [Symbol.for('=')]: (form1, form2) => {
    if (form1.constructor === Array && form2.constructor === Array) {
      if (form1.length === form2.length) {
        return _.every(form1, (form, idx) => {
          return form === form2[idx];
        });
      } else {
        return false;
      }
    } else {
      return form1.constructor === form2.constructor && form1 === form2;
    }
  },
  [Symbol.for('<')]: (a, b) => { return a < b; },
  [Symbol.for('<=')]: (a, b) => { return a <= b; },
  [Symbol.for('>')]: (a, b) => { return a > b; },
  [Symbol.for('>=')]: (a, b) => { return a >= b; },
  [Symbol.for('pr-str')]: (...args) => {
    args.forEach((arg) => {
      printStr(arg, true);
    });

    return args.join(' ');
  },
  [Symbol.for('str')]: (...args) => {
    return args.join('');
  },
  [Symbol.for('prn')]: (...args) => {
    let str = args.join(' ');
    printStr(str, false);

    return null;
  },
  [Symbol.for('println')]: (...args) => {
    let str = args.join(' ');
    printStr(str, true);

    return null;
  },
  [Symbol.for('read-string')]: (...args) => {
    return readInput(args);
  },
  [Symbol.for('slurp')]: (filePath) => {
    return fs.readFileSync(filePath, { encoding: 'utf-8' });
  },
  [Symbol.for('atom')]: (value) => {
    return new Atom(value);
  },
  [Symbol.for('atom?')]: (form) => {
    return form.constructor === Atom;
  },
  [Symbol.for('deref')]: (atom) => {
    return atom.value;
  },
  [Symbol.for('reset!')]: (atom, value) => {
    atom.value = value;
    return atom.value;
  },
  [Symbol.for('swap!')]: (atom, func, ...args) => {
    atom.value = func.fn(...[atom.value].concat(args));
    return atom.value;
  },
  [Symbol.for('cons')]: (el, lst) => {
    lst.unshift(el);
    return lst;
  },
  [Symbol.for('concat')]: (...lsts) => {
    if (lsts) {
      return Array.prototype.concat.apply([], lsts);
    } else {
      return [];
    }
  },
  [Symbol.for('nth')]: (lst, idx) => {
    if (idx < 0 || idx >= lst.length) {
      throw new Error('Index out of range');
    }

    return lst[idx];
  },
  [Symbol.for('first')]: (lst) => {
    try {
      return lst[0];
    } catch (err) {
      return null;
    }
  },
  [Symbol.for('rest')]: (lst) => {
    try {
      return lst.slice(1);
    } catch (err) {
      return [];
    }
  },
  [Symbol.for('throw')]: (val) => {
    throw val;
  }
};

exports = module.exports = { ns };
