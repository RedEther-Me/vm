import { convertFromInstruction } from "./helpers/index.js";

import createMemory from "./memory.js";
import INSTRUCTIONS from "./instructions.js";

class CPU {
  constructor(memory, options = {}) {
    this.memory = memory;
    this.options = options;

    this.logger = options.logger || { log: () => {} };

    this.registerNames = [
      "ip",
      "acc",
      "r1",
      "r2",
      "r3",
      "r4",
      "r5",
      "r6",
      "r7",
      "r8",
      "sp",
      "fp"
    ];

    this.registers = createMemory(this.registerNames.length * 2);

    this.registerMap = this.registerNames.reduce(
      (acc, name, index) => ({ ...acc, [name]: index * 2 }),
      {}
    );

    this.reset();

    this.listeners = {};
  }

  reset() {
    this.registerNames.forEach(register => this.setRegisterByName(register, 0));
    this.setRegisterByName("sp", 0xffff - 1);
    this.setRegisterByName("fp", 0xffff - 1);

    this.stackFrameSize = 0;

    this.issueEvent({ type: "reset" });
  }

  printInstruction(instruction) {
    return instruction.toString(2).padStart(16, "0");
  }

  getName(address) {
    return this.registerNames[(address / 2) % this.registerNames.length];
  }

  getRegisterByAddress(address) {
    return this.registers.getUint16(address);
  }

