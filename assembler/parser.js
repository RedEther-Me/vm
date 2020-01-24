const { CstParser } = require("chevrotain");

const { allTokens } = require("./tokens");

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
      $.CONSUME(allTokens.REG);
    });

    $.RULE("mem", () => {
      $.CONSUME(allTokens.MEM);
      $.CONSUME(allTokens.HEX_VALUE);
      $.CONSUME(allTokens.REG);
    });

    $.RULE("push", () => {
      $.CONSUME(allTokens.PUSH);
      $.OR([
        { ALT: () => $.CONSUME(allTokens.LITERAL) },
        { ALT: () => $.CONSUME(allTokens.HEX_VALUE) },
        { ALT: () => $.CONSUME(allTokens.CHAR) }
      ]);
    });

    $.RULE("call", () => {
      $.CONSUME(allTokens.CALL);
      $.OR([
        { ALT: () => $.CONSUME(allTokens.LABEL) },
        { ALT: () => $.CONSUME(allTokens.HEX_VALUE) },
        { ALT: () => $.CONSUME(allTokens.REG) }
      ]);
    });

    $.RULE("arithmetic", () => {
      $.OR([
        { ALT: () => $.CONSUME(allTokens.ADD) },
        { ALT: () => $.CONSUME(allTokens.SUB) }
      ]);
      $.CONSUME1(allTokens.REG);
      $.CONSUME2(allTokens.REG);
    });

    $.RULE("statement", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.mov) },
        { ALT: () => $.SUBRULE($.mem) },
        { ALT: () => $.SUBRULE($.push) },
        { ALT: () => $.SUBRULE($.call) },
        { ALT: () => $.SUBRULE($.arithmetic) },
        { ALT: () => $.SUBRULE($.terminate) }
      ]);
    });

    $.RULE("method", () => {
      $.CONSUME(allTokens.LABEL);
      $.CONSUME(allTokens.COLON);
      $.MANY(() => $.SUBRULE($.statement));
      $.CONSUME(allTokens.RET);
    });

    $.RULE("data", () => {
      $.CONSUME(allTokens.DATA);
      $.CONSUME(allTokens.COLON);
    });

    $.RULE("main", () => {
      $.CONSUME(allTokens.MAIN);
      $.CONSUME(allTokens.COLON);
      $.MANY(() => $.SUBRULE($.statement));
    });

    $.RULE("program", () => {
      $.OPTION(() => {
        $.SUBRULE($.data);
      });
      $.SUBRULE($.main);
      $.MANY(() => $.SUBRULE($.method));
    });

    this.performSelfAnalysis();
  }
}

module.exports = AsmParser;
