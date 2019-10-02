const { createToken, Lexer } = require("chevrotain");

// commands
const MOV = createToken({ name: "MOV", pattern: /MOV/ });
const ADD = createToken({ name: "ADD", pattern: /ADD/ });
const SUB = createToken({ name: "SUB", pattern: /SUB/ });
const TERM = createToken({ name: "TERM", pattern: /TERM/ });

const REGISTER = createToken({ name: "REG", pattern: /r[0-8]/ });

const LITERAL = createToken({ name: "LITERAL", pattern: /[0-9]+/ });

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

module.exports = { WhiteSpace, MOV, ADD, SUB, TERM, REGISTER, LITERAL };