  getRegister(name) {
    if (!(name in this.registerMap)) {
      throw new Error(`getRegister: Unable to find register ${name}`);
    }

    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegisterByAddress(address, value) {
    const findName = this.getName(address);

    this.setRegisterByName(findName, value);
  }

  setRegisterByName(name, value) {
    if (!(name in this.registerMap)) {
      throw new Error(`setRegister: Unable to find register ${name}`);
    }
    this.registers.setUint16(this.registerMap[name], value);

    this.issueEvent({ type: "setRegister", register: name, value });

    return;
  }

  getMemoryByAddress(address) {
    return this.memory.getUint16(address);
  }

  setMemoryByAddress(address, value) {
    this.memory.setUint16(address, value);

    this.issueEvent({ type: "setMemory", address, value });
  }

  fetch() {
    const nextInstructionAddress = this.getRegister("ip");
    const instruction = this.memory.getUint8(nextInstructionAddress);

    this.setRegisterByName("ip", nextInstructionAddress + 1);
    return instruction;
  }

  fetch16() {
    const nextInstructionAddress = this.getRegister("ip");
    const instruction = this.memory.getUint16(nextInstructionAddress);

    this.setRegisterByName("ip", nextInstructionAddress + 2);
    return instruction;
  }

  push(value) {
    const spAddress = this.getRegister("sp");
    this.memory.setUint16(spAddress, value);
    this.setRegisterByName("sp", spAddress - 2);
    this.stackFrameSize += 2;
  }

  pop() {
    const nextSpAddress = this.getRegister("sp") + 2;
    this.setRegisterByName("sp", nextSpAddress);
    this.stackFrameSize -= 2;
    return this.memory.getUint16(nextSpAddress);
  }

  pushState() {
    this.push(this.getRegister("r1"));
    this.push(this.getRegister("r2"));
    this.push(this.getRegister("r3"));
    this.push(this.getRegister("r4"));
    this.push(this.getRegister("r5"));
    this.push(this.getRegister("r6"));
    this.push(this.getRegister("r7"));
    this.push(this.getRegister("r8"));
    this.push(this.getRegister("ip"));
    this.push(this.stackFrameSize + 2);

    this.setRegisterByName("fp", this.getRegister("sp"));
    this.stackFrameSize = 0;
  }

  popState() {
    const framePointerAddress = this.getRegister("fp");
    this.setRegisterByName("sp", framePointerAddress);

    this.stackFrameSize = this.pop();
    const stackFrameSize = this.stackFrameSize;

    this.setRegisterByName("ip", this.pop());
    this.setRegisterByName("r8", this.pop());
    this.setRegisterByName("r7", this.pop());
    this.setRegisterByName("r6", this.pop());
    this.setRegisterByName("r5", this.pop());
    this.setRegisterByName("r4", this.pop());
    this.setRegisterByName("r3", this.pop());
    this.setRegisterByName("r2", this.pop());
    this.setRegisterByName("r1", this.pop());

    const nArgs = this.pop();
    for (let i = 0; i < nArgs; i++) {
      this.pop();
    }

    this.setRegisterByName("fp", framePointerAddress + stackFrameSize);
  }

  compInts(v1, v2) {
    if (v1 === v2) {
      return 0x1; // 0001
    }

    if (v1 > v2) {
      return 0x2; // 0010
    }

    if (v1 < v2) {
      return 0x4; // 0100
    }
  }

  execute(command) {
    const instruction = command & 0xff;

    switch (instruction) {
      case INSTRUCTIONS.TERMINATE.instruction: {
        this.issueEvent({ type: "halt" });
        return -1;
      }

      case INSTRUCTIONS.MOV_LIT_REG.instruction: {
        const options = this.fetch();

        const { T } = convertFromInstruction(
          INSTRUCTIONS.MOV_LIT_REG.pattern,
          options
        );
        const V = this.fetch16();

        // this.logger.log(`MOV ${T * 2} ${V}`);

        this.setRegisterByAddress(T * 2, V);
        return;
      }

      case INSTRUCTIONS.MOV_REG_REG.instruction: {
        const options = this.fetch();

        const { S, T } = convertFromInstruction(
          INSTRUCTIONS.MOV_REG_REG.pattern,
          options
        );

        const V = this.registers.getUint16(S * 2);
        this.logger.log(
          `MOV ${this.getName(S * 2)} ${this.getName(T * 2)} ${V}`
        );

        this.setRegisterByAddress(T * 2, V);
        return;
      }

      case INSTRUCTIONS.STORE_REG_HEX.instruction: {
        const options = this.fetch();

        const { S } = convertFromInstruction(
          INSTRUCTIONS.STORE_REG_HEX.pattern,
          options
        );

        const v1 = this.registers.getUint16(S * 2);
        const address = this.fetch16();

        this.setMemoryByAddress(address, v1);
        return;
      }

      case INSTRUCTIONS.STORE_REG_REG.instruction: {
        const options = this.fetch();

        const { S, T } = convertFromInstruction(
          INSTRUCTIONS.STORE_REG_REG.pattern,
          options
        );

        const v1 = this.registers.getUint16(S * 2);
        const address = this.registers.getUint16(T * 2);

        this.setMemoryByAddress(address, v1);
        return;
      }

      case INSTRUCTIONS.STORE_LIT_HEX.instruction: {
        const value = this.fetch16();
        const address = this.fetch16();

        this.logger.log("STORE_LIT_HEX", {
          value,
          address: `${address} 0x${address.toString(16)}`
        });

        this.setMemoryByAddress(address, value);
        return;
      }

      case INSTRUCTIONS.STORE_LIT_REG.instruction: {
        const options = this.fetch();

        const { T } = convertFromInstruction(
          INSTRUCTIONS.STORE_LIT_REG.pattern,
          options
        );

        const address = this.registers.getUint16(T * 2);
        const v1 = this.fetch16();

        this.setMemoryByAddress(address, v1);
        return;
      }

      case INSTRUCTIONS.LOAD_ADR.instruction: {
        const options = this.fetch();

        const { T } = convertFromInstruction(
          INSTRUCTIONS.LOAD_ADR.pattern,
          options
        );

        const address = this.fetch16();

        const value = this.getMemoryByAddress(address);
        this.setRegisterByAddress(T * 2, value);
        return;
      }

      case INSTRUCTIONS.LOAD_REG.instruction: {
        const options = this.fetch();

        const { S, T } = convertFromInstruction(
          INSTRUCTIONS.LOAD_REG.pattern,
          options
        );

        const address = this.registers.getUint16(S * 2);

        const value = this.getMemoryByAddress(address);
        this.setRegisterByAddress(T * 2, value);
        return;
      }

      case INSTRUCTIONS.COPY_MEM_HEX_HEX.instruction: {
        const from = this.fetch16();
        const to = this.fetch16();

        const value = this.getMemoryByAddress(from);
        this.setMemoryByAddress(to, value);
        return;
      }

      case INSTRUCTIONS.COPY_MEM_REG_REG.instruction: {
        const options = this.fetch();

        const { S, T } = convertFromInstruction(
          INSTRUCTIONS.COPY_MEM_REG_REG.pattern,
          options
        );

        const from = this.getRegisterByAddress(S * 2);
        const to = this.getRegisterByAddress(T * 2);

        const value = this.getMemoryByAddress(from);

        this.logger.log("COPY_MEM_REG_REG", {
          from: {
            name: this.getName(S * 2),
            location: `${from} 0x${from.toString(16)}`,
            value
          },
          to: {
            name: this.getName(T * 2),
            location: `${to} 0x${to.toString(16)}`
          }
        });

        this.setMemoryByAddress(to, value);
        return;
      }

      case INSTRUCTIONS.COPY_MEM_REG_HEX.instruction: {
        const options = this.fetch();

        const { S } = convertFromInstruction(
          INSTRUCTIONS.COPY_MEM_REG_HEX.pattern,
          options
        );

        const from = this.getRegisterByAddress(S * 2);
        const to = this.fetch16();

        const value = this.getMemoryByAddress(from);
        this.setMemoryByAddress(to, value);
        return;
      }

      case INSTRUCTIONS.COPY_MEM_HEX_REG.instruction: {
        const options = this.fetch();

        const { T } = convertFromInstruction(
          INSTRUCTIONS.COPY_MEM_HEX_REG.pattern,
          options
        );

        const from = this.fetch16();
        const to = this.getRegisterByAddress(T * 2);

        const value = this.getMemoryByAddress(from);
        this.setMemoryByAddress(to, value);
        return;
      }

      case INSTRUCTIONS.ARITH_ADD_REG.instruction:
      case INSTRUCTIONS.ARITH_SUB_REG.instruction:
      case INSTRUCTIONS.ARITH_MULT_REG.instruction:
      case INSTRUCTIONS.ARITH_DIV_REG.instruction:
      case INSTRUCTIONS.CMP_REG.instruction:
      case INSTRUCTIONS.SRA_REG.instruction:
      case INSTRUCTIONS.SLA_REG.instruction:
      case INSTRUCTIONS.AND_REG.instruction:
      case INSTRUCTIONS.OR_REG.instruction:
      case INSTRUCTIONS.XOR_REG.instruction: {
        const options = this.fetch();

        const { S, T } = convertFromInstruction(
          INSTRUCTIONS.ARITH_ADD_REG.pattern,
          options
        );
        const v1 = this.registers.getUint16(S * 2);
        const v2 = this.registers.getUint16(T * 2);

        let logInstruction;
        let result;
        switch (instruction) {
          case INSTRUCTIONS.ARITH_ADD_REG.instruction: {
            logInstruction = "ARITH_ADD_REG [v2 + v1]";
            result = v2 + v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.ARITH_SUB_REG.instruction: {
            logInstruction = "ARITH_SUB_REG [v2 - v1]";
            result = v2 - v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.ARITH_MULT_REG.instruction: {
            logInstruction = "ARITH_MULT_REG [v2 * v1]";
            result = v2 * v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.ARITH_DIV_REG.instruction: {
            logInstruction = "ARITH_DIV_REG [v2 / v1]";
            result = v2 / v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.CMP_REG.instruction: {
            logInstruction = "CMP_REG";
            result = this.compInts(v1, v2);

            this.setRegisterByName("acc", result);
            break;
          }
          case INSTRUCTIONS.SRA_REG.instruction: {
            logInstruction = "SRA_REG";
            result = v2 >> v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.SLA_REG.instruction: {
            logInstruction = "SLA_REG";
            result = v2 << v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.AND_REG.instruction: {
            logInstruction = "AND_REG";
            result = v2 & v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.OR_REG.instruction: {
            logInstruction = "OR_REG";
            result = v2 | v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.XOR_REG.instruction: {
            logInstruction = "XOR_REG";
            result = v2 ^ v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          default:
            throw new Error("arithmetic: no valid operation");
        }

        this.logger.log(instruction, {
          v2: {
            name: this.getName(T * 2),
            value: v2
          },
          v1: {
            value: v1
          },
          result: v2 + v1
        });

        return;
      }

      case INSTRUCTIONS.ARITH_ADD_LIT.instruction:
      case INSTRUCTIONS.ARITH_SUB_LIT.instruction:
      case INSTRUCTIONS.ARITH_MULT_LIT.instruction:
      case INSTRUCTIONS.ARITH_DIV_LIT.instruction:
      case INSTRUCTIONS.CMP_LIT.instruction:
      case INSTRUCTIONS.SRA_LIT.instruction:
      case INSTRUCTIONS.SLA_LIT.instruction:
      case INSTRUCTIONS.AND_LIT.instruction:
      case INSTRUCTIONS.OR_LIT.instruction:
      case INSTRUCTIONS.XOR_LIT.instruction: {
        const options = this.fetch();

        const { T } = convertFromInstruction(
          INSTRUCTIONS.ARITH_ADD_LIT.pattern,
          options
        );
        const v1 = this.fetch16();
        const v2 = this.registers.getUint16(T * 2);

        let logInstruction;
        let result;
        switch (instruction) {
          case INSTRUCTIONS.ARITH_ADD_LIT.instruction: {
            logInstruction = "ARITH_ADD_LIT [v2 + v1]";
            result = v2 + v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.ARITH_SUB_LIT.instruction: {
            logInstruction = "ARITH_SUB_LIT [v2 - v1]";
            result = v2 - v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.ARITH_MULT_LIT.instruction: {
            logInstruction = "ARITH_MULT_LIT [v2 * v1]";
            result = v2 * v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.ARITH_DIV_LIT.instruction: {
            logInstruction = "ARITH_DIV_LIT [v2 / v1]";
            result = v2 / v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.CMP_LIT.instruction: {
            logInstruction = "CMP_LIT";
            result = this.compInts(v1, v2);

            this.setRegisterByName("acc", result);
            break;
          }
          case INSTRUCTIONS.SRA_LIT.instruction: {
            logInstruction = "SRA_LIT";
            result = v2 >> v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.SLA_LIT.instruction: {
            logInstruction = "SLA_LIT";
            result = v2 << v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.AND_LIT.instruction: {
            logInstruction = "AND_LIT";
            result = v2 & v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.OR_LIT.instruction: {
            logInstruction = "OR_LIT";
            result = v2 | v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          case INSTRUCTIONS.XOR_LIT.instruction: {
            logInstruction = "XOR_LIT";
            result = v2 ^ v1;

            this.setRegisterByAddress(T * 2, result);
            break;
          }
          default:
            throw new Error(
              "arithmetic: no valid operation ",
              instruction.toString(16).padStart(4, "0")
            );
        }

        this.logger.log(logInstruction, {
          v2: {
            name: this.getName(T * 2),
            value: v2
          },
          v1: {
            value: v1
          },
          result: v2 + v1
        });

        return;
      }

      // Jump if not equal
      case INSTRUCTIONS.JMP_NOT_EQ.instruction: {
        const cmp = this.getRegister("acc");
        const address = this.fetch16();

        if (!(cmp & 0x1)) {
          this.setRegisterByName("ip", address);
        }

        return;
      }

      // Push Literal
      case INSTRUCTIONS.PSH_LIT.instruction: {
        const value = this.fetch16();
        this.push(value);
        return;
      }

      // Push Register
      case INSTRUCTIONS.PSH_REG.instruction: {
        const options = this.fetch();

        const { R } = convertFromInstruction(
          INSTRUCTIONS.PSH_REG.pattern,
          options
        );

        const value = this.registers.getUint16(R);
        this.push(value);
        return;
      }

      // Pop Register
      case INSTRUCTIONS.POP.instruction: {
        const options = this.fetch();

        const { R } = convertFromInstruction(INSTRUCTIONS.POP.pattern, options);

        const value = this.pop();
        this.setRegisterByAddress(R, value);
        return;
      }

      // Call literal
      case INSTRUCTIONS.CAL_LIT.instruction: {
        const address = this.fetch16();

        this.pushState();
        this.setRegisterByName("ip", address);
        return;
      }

      // Call register
      case INSTRUCTIONS.CAL_REG.instruction: {
        const options = this.fetch();

        const { R } = convertFromInstruction(
          INSTRUCTIONS.CAL_REG.pattern,
          options
        );

        const address = this.registers.getUint16(R);
        this.pushState();
        this.setRegisterByName("ip", address);
        return;
      }

      // Return from subroutine
      case INSTRUCTIONS.RET.instruction: {
        this.popState();
        return;
      }

      default: {
        throw new Error(
          `Illegal Instruction: ${instruction.toString(16).padStart(2)}`
        );
      }
    }
  }

  step() {
    const instruction = this.fetch();
    return this.execute(instruction);
  }

  run() {
    const halt = this.step();

    if (halt !== -1) {
      setImmediate(() => this.run());
    }
  }

  issueEvent(type) {
    if (this.listeners) {
      Object.values(this.listeners).forEach(listener => listener(type));
    }
  }

  addListener(name, listener) {
    this.listeners[`${name}`] = listener;

    listener({
      type: "initial",
      ...this.registerNames.reduce(
        (acc, reg) => ({ ...acc, [reg]: this.getRegister(reg) }),
        {}
      )
    });
  }

  removeListener(name) {
    delete this.listeners[`${name}`];
  }
}

export default CPU;
