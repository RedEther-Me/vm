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
  fp: 11,
  rip: 12
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

    label(ctx) {
      const { LABEL } = ctx.children;

      return {
        value: { type: "address", name: LABEL[0].image },
        isLabel: true
      };
    }

    literal(ctx) {
      const test = parseInt(ctx.image, 10);

      if (test < 0) {
        return { value: (test >>> 0) & 0xffff, isLiteral: true };
      }

      return { value: test, isLiteral: true };
    }

    hex(ctx) {
      return { value: parseInt(ctx.image, 16), isHex: true };
    }

    char(ctx) {
      if (ctx.image[1] === "\\") {
        return ctx.image.charCodeAt(2);
      }

      return ctx.image.charCodeAt(1);
    }

    reg_lit_hex_char_label(ctx) {
      const { LABEL } = ctx.children;

      if (LABEL) {
        return this.label(ctx);
      }

      return this.reg_lit_hex_char(ctx);
    }

    reg_lit_hex_char(ctx) {
      const { REG } = ctx.children;

      if (REG) {
        return this.register(ctx);
      }

      return this.lit_hex_char(ctx);
    }

    lit_hex_char(ctx) {
      const { HEX_VALUE, LITERAL, CHAR } = ctx.children;
      if (HEX_VALUE) {
        return this.hex(HEX_VALUE[0]);
      }

      if (CHAR) {
        return { value: this.char(CHAR[0]), isChar: true };
      }

      return this.literal(LITERAL[0]);
    }

    reg_lit(ctx) {
      const { LITERAL } = ctx.children;

      if (LITERAL) {
        return this.literal(LITERAL[0]);
      }

      return this.register(ctx);
    }

    reg_hex_label(ctx) {
      const { LABEL } = ctx.children;

      if (LABEL) {
        return {
          value: { type: "address", name: LABEL[0].image },
          isLabel: true
        };
      }
    }

    reg_hex(ctx) {
      const { HEX_VALUE } = ctx.children;

      if (HEX_VALUE) {
        return this.hex(HEX_VALUE[0]);
      }

      return this.register(ctx);
    }

    register(ctx) {
      const { REG } = ctx.children;
      const { image: name } = REG[0];
      return { value: registerLookup[name], isRegister: true };
    }

    mov(ctx) {
      const { children } = ctx;
      const { reg_lit_hex_char_label } = children;

      const {
        isLabel,
        isRegister,
        value: sourceValue
      } = this.reg_lit_hex_char_label(reg_lit_hex_char_label[0]);

      if (isRegister) {
        const { instruction, pattern } = INSTRUCTIONS.MOV_REG_REG;

        const fullInstruction = convertToInstruction(pattern, {
          S: sourceValue,
          T: this.register(ctx).value
        });

        return [i2s(instruction), i2s(fullInstruction)];
      }

      const { instruction, pattern } = INSTRUCTIONS.MOV_LIT_REG;

      const fullInstruction = convertToInstruction(pattern, {
        T: this.register(ctx).value
      });

      return [
        i2s(instruction),
        i2s(fullInstruction),
        isLabel ? sourceValue : i2s(sourceValue, 16)
      ];
    }

    load(ctx) {
      const { children } = ctx;
      const { reg_hex } = children;

      const { isHex, value } = this.reg_hex(reg_hex[0]);

      if (isHex) {
        const { instruction, pattern } = INSTRUCTIONS.LOAD_ADR;

        const fullInstruction = convertToInstruction(pattern, {
          T: this.register(ctx).value
        });

        return [i2s(instruction), i2s(fullInstruction), i2s(value, 16)];
      }

      const { instruction, pattern } = INSTRUCTIONS.LOAD_REG;

      const fullInstruction = convertToInstruction(pattern, {
        T: this.register(ctx).value,
        S: value
      });

      return [i2s(instruction), i2s(fullInstruction)];
    }

    store(ctx) {
      const { children } = ctx;
      const { reg_lit_hex_char, reg_hex } = children;

      const {
        isRegister: sourceIsReg,
        value: sourceValue
      } = this.reg_lit_hex_char(reg_lit_hex_char[0]);

      const { isHex: targetIsHex, value: targetValue } = this.reg_hex(
        reg_hex[0]
      );

      if (targetIsHex) {
        if (sourceIsReg) {
          const { instruction, pattern } = INSTRUCTIONS.STORE_REG_HEX;

          const fullInstruction = convertToInstruction(pattern, {
            S: sourceValue
          });

          return [i2s(instruction), i2s(fullInstruction), i2s(targetValue, 16)];
        }

        const { instruction } = INSTRUCTIONS.STORE_LIT_HEX;

        return [i2s(instruction), i2s(sourceValue, 16), i2s(targetValue, 16)];
      }

      if (sourceIsReg) {
        const { instruction, pattern } = INSTRUCTIONS.STORE_REG_REG;

        const fullInstruction = convertToInstruction(pattern, {
          S: sourceValue,
          T: targetValue
        });

        return [i2s(instruction), i2s(fullInstruction)];
      }

      const { instruction, pattern } = INSTRUCTIONS.STORE_LIT_REG;

      const fullInstruction = convertToInstruction(pattern, {
        T: targetValue
      });

      return [i2s(instruction), i2s(fullInstruction), i2s(sourceValue, 16)];
    }

    copy(ctx) {
      const { children } = ctx;
      const { reg_hex } = children;

      const {
        isHex: sourceIsHex,
        isRegister: sourceIsReg,
        value: sourceValue
      } = this.reg_hex(reg_hex[0]);
      const {
        isHex: targetIsHex,
        isRegister: targetIsReg,
        value: targetValue
      } = this.reg_hex(reg_hex[1]);

      // Both are HEX
      if (sourceIsHex && targetIsHex) {
        const { instruction } = INSTRUCTIONS.COPY_HEX_HEX;

        return [i2s(instruction), i2s(sourceValue, 16), i2s(targetValue, 16)];
      }

      // Both are REG
      if (sourceIsReg && targetIsReg) {
        const { instruction, pattern } = INSTRUCTIONS.COPY_REG_REG;

        const fullInstruction = convertToInstruction(pattern, {
          S: sourceValue,
          T: targetValue
        });

        return [i2s(instruction), i2s(fullInstruction)];
      }

      if (sourceIsReg && targetIsHex) {
        const { instruction, pattern } = INSTRUCTIONS.COPY_REG_HEX;

        const fullInstruction = convertToInstruction(pattern, {
          S: sourceValue
        });

        return [i2s(instruction), i2s(fullInstruction), i2s(targetValue, 16)];
      }

      const { instruction, pattern } = INSTRUCTIONS.COPY_HEX_REG;

      const fullInstruction = convertToInstruction(pattern, {
        T: targetValue
      });

      return [i2s(instruction), i2s(fullInstruction), i2s(sourceValue, 16)];
    }

    push(ctx) {
      const { reg_lit_hex_char } = ctx.children;

      const { isRegister, value } = this.reg_lit_hex_char(reg_lit_hex_char[0]);

      if (isRegister) {
        const { instruction, pattern } = INSTRUCTIONS.PSH_REG;

        const fullInstruction = convertToInstruction(pattern, {
          R: value
        });

        return [i2s(instruction), i2s(fullInstruction)];
      }

      const { instruction } = INSTRUCTIONS.PSH_LIT;

      return [i2s(instruction), i2s(value, 16)];
    }

    pop(ctx) {
      const { instruction, pattern } = INSTRUCTIONS.POP;

      const fullInstruction = convertToInstruction(pattern, {
        R: this.register(ctx).value
      });

      return [i2s(instruction), i2s(fullInstruction)];
    }

    call(ctx) {
      const { reg_hex_label } = ctx.children;

      const { isLabel, isHex, value } = this.reg_hex_label(reg_hex_label[0]);

      if (isLabel) {
        const { instruction } = INSTRUCTIONS.CAL_LIT;
        return [i2s(instruction), value];
      }

      if (isHex) {
        const { instruction } = INSTRUCTIONS.CAL_LIT;

        return [i2s(instruction), i2s(value, 16)];
      }

      const { instruction, pattern } = INSTRUCTIONS.CAL_REG;

      const fullInstruction = convertToInstruction(pattern, {
        R: value
      });

      return [i2s(instruction), i2s(fullInstruction)];
    }

    ret() {
      const { instruction } = INSTRUCTIONS.RET;

      return [i2s(instruction)];
    }

    jump_not_equal(ctx) {
      const { value } = this.label(ctx);

      const { instruction } = INSTRUCTIONS.JMP_NOT_EQ;

      return [i2s(instruction), value];
    }

    arithmetic(ctx) {
      const { children } = ctx;
      const { reg_lit, ADD, SUB, DIV, MULT, MOD, CMP } = children;

      const { isRegister, value } = this.reg_lit(reg_lit[0]);

      const opLookup = () => {
        if (isRegister) {
          if (ADD && ADD[0].image === "ADD") return INSTRUCTIONS.ADD_REG;
          if (ADD && ADD[0].image === "ADDU") return INSTRUCTIONS.ADDU_REG;
          if (SUB) return INSTRUCTIONS.SUB_REG;
          if (MULT) return INSTRUCTIONS.MULT_REG;
          if (DIV) return INSTRUCTIONS.DIV_REG;
          if (MOD) return INSTRUCTIONS.MOD_REG;
          if (CMP && CMP[0].image === "CMP") return INSTRUCTIONS.CMP_REG;
          if (CMP && CMP[0].image === "CMPU") return INSTRUCTIONS.CMPU_REG;
        }

        if (ADD && ADD[0].image === "ADD") return INSTRUCTIONS.ADD_LIT;
        if (ADD && ADD[0].image === "ADDU") return INSTRUCTIONS.ADDU_LIT;
        if (SUB) return INSTRUCTIONS.SUB_LIT;
        if (MULT) return INSTRUCTIONS.MULT_LIT;
        if (DIV) return INSTRUCTIONS.DIV_LIT;
        if (MOD) return INSTRUCTIONS.MOD_LIT;
        if (CMP && CMP[0].image === "CMP") return INSTRUCTIONS.CMP_LIT;
        if (CMP && CMP[0].image === "CMPU") return INSTRUCTIONS.CMPU_LIT;
      };

      const { instruction, pattern } = opLookup();

      const fullInstruction = convertToInstruction(pattern, {
        S: isRegister ? value : undefined,
        T: this.register(ctx).value
      });

      const extraInstruction = isRegister ? [] : [i2s(value, 16)];

      return [i2s(instruction), i2s(fullInstruction), ...extraInstruction];
    }

    binary(ctx) {
      const { children } = ctx;
      const { reg_lit, SRA, SLA, AND, OR, XOR } = children;

      const { isRegister, value } = this.reg_lit(reg_lit[0]);

      const opLookup = () => {
        if (isRegister) {
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

      const fullInstruction = convertToInstruction(pattern, {
        S: isRegister ? value : undefined,
        T: this.register(ctx).value
      });

      const extraInstruction = isRegister ? [] : [i2s(value, 16)];

      return [i2s(instruction), i2s(fullInstruction), ...extraInstruction];
    }

    statement(ctx) {
      const command = Object.keys(ctx)[0];

      return this[command](ctx[command][0]);
    }

    data(ctx) {
      const segments = (ctx.segment || []).reduce(
        (acc, segment) => [...acc, ...this.visit(segment)],
        []
      );

      return [...segments];
    }

    ascii(ctx) {
      const image = ctx.STRING[0].image;
      const value = image.substring(1, image.length - 1);

      const vArr = [];

      let i = 0;
      for (i = 0; i < value.length; i += 1) {
        if (value[i] === "\\") {
          i += 1;
        }

        vArr.push(i2s(value[i].charCodeAt(0), 16));
      }

      const joined = vArr.join("");
      return [joined, joined.length];
    }

    byte(ctx) {
      return [i2s(this.char(ctx.CHAR[0]), 8), 8];
    }

    space(ctx) {
      const { value } = this.literal(ctx.LITERAL[0]);
      const size = value * 4;

      return [i2s(0, size), size];
    }

    word(ctx) {
      const { value } = this.literal(ctx.LITERAL[0]);

      return [i2s(value, 16), 16];
    }

    segment(ctx) {
      const { ascii, byte, space, word, LABEL } = ctx;

      const [value, size] = this.visit(ascii || byte || space || word);

      return [{ type: "data", name: LABEL[0].image, value, size }];
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
      const data = this.visit(ctx.data) || [];

      const main = this.visit(ctx.main);

      const methods = (ctx.method || []).reduce(
        (acc, method) => [...acc, ...this.visit(method)],
        []
      );

      const preprocess = [...data, ...main, ...methods];
      const postprocess = postProcessor(preprocess);
      return postprocess.join("");
    }
  }

  return myCustomVisitor;
};
