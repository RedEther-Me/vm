import chevrotain from "chevrotain";

const { createToken, Lexer } = chevrotain;

// commands
const MOV = createToken({ name: "MOV", pattern: /MOV/ });

const LOAD = createToken({ name: "LOAD", pattern: /LOAD/ });
const STORE = createToken({ name: "STORE", pattern: /STORE/ });
const COPY = createToken({ name: "COPY", pattern: /COPY/ });

const PUSH = createToken({ name: "PUSH", pattern: /PUSH/ });
const POP = createToken({ name: "POP", pattern: /POP/ });

const CALL = createToken({ name: "CALL", pattern: /CALL/ });
const RET = createToken({ name: "RET", pattern: /RET/ });
const JUMP_NOT_EQUAL = createToken({ name: "JUMP_NOT_EQUAL", pattern: /JNE/ });
const JUMP_EQUAL = createToken({ name: "JUMP_EQUAL", pattern: /JE/ });
const JUMP = createToken({ name: "JUMP", pattern: /J/ });

const ADD = createToken({ name: "ADD", pattern: /ADD[U]?/ });
const SUB = createToken({ name: "SUB", pattern: /SUB/ });
const MULT = createToken({ name: "MULT", pattern: /MULT/ });
const DIV = createToken({ name: "DIV", pattern: /DIV/ });
const MOD = createToken({ name: "MOD", pattern: /MOD/ });
const CMP = createToken({ name: "CMP", pattern: /CMP[U]?/ });

const SRA = createToken({ name: "SRA", pattern: /SRA/ });
const SLA = createToken({ name: "SLA", pattern: /SLA/ });
const AND = createToken({ name: "AND", pattern: /AND/ });
const OR = createToken({ name: "OR", pattern: /OR/ });
const XOR = createToken({ name: "XOR", pattern: /XOR/ });

const TERM = createToken({ name: "TERM", pattern: /TERM/ });

const SET_IVT = createToken({ name: "SET_IVT", pattern: /SIVT/ });

const REG = createToken({
  name: "REG",
  pattern: /\$(acc|sp|fp|rip|ip|v1|r[0-8])/
});

const LITERAL = createToken({ name: "LITERAL", pattern: /[\-]?[0-9]+/ });
const HEX_VALUE = createToken({ name: "HEX_VALUE", pattern: /0x[0-9A-Fa-f]+/ });
const CHAR = createToken({
  name: "CHAR",
  pattern: /\'[\\A-Za-z\'"\-,.:;?!@#$%^&*(){}\[\] ]\'/
});
const STRING = createToken({
  name: "STRING",
  pattern: /\"[\\A-Za-z0-9\'"\-,.:;?!@#$%^&*(){}\[\] \s]*\"/
});

// tags
const COLON = createToken({ name: "COLON", pattern: /:/ });
const MAIN = createToken({ name: "MAIN", pattern: /main/ });
const DATA = createToken({ name: "DATA", pattern: /\.data/ });
const CODE = createToken({ name: "CODE", pattern: /\.code/ });
const DT_ASCII = createToken({
  name: "DT_ASCII",
  pattern: /\.ascii/
});
const DT_BYTE = createToken({
  name: "DT_BYTE",
  pattern: /\.byte/
});
const DT_SPACE = createToken({
  name: "DT_SPACE",
  pattern: /\.space/
});
const DT_WORD = createToken({
  name: "DT_WORD",
  pattern: /\.word/
});
const GLOBAL = createToken({
  name: "GLOBAL",
  pattern: /\.global/
});

const LABEL = createToken({ name: "LABEL", pattern: /[a-zA-Z]+[a-zA-Z0-9_]*/ });

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

export const orderedTokens = [
  WhiteSpace,
  COMMENT,
  MOV,
  LOAD,
  STORE,
  COPY,
  PUSH,
  POP,
  CALL,
  RET,
  JUMP_NOT_EQUAL,
  JUMP_EQUAL,
  JUMP,
  ADD,
  SUB,
  MULT,
  DIV,
  MOD,
  CMP,
  SRA,
  SLA,
  AND,
  OR,
  XOR,
  TERM,
  SET_IVT,
  REG,
  HEX_VALUE,
  CHAR,
  STRING,
  LITERAL,
  COLON,
  MAIN,
  DATA,
  CODE,
  DT_ASCII,
  DT_BYTE,
  DT_SPACE,
  DT_WORD,
  GLOBAL,
  LABEL
];

export const allTokens = orderedTokens.reduce(
  (acc, item) => ({ ...acc, [item.name]: item }),
  {}
);
