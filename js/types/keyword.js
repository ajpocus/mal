class Keyword extends String {
  constructor(str) {
    str = String.fromCharCode(0x29e) + str.slice(1);
    super(str);
  }
}

exports = module.exports = Keyword;
