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
      $.OR([
        { ALT: () => $.CONSUME(allTokens.LITERAL) },
        { ALT: () => $.CONSUME(allTokens.HEX_VALUE) },
        { ALT: () => $.CONSUME(allTokens.CHAR) }
      ]);
      $.CONSUME(allTokens.REGISTER);
    });

    $.RULE("mem", () => {
      $.CONSUME(allTokens.MEM);
      $.CONSUME(allTokens.HEX_VALUE);
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
        { ALT: () => $.SUBRULE($.mem) },
        { ALT: () => $.SUBRULE($.arithmetic) }
      ]);
    });

    $.RULE("method", () => {
      $.CONSUME(allTokens.LABEL);
      $.MANY(() => $.SUBRULE($.statement));
    });

    $.RULE("main", () => {
      $.CONSUME(allTokens.MAIN);
      $.MANY(() => $.SUBRULE($.statement));
    });

    $.RULE("program", () => {
      $.OPTION(() => {
        $.CONSUME(allTokens.DATA);
      });
      $.SUBRULE($.main);
      $.SUBRULE($.terminate);
    });

    this.performSelfAnalysis();
  }
}

module.exports = AsmParser;
