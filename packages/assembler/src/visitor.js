import { convertToInstruction, INSTRUCTIONS } from "@emulator/core";

import postProcessor from "./post-processor.js";

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
  r8: 9,
  sp: 10,
  fp: 11
};

const i2s = (instruction, length = 8) =>
  instruction.toString(2).padStart(length, "0");

export default parser => {
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

    reg_lit_hex_char() {
      return [];
    }

    lit_hex_char() {
      return [];
    }

    reg_lit() {
      return [];
    }

    reg_hex() {
      const { HEX_VALUE, REG } = children;

      if (HEX_VALUE) {
        return this.hex(HEX_VALUE[0]);
      }

      return this.register(REG[0]);
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
      const { REG, reg_lit_hex_char } = children;

      if (reg_lit_hex_char[0].children.REG) {
        const { instruction, pattern } = INSTRUCTIONS.MOV_REG_REG;

        const fullInstruction = convertToInstruction(pattern, {
          S: this.register(reg_lit_hex_char[0].children.REG[0]),
          T: this.register(REG[0])
        });

        return [i2s(instruction), i2s(fullInstruction)];
      }

      const value = this.hexOrLitOrChar(reg_lit_hex_char[0].children);

      const { instruction, pattern } = INSTRUCTIONS.MOV_LIT_REG;

      const fullInstruction = convertToInstruction(pattern, {
        T: this.register(REG[0])
      });

      return [i2s(instruction), i2s(fullInstruction), i2s(value, 16)];
    }

    load(ctx) {
      const { children } = ctx;
      const { REG, reg_hex } = children;

      if (reg_hex[0].children.HEX_VALUE) {
        const { instruction, pattern } = INSTRUCTIONS.LOAD_ADR;

        const fullInstruction = convertToInstruction(pattern, {
          T: this.register(REG[0])
        });

        const address = this.hex(reg_hex[0].children.HEX_VALUE[0]);

        return [i2s(instruction), i2s(fullInstruction), i2s(address, 16)];
      }

      const { instruction, pattern } = INSTRUCTIONS.LOAD_REG;

      const fullInstruction = convertToInstruction(pattern, {
        T: this.register(REG[0]),
        S: this.register(reg_hex[0].children.REG[0])
      });

      return [i2s(instruction), i2s(fullInstruction)];
    }

    store(ctx) {
      const { children } = ctx;
      const { reg_lit_hex_char, reg_hex } = children;

      if (reg_hex[0].children.HEX_VALUE) {
        const address = this.hex(reg_hex[0].children.HEX_VALUE[0]);

        if (reg_lit_hex_char[0].children.REG) {
          const { instruction, pattern } = INSTRUCTIONS.STORE_REG_HEX;

          const fullInstruction = convertToInstruction(pattern, {
            S: this.register(reg_lit_hex_char[0].children.REG[0])
          });

          return [i2s(instruction), i2s(fullInstruction), i2s(address, 16)];
        }

        const { instruction } = INSTRUCTIONS.STORE_LIT_HEX;

        const value = this.hexOrLitOrChar(reg_lit_hex_char[0].children);

        return [i2s(instruction), i2s(value, 16), i2s(address, 16)];
      }

      if (reg_lit_hex_char[0].children.REG) {
        const { instruction, pattern } = INSTRUCTIONS.STORE_REG_REG;

        const fullInstruction = convertToInstruction(pattern, {
          S: this.register(reg_lit_hex_char[0].children.REG[0]),
          T: this.register(reg_hex[0].children.REG[0])
        });

        return [i2s(instruction), i2s(fullInstruction)];
      }

      const { instruction, pattern } = INSTRUCTIONS.STORE_LIT_REG;

      const fullInstruction = convertToInstruction(pattern, {
        T: this.register(reg_hex[0].children.REG[0])
      });

      const value = this.hexOrLitOrChar(reg_lit_hex_char[0].children);

      return [i2s(instruction), i2s(fullInstruction), i2s(value, 16)];
    }

    copy(ctx) {
      const { children } = ctx;
      const { reg_hex } = children;

      const first = reg_hex[0].children;
      const second = reg_hex[1].children;

      // Both are HEX
      if (first.HEX_VALUE && second.HEX_VALUE) {
        const { instruction } = INSTRUCTIONS.COPY_MEM_HEX_HEX;

        const from = this.hex(first.HEX_VALUE[0]);
        const to = this.hex(second.HEX_VALUE[0]);

        return [i2s(instruction), i2s(from, 16), i2s(to, 16)];
      }

      // Both are REG
      if (first.REG && second.REG) {
        const { instruction, pattern } = INSTRUCTIONS.COPY_MEM_REG_REG;

        const fullInstruction = convertToInstruction(pattern, {
          S: this.register(first.REG[0]),
          T: this.register(second.REG[0])
        });

        return [i2s(instruction), i2s(fullInstruction)];
      }

      if (first.REG && second.HEX_VALUE) {
        const { instruction, pattern } = INSTRUCTIONS.COPY_MEM_REG_HEX;

        const fullInstruction = convertToInstruction(pattern, {
          S: this.register(first.REG[0])
        });

        const to = this.hex(second.HEX_VALUE[0]);

        return [i2s(instruction), i2s(fullInstruction), i2s(to, 16)];
      }

      const { instruction, pattern } = INSTRUCTIONS.COPY_MEM_HEX_REG;

      const fullInstruction = convertToInstruction(pattern, {
        T: this.register(second.REG[0])
      });

      const from = this.hex(first.HEX_VALUE[0]);

      return [i2s(instruction), i2s(fullInstruction), i2s(from, 16)];
    }

    push(ctx) {
      const { lit_hex_char } = ctx.children;

      if (lit_hex_char[0].children.REG) {
        const { instruction, pattern } = INSTRUCTIONS.PSH_REG;

        const fullInstruction = convertToInstruction(pattern, {
          R: this.register(lit_hex_char[0].children.REG[0])
        });

        return [i2s(instruction), i2s(fullInstruction)];
      }

      const maybeValue = this.hexOrLitOrChar(lit_hex_char[0].children);

      const { instruction } = INSTRUCTIONS.PSH_LIT;

      return [i2s(instruction), i2s(maybeValue, 16)];
    }

    call(ctx) {
      const { LABEL, reg_hex } = ctx.children;

      if (LABEL) {
        const { instruction } = INSTRUCTIONS.CAL_LIT;
        return [i2s(instruction), { type: "address", name: LABEL[0].image }];
      }

      const { HEX_VALUE, REG } = reg_hex[0].children;

      if (HEX_VALUE) {
        const { instruction } = INSTRUCTIONS.CAL_LIT;
        return [i2s(instruction), i2s(this.hex(HEX_VALUE[0]), 16)];
      }

      const { instruction, pattern } = INSTRUCTIONS.CAL_REG;

      const fullInstruction = convertToInstruction(pattern, {
        R: this.register(REG[0])
      });

      // TODO: Load arguments into registers 0-8

      return [i2s(instruction), i2s(fullInstruction)];
    }

    ret() {
      const { instruction } = INSTRUCTIONS.RET;

      return [i2s(instruction)];
    }

    jump_not_equal(ctx) {
      const { LABEL } = ctx.children;

      const { instruction } = INSTRUCTIONS.JMP_NOT_EQ;

      return [i2s(instruction), { type: "address", name: LABEL[0].image }];
    }

    arithmetic(ctx) {
      const { children } = ctx;
      const { reg_lit, REG, ADD, SUB, DIV, MULT, CMP } = children;

      const isReg = !!reg_lit[0].children.REG;

      const opLookup = () => {
        if (isReg) {
          if (ADD) return INSTRUCTIONS.ARITH_ADD_REG;
          if (SUB) return INSTRUCTIONS.ARITH_SUB_REG;
          if (MULT) return INSTRUCTIONS.ARITH_MULT;
          if (DIV) return INSTRUCTIONS.ARITH_DIV_REG;
          if (CMP) return INSTRUCTIONS.CMP_REG_REG;
        }

        if (ADD) return INSTRUCTIONS.ARITH_ADD_LIT;
        if (SUB) return INSTRUCTIONS.ARITH_SUB_LIT;
        if (MULT) return INSTRUCTIONS.ARITH_MULT_LIT;
        if (DIV) return INSTRUCTIONS.ARITH_DIV_LIT;
        if (CMP) return INSTRUCTIONS.CMP_LIT;
      };

      const { instruction, pattern } = opLookup();

      const value = isReg
        ? this.register(reg_lit[0].children.REG[0])
        : this.literal(reg_lit[0].children.LITERAL[0]);

      const fullInstruction = convertToInstruction(pattern, {
        S: isReg ? value : undefined,
        T: this.register(REG[0])
      });

      const extraInstruction = isReg ? [] : [i2s(value, 16)];

      return [i2s(instruction), i2s(fullInstruction), ...extraInstruction];
    }

    binary(ctx) {
      const { children } = ctx;
      const { reg_lit, REG, SRA, SLA, AND, OR, XOR } = children;

      const isReg = !!reg_lit[0].children.REG;

      const opLookup = () => {
        if (isReg) {
          if (SRA) return INSTRUCTIONS.SRA_REG;
          if (SLA) return INSTRUCTIONS.SLA_REG;
          if (AND) return INSTRUCTIONS.AND_REG;
          if (OR) return INSTRUCTIONS.OR_REG;
          if (XOR) return INSTRUCTIONS.XOR_REG;
        }

        if (SRA) return INSTRUCTIONS.SRA_LIT;
        if (SLA) return INSTRUCTIONS.SLA_LIT;
        if (AND) return INSTRUCTIONS.AND_LIT;
        if (OR) return INSTRUCTIONS.OR_LIT;
        if (XOR) return INSTRUCTIONS.XOR_LIT;
      };

      const { instruction, pattern } = opLookup();

      const value = isReg
        ? this.register(reg_lit[0].children.REG[0])
        : this.literal(reg_lit[0].children.LITERAL[0]);

      const fullInstruction = convertToInstruction(pattern, {
        S: isReg ? value : undefined,
        T: this.register(REG[0])
      });

      const extraInstruction = isReg ? [] : [i2s(value, 16)];

      return [i2s(instruction), i2s(fullInstruction), ...extraInstruction];
    }

    statement(ctx) {
      const command = Object.keys(ctx)[0];

      return this[command](ctx[command][0]);
    }

    data() {
      return [];
    }

    method(ctx) {
      const { target, RET } = ctx;

      const label = { type: "key", name: target[0].children.LABEL[0].image };

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

      return [
        { type: "key", name: "main" },
        ...statements,
        ...this.terminate()
      ];
    }

    terminate() {
      return ["00000000"];
    }

    target(ctx) {
      const { LABEL } = ctx.children;
      return [{ type: "key", name: LABEL[0].image }];
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
