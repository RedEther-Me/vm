import chevrotain from "chevrotain";

import { allTokens } from "./tokens.js";

const { CstParser } = chevrotain;

class AsmParser extends CstParser {
  constructor() {
    super(Object.values(allTokens));

    const $ = this;

    $.RULE("reg_lit_hex_char", () => {
      $.OR([
        { ALT: () => $.CONSUME(allTokens.REG) },
        { ALT: () => $.CONSUME(allTokens.LITERAL) },
        { ALT: () => $.CONSUME(allTokens.HEX_VALUE) },
        { ALT: () => $.CONSUME(allTokens.CHAR) }
      ]);
    });

    $.RULE("lit_hex_char", () => {
      $.OR([
        { ALT: () => $.CONSUME(allTokens.LITERAL) },
        { ALT: () => $.CONSUME(allTokens.HEX_VALUE) },
        { ALT: () => $.CONSUME(allTokens.CHAR) }
      ]);
    });

    $.RULE("reg_hex", () => {
      $.OR([
        { ALT: () => $.CONSUME(allTokens.REG) },
        { ALT: () => $.CONSUME(allTokens.HEX_VALUE) }
      ]);
    });

    $.RULE("reg_lit", () => {
      $.OR([
        { ALT: () => $.CONSUME(allTokens.REG) },
        { ALT: () => $.CONSUME(allTokens.LITERAL) }
      ]);
    });

    $.RULE("terminate", () => {
      $.CONSUME(allTokens.TERM);
    });

    $.RULE("mov", () => {
      $.CONSUME(allTokens.MOV);
      $.SUBRULE($.reg_lit_hex_char);
      $.CONSUME(allTokens.REG);
    });

    $.RULE("load", () => {
      $.CONSUME(allTokens.LOAD);
      $.SUBRULE($.reg_hex);
      $.CONSUME2(allTokens.REG);
    });

    $.RULE("store", () => {
      $.CONSUME(allTokens.STORE);
      $.SUBRULE($.reg_lit_hex_char);
      $.SUBRULE($.reg_hex);
    });

    $.RULE("copy", () => {
      $.CONSUME(allTokens.COPY);
      $.SUBRULE1($.reg_hex);
      $.SUBRULE2($.reg_hex);
    });

    $.RULE("push", () => {
      $.CONSUME(allTokens.PUSH);
      $.SUBRULE($.lit_hex_char);
    });

    $.RULE("call", () => {
      $.CONSUME(allTokens.CALL);
      $.OR([
        { ALT: () => $.CONSUME(allTokens.LABEL) },
        { ALT: () => $.SUBRULE2($.reg_hex) }
      ]);
    });

    $.RULE("arithmetic", () => {
      $.OR([
        { ALT: () => $.CONSUME(allTokens.ADD) },
        { ALT: () => $.CONSUME(allTokens.SUB) },
        { ALT: () => $.CONSUME(allTokens.MULT) },
        { ALT: () => $.CONSUME(allTokens.DIV) }
      ]);
      $.SUBRULE1($.reg_lit);
      $.CONSUME2(allTokens.REG);
    });

    $.RULE("statement", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.mov) },
        { ALT: () => $.SUBRULE($.load) },
        { ALT: () => $.SUBRULE($.store) },
        { ALT: () => $.SUBRULE($.copy) },
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

export default AsmParser;
