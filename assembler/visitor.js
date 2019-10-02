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

const shift2 = 4;
const shift3 = 8;
const shift4 = 16;
const shift5 = 32;
const shift6 = 64;
const shift7 = 128;
const shift8 = 256;

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

      const instruction = INSTRUCTIONS.MOV_LIT_REG;
      const value = this.literal(LITERAL[0]) * shift8;
      const register = this.register(REG[0]) * shift2;

      const fullInstruction = instruction + value + register;
      return fullInstruction.toString(2).padStart(16, "0");
    }

    arithmatic(ctx) {
      const { children } = ctx;
      const { REG, ADD, SUB, DIV, MULT } = children;

      const opLookup = () => {
        if (ADD) return 0;
        if (SUB) return 1;
        if (DIV) return 2;
        if (MULT) return 3;
      };

      const instruction = INSTRUCTIONS.ARITHMATIC;
      const register1 = this.register(REG[0]) * shift2;
      const register2 = this.register(REG[1]) * shift4;

      const operation = opLookup() * shift6;

      const fullInstruction = instruction + register1 + register2 + operation;
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
