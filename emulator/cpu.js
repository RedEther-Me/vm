const { convertFromInstruction } = require("../helpers");

const createMemory = require("./memory");
const INSTRUCTIONS = require("./instructions");

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
      "r8"
    ];

    this.registers = createMemory(this.registerNames.length * 2);

    this.registerMap = this.registerNames.reduce(
      (acc, name, index) => ({ ...acc, [name]: index * 2 }),
      {}
    );
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

    // if (this.debug) {
    //   console.log({
    //     type: "getRegister",
    //     name,
    //     value: this.registers.getUint16(this.registerMap[name]),
    //     regMem: this.registerMap[name],
    //     registers: this.registers
    //   });
    // }
    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegister(name, value) {
    if (!(name in this.registerMap)) {
      throw new Error(`setRegister: Unable to find register ${name}`);
    }
    this.registers.setUint16(this.registerMap[name], value);

    // if (this.debug) {
    //   console.log({
    //     type: "setRegister",
    //     name,
    //     value,
    //     regMem: this.registerMap[name],
    //     registers: this.registers
    //   });
    // }

    return;
  }

  fetch() {
    const nextInstructionAddress = this.getRegister("ip");
    const instruction = this.memory.getUint8(nextInstructionAddress);

    if (this.debug) {
      console.log({
        instruction,
        nextInstructionAddress,
        next: nextInstructionAddress + 1
      });
    }

    this.setRegister("ip", nextInstructionAddress + 1);
    return instruction;
  }

  fetch16() {
    const nextInstructionAddress = this.getRegister("ip");
    const instruction = this.memory.getUint16(nextInstructionAddress);

    if (this.debug) {
      console.log({
        instruction,
        nextInstructionAddress,
        next: nextInstructionAddress + 2
      });
    }

    this.setRegister("ip", nextInstructionAddress + 2);
    return instruction;
  }

  execute(command) {
    const instruction = command & 0x0f;

    switch (instruction) {
      case INSTRUCTIONS.TERMINATE.instruction: {
        return process.exit(0);
      }

      case INSTRUCTIONS.MOV_LIT_REG.instruction: {
        const options = this.fetch();

        const { R } = convertFromInstruction(
          INSTRUCTIONS.MOV_LIT_REG.pattern,
          options
        );
        const V = this.fetch16();

        if (this.debug) {
          console.log({
            type: "MOV_LIT_REG",
            R,
            V,
            command: this.printInstruction(command),
            pattern: INSTRUCTIONS.MOV_LIT_REG.mask
          });
        }

        this.registers.setUint16(R * 2, V);
        return;
      }

      case INSTRUCTIONS.MOV_REG_MEM.instruction: {
        const options = this.fetch();

        const { R } = convertFromInstruction(
          INSTRUCTIONS.MOV_REG_MEM.pattern,
          options
        );

        if (this.debug) {
          console.log({
            type: "MOV_REG_MEM",
            R,
            command: this.printInstruction(command),
            pattern: INSTRUCTIONS.MOV_REG_MEM.mask
          });
        }

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

        if (this.debug) {
          console.log({
            type: "ARITHMETIC",
            S,
            T,
            O,
            command: this.printInstruction(command),
            pattern: INSTRUCTIONS.ARITHMETIC.mask
          });
        }

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

      default: {
        throw new Error(
          `Illegal Instruction: ${instruction.toString(16).padStart(2)}`
        );
      }

      // case INSTRUCTIONS.MOV_LIT_R1: {
      //   const literal = this.fetch16();
      //   this.setRegister("r1", literal);
      //   return;
      // }

      // case INSTRUCTIONS.MOV_LIT_R2: {
      //   const literal = this.fetch16();
      //   this.setRegister("r2", literal);
      //   return;
      // }

      // case INSTRUCTIONS.ADD_REG_REG: {
      //   const a1 = this.fetch();
      //   const a2 = this.fetch();

      //   const v1 = this.registers.getUint16(a1 * 2);
      //   const v2 = this.registers.getUint16(a2 * 2);

      //   this.setRegister("acc", v1 + v2);
      //   return;
      // }

      // case INSTRUCTIONS.PRINT_REG: {
      //   const a1 = this.fetch();
      //   const v1 = this.registers.getUint16(a1 * 2);

      //   console.log(v1, v1.toString(16).padStart(4, "0"));
      // }
    }
  }

  step() {
    const instruction = this.fetch();
    return this.execute(instruction);
  }

  run() {
    const halt = this.step();

    if (!halt) {
      setImmediate(() => this.run());
    }
  }
}

module.exports = CPU;
