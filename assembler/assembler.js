const { Lexer } = require("chevrotain");

const allTokens = require("./tokens");
const Parser = require("./parser");
const createVisitor = require("./visitor");

const parser = new Parser();

module.exports = async input => {
  const tokenizer = new Lexer(Object.values(allTokens));
  const lexingResult = tokenizer.tokenize(input);

  parser.input = lexingResult.tokens;
  const cst = parser.program();

  if (parser.errors && parser.errors.length) {
    throw new Error("found errors in parser", parser.errors);
  }

  const VisitorClass = createVisitor(parser);
  const visitor = new VisitorClass();

  const ast = visitor.visit(cst);

  return ast;
};
