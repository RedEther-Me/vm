const chalk = require("chalk");

const { convertToInstruction } = require("../helpers");

const INSTRUCTIONS = require("../emulator/instructions");

const registerLookup = {
  ip: 0,
  acc: 1,
  r1: 2,
  r2: 3,
  r3: 4,
  r4: 5,
  r5: 6,
  r6: 7,
  r7: 8,
  r8: 9
};

module.exports = parser => {
  const BaseAsmVisitor = parser.getBaseCstVisitorConstructor();

  class myCustomVisitor extends BaseAsmVisitor {
    constructor() {
      super();

      this.validateVisitor();
    }

    terminate(ctx) {
      return {};
    }

    literal(ctx) {
      return parseInt(ctx.image, 10);
    }

    register(ctx) {
      const name = ctx.image;
      return registerLookup[name];
    }

    mov(ctx) {
      const { children } = ctx;
      const { LITERAL, REG } = children;

      const fullInstruction = convertToInstruction(
        INSTRUCTIONS.MOV_LIT_REG.pattern,
        {
          I: INSTRUCTIONS.MOV_LIT_REG.instruction,
          R: this.register(REG[0]),
          V: this.literal(LITERAL[0])
        }
      );

      return fullInstruction.toString(2).padStart(16, "0");
    }

    arithmetic(ctx) {
      const { children } = ctx;
      const { REG, ADD, SUB, DIV, MULT } = children;

      const opLookup = () => {
        if (ADD) return 0;
        if (SUB) return 1;
        if (DIV) return 2;
        if (MULT) return 3;
      };

      const fullInstruction = convertToInstruction(
        INSTRUCTIONS.ARITHMETIC.pattern,,
        {
          I: INSTRUCTIONS.ARITHMETIC.instruction,
          S: this.register(REG[0]),
          T: this.register(REG[1]),
          O: opLookup()
        }
      );

      return fullInstruction.toString(2).padStart(16, "0");
    }

    statement(ctx) {
      const command = Object.keys(ctx)[0];

      return this[command](ctx[command][0]);
    }

    program(ctx) {
      const statements = ctx.statement.map(statement => this.visit(statement));
      return [...statements, "0000000000000000"].join("\n");
    }
  }

  return myCustomVisitor;
};
