import { convertFromInstruction } from "../helpers";

import createMemory from "./memory";
import INSTRUCTIONS from "./instructions";

class CPU {
  constructor(memory, debug) {
    this.memory = memory;
    this.debug = debug;

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

    this.setRegister("sp", 0xffff - 1);
    this.setRegister("fp", 0xffff - 1);

    this.stackFrameSize = 0;
  }

  debug() {
    this.registerNames.forEach(name => {
      console.log(
        `${name}: 0x${this.getRegister(name)
          .toString(16)
          .padStart(4, "0")}`
      );
    });
    console.log();
  }

  printInstruction(instruction) {
    return instruction.toString(2).padStart(16, "0");
  }

  getRegister(name) {
    if (!(name in this.registerMap)) {
      throw new Error(`getRegister: Unable to find register ${name}`);
    }

    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegister(name, value) {
    if (!(name in this.registerMap)) {
      throw new Error(`setRegister: Unable to find register ${name}`);
    }
    this.registers.setUint16(this.registerMap[name], value);

    return;
  }

  fetch() {
    const nextInstructionAddress = this.getRegister("ip");
    const instruction = this.memory.getUint8(nextInstructionAddress);

    this.setRegister("ip", nextInstructionAddress + 1);
    return instruction;
  }

  fetch16() {
    const nextInstructionAddress = this.getRegister("ip");
    const instruction = this.memory.getUint16(nextInstructionAddress);

    this.setRegister("ip", nextInstructionAddress + 2);
    return instruction;
  }

  push(value) {
    const spAddress = this.getRegister("sp");
    this.memory.setUint16(spAddress, value);
    this.setRegister("sp", spAddress - 2);
    this.stackFrameSize += 2;
  }

  pop() {
    const nextSpAddress = this.getRegister("sp") + 2;
    this.setRegister("sp", nextSpAddress);
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

    this.setRegister("fp", this.getRegister("sp"));
    this.stackFrameSize = 0;
  }

  popState() {
    const framePointerAddress = this.getRegister("fp");
    this.setRegister("sp", framePointerAddress);

    this.stackFrameSize = this.pop();
    const stackFrameSize = this.stackFrameSize;

    this.setRegister("ip", this.pop());
    this.setRegister("r8", this.pop());
    this.setRegister("r7", this.pop());
    this.setRegister("r6", this.pop());
    this.setRegister("r5", this.pop());
    this.setRegister("r4", this.pop());
    this.setRegister("r3", this.pop());
    this.setRegister("r2", this.pop());
    this.setRegister("r1", this.pop());

    const nArgs = this.pop();
    for (let i = 0; i < nArgs; i++) {
      this.pop();
    }

    this.setRegister("fp", framePointerAddress + stackFrameSize);
  }

  execute(command) {
    const instruction = command & 0xff;

    switch (instruction) {
      case INSTRUCTIONS.TERMINATE.instruction: {
        return -1;
      }

      case INSTRUCTIONS.MOV_LIT_REG.instruction: {
        const options = this.fetch();

        const { R } = convertFromInstruction(
          INSTRUCTIONS.MOV_LIT_REG.pattern,
          options
        );
        const V = this.fetch16();

        this.registers.setUint16(R * 2, V);
        return;
      }

      case INSTRUCTIONS.MOV_REG_MEM.instruction: {
        const options = this.fetch();

        const { R } = convertFromInstruction(
          INSTRUCTIONS.MOV_REG_MEM.pattern,
          options
        );

        const v1 = this.registers.getUint16(R * 2);
        const address = this.fetch16();

        this.memory.setUint16(address, v1);
        return;
      }

      case INSTRUCTIONS.ARITHMETIC.instruction: {
        const options = this.fetch();

        const { S, T, O } = convertFromInstruction(
          INSTRUCTIONS.ARITHMETIC.pattern,
          options
        );
        const v1 = this.registers.getUint16(S * 2);
        const v2 = this.registers.getUint16(T * 2);

        switch (O) {
          case 0x0: {
            this.registers.setUint16(T * 2, v1 + v2);
            return;
          }
          case 0x1: {
            this.registers.setUint16(T * 2, v1 - v2);
            return;
          }
          case 0x2: {
            this.registers.setUint16(T * 2, v1 / v2);
            return;
          }
          case 0x3: {
            this.registers.setUint16(T * 2, v1 * v2);
            return;
          }
          default:
            throw new Error("arithmetic: no valid operation");
        }
      }

      // Jump if not equal
      case INSTRUCTIONS.JMP_NOT_EQ.instruction: {
        const value = this.fetch16();
        const address = this.fetch16();

        if (value !== this.getRegister("acc")) {
          this.setRegister("ip", address);
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
        this.registers.setUint16(R, value);
        return;
      }

      // Call literal
      case INSTRUCTIONS.CAL_LIT.instruction: {
        const address = this.fetch16();
        this.pushState();
        this.setRegister("ip", address);
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
        this.setRegister("ip", address);
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
}

export default CPU;
