import chevrotain from "chevrotain";

import { orderedTokens } from "../tokens.js";
import Parser from "../parser.js";
import createVisitor from "./visitor.js";

const { Lexer } = chevrotain;

const parser = new Parser();

export default async input => {
  const tokenizer = new Lexer(orderedTokens);
  const lexingResult = tokenizer.tokenize(input);

  parser.input = lexingResult.tokens;
  const cst = parser.program();

  if (parser.errors && parser.errors.length) {
    console.log(parser.errors);
    throw new Error("found errors in parser", parser.errors);
  }

  const VisitorClass = createVisitor(parser);
  const visitor = new VisitorClass();

  const ast = visitor.visit(cst);

  return ast;
};
