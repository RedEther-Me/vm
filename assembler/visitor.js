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

    load(ctx) {
      const { children } = ctx;
      const { HEX_VALUE, REG } = children;

      const { instruction, pattern } = INSTRUCTIONS.MOV_MEM_REG;

      const fullInstruction = convertToInstruction(pattern, {
        R: this.register(REG[0])
      });

      const address = this.hex(HEX_VALUE[0]);

      return [i2s(instruction), i2s(fullInstruction), i2s(address, 16)];
    }

    store(ctx) {
      const { children } = ctx;
      const { REG, HEX_VALUE } = children;

      if (REG && REG[0]) {
        const { instruction, pattern } = INSTRUCTIONS.MOV_REG_MEM;

        const fullInstruction = convertToInstruction(pattern, {
          R: this.register(REG[0])
        });

        const address = this.hex(HEX_VALUE[0]);

        return [i2s(instruction), i2s(fullInstruction), i2s(address, 16)];
      }

      const { LITERAL, CHAR } = children;

      const hasAltHex = HEX_VALUE.length > 1;
      const ALT_HEX = hasAltHex ? [HEX_VALUE[0]] : undefined;

      const { instruction } = INSTRUCTIONS.MOV_LIT_MEM;
      const value = this.hexOrLitOrChar({ LITERAL, CHAR, HEX_VALUE: ALT_HEX });

      const address = this.hex(hasAltHex ? HEX_VALUE[1] : HEX_VALUE[0]);

      return [i2s(instruction), i2s(value, 16), i2s(address, 16)];
    }

    copy(ctx) {
      const { children } = ctx;
      const { HEX_VALUE } = children;

      const { instruction } = INSTRUCTIONS.MOV_COPY_MEM;

      const from = this.hex(HEX_VALUE[0]);
      const to = this.hex(HEX_VALUE[1]);

      return [i2s(instruction), i2s(from, 16), i2s(to, 16)];
    }

    push(ctx) {
      const { REG } = ctx.children;

      if (REG) {
        const { instruction, pattern } = INSTRUCTIONS.PSH_REG;

        const fullInstruction = convertToInstruction(pattern, {
          R: this.register(REG[0])
        });

        return [i2s(instruction), i2s(fullInstruction)];
      }

      const maybeValue = this.hexOrLitOrChar(ctx.children);

      const { instruction } = INSTRUCTIONS.PSH_LIT;

      return [i2s(instruction), i2s(maybeValue, 16)];
    }

    call(ctx) {
      const { REG, LABEL, HEX_VALUE } = ctx.children;

      if (LABEL) {
        const { instruction } = INSTRUCTIONS.CAL_LIT;
        return [i2s(instruction), { type: "address", name: LABEL[0].image }];
      }

      if (HEX_VALUE) {
        const { instruction } = INSTRUCTIONS.CAL_LIT;
        return [i2s(instruction), i2s(this.hex(HEX_VALUE[0]), 16)];
      }

      const { instruction, pattern } = INSTRUCTIONS.CAL_REG;

      const fullInstruction = convertToInstruction(pattern, {
        R: this.register(REG[0])
      });

      return [i2s(instruction), i2s(fullInstruction)];
    }

    ret() {
      const { instruction } = INSTRUCTIONS.RET;

      return [i2s(instruction)];
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

    data() {
      return [];
    }

    method(ctx) {
      const { LABEL, RET } = ctx;

      const label = { type: "key", name: LABEL[0].image };

      const statements = (ctx.statement || []).reduce(
        (acc, statement) => [...acc, ...this.visit(statement)],
        []
      );

      const ret = this.ret(RET[0]);

      return [label, ...statements, ...ret];
    }

    main(ctx) {
      const statements = (ctx.statement || []).reduce(
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

      const methods = (ctx.method || []).reduce(
        (acc, method) => [...acc, ...this.visit(method)],
        []
      );

      const preprocess = [...main, ...methods];
      const postprocess = postProcessor(preprocess);
      return postprocess.join("");
    }
  }

  return myCustomVisitor;
};
