const chalk = require("chalk");

const { convertToInstruction } = require("../helpers");

const INSTRUCTIONS = require("../emulator/instructions");

const postProcessor = require("./post-processor");

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

const i2s = (instruction, length = 8) =>
  instruction.toString(2).padStart(length, "0");

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

    hex(ctx) {
      return parseInt(ctx.image, 16);
    }

    char(ctx) {
      if (ctx.image[1] === "\\") {
        return ctx.image.charCodeAt(2);
      }

      return ctx.image.charCodeAt(1);
    }

    hexOrLitOrChar(children) {
      const { HEX_VALUE, LITERAL, CHAR } = children;
      if (HEX_VALUE) {
        return this.hex(HEX_VALUE[0]);
      }

      if (CHAR) {
        return this.char(CHAR[0]);
      }

      return this.literal(LITERAL[0]);
    }

    register(ctx) {
      const name = ctx.image;
      return registerLookup[name];
    }

    mov(ctx) {
      const { children } = ctx;
      const { REG } = children;

      const value = this.hexOrLitOrChar(children);

      const { instruction, pattern } = INSTRUCTIONS.MOV_LIT_REG;

      const fullInstruction = convertToInstruction(pattern, {
        R: this.register(REG[0])
      });

      return [i2s(instruction), i2s(fullInstruction), i2s(value, 16)];
    }

    mem(ctx) {
      const { children } = ctx;
      const { HEX_VALUE, REG } = children;

      const { instruction, pattern } = INSTRUCTIONS.MOV_REG_MEM;

      const fullInstruction = convertToInstruction(pattern, {
        R: this.register(REG[0])
      });

      const address = this.hex(HEX_VALUE[0]);

      return [i2s(instruction), i2s(fullInstruction), i2s(address, 16)];
    }

    arithmetic(ctx) {
      const { children } = ctx;
      const { REG, ADD, SUB, DIV, MULT } = children;

      const { instruction, pattern } = INSTRUCTIONS.ARITHMETIC;

      const opLookup = () => {
        if (ADD) return 0;
        if (SUB) return 1;
        if (DIV) return 2;
        if (MULT) return 3;
      };

      const fullInstruction = convertToInstruction(pattern, {
        S: this.register(REG[0]),
        T: this.register(REG[1]),
        O: opLookup()
      });

      return [i2s(instruction), i2s(fullInstruction)];
    }

    statement(ctx) {
      const command = Object.keys(ctx)[0];

      return this[command](ctx[command][0]);
    }

    method(ctx) {
      return [];
    }

    main(ctx) {
      const statements = ctx.statement.reduce(
        (acc, statement) => [...acc, ...this.visit(statement)],
        []
      );

      return [{ type: "key", name: "main" }, ...statements];
    }

    terminate() {
      return ["00000000"];
    }

    program(ctx) {
      const main = this.visit(ctx.main);

      const terminate = this.visit(ctx.terminate);

      const preprocess = [...main, ...terminate];
      const postprocess = postProcessor(preprocess);
      return postprocess.join("");
    }
  }

  return myCustomVisitor;
};
