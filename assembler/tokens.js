const { createToken, Lexer } = require("chevrotain");

// commands
const MOV = createToken({ name: "MOV", pattern: /MOV/ });

const LOAD = createToken({ name: "LOAD", pattern: /LOAD/ });
const STORE = createToken({ name: "STORE", pattern: /STORE/ });
const COPY = createToken({ name: "COPY", pattern: /COPY/ });

const PUSH = createToken({ name: "PUSH", pattern: /PUSH/ });

const CALL = createToken({ name: "CALL", pattern: /CALL/ });
const RET = createToken({ name: "RET", pattern: /RET/ });

const ADD = createToken({ name: "ADD", pattern: /ADD/ });
const SUB = createToken({ name: "SUB", pattern: /SUB/ });

const TERM = createToken({ name: "TERM", pattern: /TERM/ });

const REG = createToken({ name: "REG", pattern: /r[0-8]/ });

const LITERAL = createToken({ name: "LITERAL", pattern: /[0-9]+/ });
const HEX_VALUE = createToken({ name: "HEX_VALUE", pattern: /0x[0-9A-Fa-f]+/ });
const CHAR = createToken({
  name: "CHAR",
  pattern: /\'[\\A-Za-z\'",.:;?!@#$%^&*(){}\[\] ]\'/
});

// tags
const COLON = createToken({ name: "COLON", pattern: /:/ });
const MAIN = createToken({ name: "MAIN", pattern: /main/ });
const DATA = createToken({ name: "DATA", pattern: /data/ });
const LABEL = createToken({ name: "LABEL", pattern: /[a-zA-Z]+[a-zA-Z0-9]*/ });

const COMMENT = createToken({
  name: "COMMENT",
  pattern: /##.*/,
  group: Lexer.SKIPPED
});

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

const orderedTokens = [
  WhiteSpace,
  COMMENT,
  MOV,
  LOAD,
  STORE,
  COPY,
  PUSH,
  CALL,
  RET,
  ADD,
  SUB,
  TERM,
  REG,
  HEX_VALUE,
  CHAR,
  LITERAL,
  COLON,
  MAIN,
  DATA,
  LABEL
];

module.exports = {
  allTokens: orderedTokens.reduce(
    (acc, item) => ({ ...acc, [item.name]: item }),
    {}
  ),
  orderedTokens
};
