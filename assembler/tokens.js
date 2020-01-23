const { createToken, Lexer } = require("chevrotain");

// commands
const MOV = createToken({ name: "MOV", pattern: /MOV/ });
const MEM = createToken({ name: "MEM", pattern: /MEM/ });
const ADD = createToken({ name: "ADD", pattern: /ADD/ });
const SUB = createToken({ name: "SUB", pattern: /SUB/ });
const TERM = createToken({ name: "TERM", pattern: /TERM/ });

const REGISTER = createToken({ name: "REG", pattern: /r[0-8]/ });

const LITERAL = createToken({ name: "LITERAL", pattern: /[0-9]+/ });
const HEX_VALUE = createToken({ name: "HEX_VALUE", pattern: /0x[0-9A-Fa-f]+/ });
const CHAR = createToken({
  name: "CHAR",
  pattern: /\'[\\A-Za-z\'",.:;?!@#$%^&*(){}\[\] ]\'/
});

// tags
const MAIN = createToken({ name: "MAIN", pattern: /main:/ });
const DATA = createToken({ name: "DATA", pattern: /data:/ });
const LABEL = createToken({ name: "LABEL", pattern: /[a-zA-Z]+[a-zA-Z0-9]*:/ });

const COMMENT = createToken({
  name: "COMMENT",
  pattern: /##[.]*\n/,
  group: Lexer.SKIPPED
});

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

module.exports = {
  WhiteSpace,
  COMMENT,
  MOV,
  MEM,
  ADD,
  SUB,
  TERM,
  REGISTER,
  HEX_VALUE,
  CHAR,
  LITERAL,
  MAIN,
  DATA,
  LABEL
};
