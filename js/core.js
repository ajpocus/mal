const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const { zip, keysForObject, cloneFunction } = require('./tools');
const { printStr, repr } = require('./printer');
const { readInput } = require('./reader');
const { Atom } = require('./atom');
const { newKeyword } = require('./types');
const { KEYWORD_PREFIX } = require('./constants');
const { readline } = require('./node_readline');

let ns = {
  [Symbol.for('+')]: (a, b) =>  a + b,
  [Symbol.for('-')]: (a, b) => a - b,
  [Symbol.for('*')]: (a, b) => a * b,
  [Symbol.for('/')]: (a, b) => a / b,
  [Symbol.for('list')]: () => [...arguments],
  [Symbol.for('list?')]: (form) => form.constructor === Array,
  [Symbol.for('empty?')]: (lst) => lst.length === 0,
  [Symbol.for('count')]: (lst) => lst.length,
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
  [Symbol.for('<')]: (a, b) => a < b,
  [Symbol.for('<=')]: (a, b) => a <= b,
  [Symbol.for('>')]: (a, b) => a > b,
  [Symbol.for('>=')]: (a, b) => a >= b,
  [Symbol.for('pr-str')]: (...args) => {
    args.forEach((arg) => {
      printStr(arg, true);
    });

    return args.join(' ');
  },
  [Symbol.for('str')]: (...args) => args.join(''),
  [Symbol.for('prn')]: (...args) => {
    let str = args.map(repr).map((str) => str.replace(/"/g, '')).join(' ');
    printStr(str, false);

    return null;
  },
  [Symbol.for('println')]: (...args) => {
    let str = args.join(' ');
    printStr(str, true);

    return null;
  },
  [Symbol.for('read-string')]: (...args) => readInput(args),
  [Symbol.for('slurp')]: (filePath) => {
    return fs.readFileSync(filePath, { encoding: 'utf-8' });
  },
  [Symbol.for('atom')]: (value) => new Atom(value),
  [Symbol.for('atom?')]: (form) => form.constructor === Atom,
  [Symbol.for('deref')]: (atom) => atom.value,
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
  },
  [Symbol.for('apply')]: (fn, ...args) => fn.apply(args),
  [Symbol.for('map')]: (fn, lst) => lst.map(fn),
  [Symbol.for('nil?')]: (form) => {
    return form === null || typeof form === 'undefined';
  },
  [Symbol.for('true?')]: (form) => form === true,
  [Symbol.for('false?')]: (form) => form === false,
  [Symbol.for('symbol?')]: (form) => form.constructor === Symbol,
  [Symbol.for('symbol')]: (str) => Symbol.for(str),
  [Symbol.for('keyword')]: (str) =>newKeyword(str),
  [Symbol.for('keyword?')]: (form) => form[0] === KEYWORD_PREFIX,
  [Symbol.for('hash-map')]: (...pairs) => {
    let obj = zip(pairs);
    obj.__isHashmap = true;
    return obj;
  },
  [Symbol.for('hash-map?')]: (obj) => obj.__isHashmap === true,
  [Symbol.for('assoc')]: (hashMap, ...pairs) => {
    return Object.assign({}, hashMap, zip(pairs));
  },
  [Symbol.for('dissoc')]: (hashMap, ...keys) => {
    let newHashMap = Object.assign({}, hashMap);

    keys.forEach((key) => { delete newHashMap[key]; });

    return newHashMap;
  },
  [Symbol.for('get')]: (hashMap, key) => hashMap[key],
  [Symbol.for('contains?')]: (hashMap, key) => !_.isNil(hashMap[key]),
  [Symbol.for('keys')]: (hashMap) => keysForObject(hashMap),
  [Symbol.for('vals')]: (hashMap) => {
    return keysForObject(hashMap).map((key) => hashMap[key]);
  },
  [Symbol.for('readline')]: (prompt) => readline(prompt),
  [Symbol.for('meta')]: (fn) => fn.meta,
  [Symbol.for('with-meta')]: (fn, meta) => cloneFunction(fn, meta),
  [Symbol.for('time')]: () => new Date().getTime(),
  [Symbol.for('push')]: (lst, el) => {
    lst.push(el);
    return lst;
  },
  [Symbol.for('pop')]: (lst) => lst.pop(),
  [Symbol.for('unshift')]: (lst, el) => {
    lst.unshift(el);
    return lst;
  },
  [Symbol.for('shift')]: (lst) => lst.shift(),
  [Symbol.for('string?')]: (obj) => obj.constructor === String,
  [Symbol.for('number?')]: (obj) => obj.constructor === Number,
  [Symbol.for('fn?')]: (obj) => obj.constructor === Function && !obj.isMacro,
  [Symbol.for('macro?')]: (obj) => obj.constructor === Function && obj.isMacro,
  [Symbol.for('seq')]: (obj) => {
    switch (obj.constructor) {
    case Array:
      return obj;
    case String:
      return obj.split('');
    default:
      return null;
    }
  }
};

exports = module.exports = { ns };
