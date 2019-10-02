const { CstParser } = require("chevrotain");

const allTokens = require("./tokens");

class AsmParser extends CstParser {
  constructor() {
    super(Object.values(allTokens));

    const $ = this;

    $.RULE("terminate", () => {
      $.CONSUME(allTokens.TERM);
    });

    $.RULE("mov", () => {
      $.CONSUME(allTokens.MOV);
      $.CONSUME(allTokens.LITERAL);
      $.CONSUME(allTokens.REGISTER);
    });

    $.RULE("arithmetic", () => {
      $.OR([
        { ALT: () => $.CONSUME(allTokens.ADD) },
        { ALT: () => $.CONSUME(allTokens.SUB) }
      ]);
      $.CONSUME1(allTokens.REGISTER);
      $.CONSUME2(allTokens.REGISTER);
    });

    $.RULE("statement", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.mov) },
        { ALT: () => $.SUBRULE($.arithmetic) }
      ]);
    });

    $.RULE("program", () => {
      $.MANY(() => $.SUBRULE($.statement));
      $.SUBRULE($.terminate);
    });

    this.performSelfAnalysis();
  }
}

module.exports = AsmParser;
