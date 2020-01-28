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

  getRegister(name) {
    if (!(name in this.registerMap)) {
      throw new Error(`getRegister: Unable to find register ${name}`);
    }

    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegisterByAddress(address, value) {
    const findName = this.registerNames[
      (address / 2) % this.registerNames.length
    ];

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

  execute(command) {
    const instruction = command & 0xff;

    switch (instruction) {
      case INSTRUCTIONS.TERMINATE.instruction: {
        this.issueEvent({ type: "halt" });
        return -1;
      }

      case INSTRUCTIONS.MOV_LIT_REG.instruction: {
        const options = this.fetch();

        const { R } = convertFromInstruction(
          INSTRUCTIONS.MOV_LIT_REG.pattern,
          options
        );
        const V = this.fetch16();

        this.setRegisterByAddress(R * 2, V);
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

        this.setMemoryByAddress(address, v1);
        return;
      }

      case INSTRUCTIONS.MOV_LIT_MEM.instruction: {
        const value = this.fetch16();
        const address = this.fetch16();

        this.setMemoryByAddress(address, value);
        return;
      }

      case INSTRUCTIONS.MOV_MEM_REG.instruction: {
        const options = this.fetch();

        const { R } = convertFromInstruction(
          INSTRUCTIONS.MOV_REG_MEM.pattern,
          options
        );

        const address = this.fetch16();

        const value = this.getMemoryByAddress(address);
        this.setRegisterByAddress(R * 2, value);
        return;
      }

      case INSTRUCTIONS.MOV_COPY_MEM.instruction: {
        const from = this.fetch16();
        const to = this.fetch16();

        const value = this.getMemoryByAddress(from);
        this.setMemoryByAddress(to, value);
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
