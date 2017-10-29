const { printStr } = require('./printer');

let ns = {
  [Symbol.for('+')]: (a, b) => { return a + b; },
  [Symbol.for('-')]: (a, b) => { return a - b; },
  [Symbol.for('*')]: (a, b) => { return a * b; },
  [Symbol.for('/')]: (a, b) => { return a / b; },
  [Symbol.for('prn')]: (form) => {
    return printStr(form);
  },
  [Symbol.for('list')]: () => {
    return [...arguments];
  },
  [Symbol.for('list?')]: (form) => {
    return form.constructor === Array;
  },
  [Symbol.for('empty?')]: (list) => {
    return list.length === 0;
  },
  [Symbol.for('count')]: (list) => {
    return list.length;
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
  [Symbol.for('>=')]: (a, b) => { return a >= b; }
};

exports = module.exports = { ns };
