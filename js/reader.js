const _ = require('lodash');
const { Keyword, Vector, HashMap } = require('./types');
const { zip } = require('./util');

class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    let token = this.tokens[this.position];
    this.position += 1;
    return token;
  }
}

function readInput(str) {
  let tokens = tokenize(str);
  let reader = new Reader(tokens);
  return readForm(reader);
}

function tokenize(str) {
  let re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/g;
  let results = [];
  let match;

  while ((match = re.exec(str)[1]) != '') {
    if (match[0] === ';') { continue; }
    results.push(match);
  }

  return results;
}

function readForm(reader) {
  let token = reader.peek();

  if (_.isNil(token)) {
    return null;
  }

  switch (token) {
  case '(':
    return readList(reader);
  case '[':
    return readVector(reader);
  case '{':
    return readHashMap(reader);
  default:
    return readAtom(reader);
  }
}

function readSequence(reader, start = '(', end = ')') {
  let token = reader.next();
  let list = [];

  if (token !== start) {
    throw new Error("Expected '(");
  }

  while ((token = reader.peek()) !== end) {
    if (!token) {
      let errorMsg = `Expected '${end}', got EOF`;
      console.log(errorMsg);
      throw new Error(errorMsg);
    }

    list.push(readForm(reader));
  }

  token = reader.next();

  return list;
}

function readList(reader) {
  return readSequence(reader);
}

function readString(reader) {
  return readSequence(reader, '"', '"');
}

function readVector(reader) {
  return new Vector(readSequence(reader, '[', ']'));
}

function readHashMap(reader) {
  return new HashMap(zip(readSequence(reader, '{', '}')));
}

function readAtom(reader) {
  let token = reader.next();

  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token, 10);
  } else if (token.match(/^-?[0-9]+([eE]-?[0-9+])?\.([0-9]+|[eE]-?[0-9]+)/)) {
    return parseFloat(token, 10);
  } else if (token[0] === '"') {
    return token.slice(1, token.length - 1).replace(/\\(.)/g, (_, char) => {
      return char === 'n' ? "\n" : char;
    });
  } else if (token[0] === ':') {
    return new Keyword(token);
  } else if (token[0] === ';') {
    return null;
  } else if (token === 'nil') {
    return null;
  } else if (token === 'true') {
    return true;
  } else if (token === 'false') {
    return false;
  } else { // symbol
    return Symbol.for(token);
  }
}

exports = module.exports = { readInput };
